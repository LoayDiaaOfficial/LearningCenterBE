import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { UpsertGradeDto } from './dto/upsert-grade.dto';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { SubjectService } from 'src/subject/subject.service';
import { AuthUser } from 'src/auth/decorators/current-user.decorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepo: Repository<Grade>,
    private readonly enrollmentService: EnrollmentService,
    private readonly subjectService: SubjectService,
  ) {}

  async upsert(dto: UpsertGradeDto, actor: AuthUser) {
    const enrollment = await this.enrollmentService.findByStudentAndSubject(
      dto.studentId,
      dto.subjectId,
    );
    if (!enrollment) {
      throw new NotFoundException('Student is not enrolled in this subject');
    }

    this.assertCanGradeSubject(actor, enrollment.subject.teacher?.id);

    let grade = await this.gradeRepo.findOne({
      where: { enrollmentId: enrollment.id },
    });

    if (!grade) {
      grade = this.gradeRepo.create({
        enrollmentId: enrollment.id,
        score: dto.score,
        comment: dto.comment ?? null,
        gradedBy: { id: actor.id },
      });
    } else {
      grade.score = dto.score;
      grade.comment = dto.comment ?? grade.comment;
      grade.gradedBy = { id: actor.id } as Grade['gradedBy'];
    }

    return this.gradeRepo.save(grade);
  }

  myGrades(studentId: number) {
    return this.gradeRepo.find({
      where: { enrollment: { studentId } },
      relations: ['enrollment', 'enrollment.subject'],
    });
  }

  async bySubject(subjectId: number, actor: AuthUser) {
    const subject = await this.subjectService.findByIdWithTeacher(subjectId);
    if (!subject) throw new NotFoundException('Subject not found');
    this.assertCanGradeSubject(actor, subject.teacher?.id);

    return this.gradeRepo.find({
      where: { enrollment: { subjectId } },
      relations: ['enrollment', 'enrollment.student', 'enrollment.subject'],
    });
  }

  private assertCanGradeSubject(actor: AuthUser, teacherId?: number) {
    if (actor.role === Role.Admin) return;
    if (actor.role === Role.Teacher && teacherId === actor.id) return;
    throw new ForbiddenException('You cannot grade this subject');
  }
}
