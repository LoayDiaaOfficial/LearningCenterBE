import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollDto } from './dto/enroll.dto';
import { UserService } from 'src/user/user.service';
import { SubjectService } from 'src/subject/subject.service';
import { AuthUser } from 'src/auth/decorators/current-user.decorator';
import { Role } from 'src/enums/role.enum';
import { MAX_STUDENTS_PER_SUBJECT } from 'src/common/constants';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    private readonly userService: UserService,
    private readonly subjectService: SubjectService,
  ) {}

  async enroll(dto: EnrollDto, actor: AuthUser) {
    const subject = await this.subjectService.findByIdWithTeacher(dto.subjectId);
    if (!subject) throw new NotFoundException('Subject not found');

    this.assertCanManageSubject(actor, subject.teacher?.id);

    const student = await this.userService.findById(dto.studentId);
    if (!student) throw new NotFoundException('Student not found');
    if (student.userType?.type !== Role.Student) {
      throw new BadRequestException('Only students can be enrolled');
    }

    const already = await this.enrollmentRepo.existsBy({
      studentId: dto.studentId,
      subjectId: dto.subjectId,
    });
    if (already) throw new ConflictException('Student is already enrolled');

    const count = await this.enrollmentRepo.countBy({ subjectId: dto.subjectId });
    if (count >= MAX_STUDENTS_PER_SUBJECT) {
      throw new BadRequestException(
        `Subject is full (max ${MAX_STUDENTS_PER_SUBJECT} students)`,
      );
    }

    const enrollment = this.enrollmentRepo.create({
      studentId: dto.studentId,
      subjectId: dto.subjectId,
    });
    return this.enrollmentRepo.save(enrollment);
  }

  async myEnrollments(studentId: number) {
    return this.enrollmentRepo.find({
      where: { studentId },
      relations: ['subject', 'subject.teacher'],
    });
  }

  async bySubject(
    subjectId: number,
    actor: AuthUser,
    pagination: PaginationQueryDto,
  ) {
    const subject = await this.subjectService.findByIdWithTeacher(subjectId);
    if (!subject) throw new NotFoundException('Subject not found');
    this.assertCanManageSubject(actor, subject.teacher?.id);

    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const skip = (page - 1) * limit;

    const [enrollments, total] = await this.enrollmentRepo.findAndCount({
      where: { subjectId },
      relations: ['student', 'student.userType'],
      order: { enrolledAt: 'ASC', id: 'ASC' },
      skip,
      take: limit,
    });

    return {
      data: enrollments.map((enrollment) => ({
        enrollmentId: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        student: enrollment.student,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
    };
  }

  async unenroll(id: number, actor: AuthUser) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { id },
      relations: ['subject', 'subject.teacher'],
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    this.assertCanManageSubject(actor, enrollment.subject.teacher?.id);
    await this.enrollmentRepo.delete(id);
    return { deleted: true };
  }

  findByStudentAndSubject(studentId: number, subjectId: number) {
    return this.enrollmentRepo.findOne({
      where: { studentId, subjectId },
      relations: ['subject', 'subject.teacher', 'student'],
    });
  }

  private assertCanManageSubject(actor: AuthUser, teacherId?: number) {
    if (actor.role === Role.Admin) return;
    if (actor.role === Role.Teacher && teacherId === actor.id) return;
    throw new ForbiddenException('You cannot manage enrollments for this subject');
  }
}
