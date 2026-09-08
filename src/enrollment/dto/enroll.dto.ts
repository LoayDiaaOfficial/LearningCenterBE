import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class EnrollDto {
  @Type(() => Number)
  @IsInt()
  studentId!: number;

  @Type(() => Number)
  @IsInt()
  subjectId!: number;
}
