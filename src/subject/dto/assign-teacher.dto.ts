import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignTeacherDto {
  @Type(() => Number)
  @IsInt()
  teacherId!: number;
}
