import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { SubjectModule } from 'src/subject/subject.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grade]),
    EnrollmentModule,
    SubjectModule,
  ],
  controllers: [GradeController],
  providers: [GradeService],
})
export class GradeModule {}
