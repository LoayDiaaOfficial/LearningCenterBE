import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class SubjectService {
    constructor(
        @InjectRepository(Subject)
        private readonly subjectRepo : Repository<Subject>,
      ) {}

create(createSubjectDto: CreateSubjectDto) {
    const subject = this.subjectRepo.create(createSubjectDto);
    return this.subjectRepo.save(subject);
  }
  findAll() {
    return this.subjectRepo.find();
  }

  findById(id : number){
    return this.subjectRepo.findOneBy({id:id});
  }

  findOne(name: string) {
    return this.subjectRepo.findOneBy({name:name});
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

  remove(name:string) {
    return this.subjectRepo.delete({name:name});
  }
}
