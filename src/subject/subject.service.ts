import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  create(createSubjectDto: CreateSubjectDto) {
    const subject = this.subjectRepo.create(createSubjectDto);
    return this.subjectRepo.save(subject);
  }

  findAll() {
    return this.subjectRepo.find({ relations: ['teacher'] });
  }

  findById(id: number) {
    return this.subjectRepo.findOneBy({ id });
  }

  findByIdWithTeacher(id: number) {
    return this.subjectRepo.findOne({
      where: { id },
      relations: ['teacher'],
    });
  }

  findOne(name: string) {
    return this.subjectRepo.findOne({
      where: { name },
      relations: ['teacher'],
    });
  }

  async assignTeacher(subjectId: number, teacherId: number) {
    const subject = await this.findById(subjectId);
    if (!subject) throw new NotFoundException('Subject not found');

    const teacher = await this.userRepo.findOne({
      where: { id: teacherId },
      relations: ['userType'],
    });
    if (!teacher) throw new NotFoundException('Teacher not found');
    if (teacher.userType?.type !== Role.Teacher) {
      throw new BadRequestException('User is not a teacher');
    }

    subject.teacher = teacher;
    return this.subjectRepo.save(subject);
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.subjectRepo.preload({
      id,
      ...updateSubjectDto,
    });

    if (!subject) {
      throw new NotFoundException(`Subject not found`);
    }

    return this.subjectRepo.save(subject);
  }

  remove(name: string) {
    return this.subjectRepo.delete({ name });
  }
}
