import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertGradeDto {
  @Type(() => Number)
  @IsInt()
  studentId!: number;

  @Type(() => Number)
  @IsInt()
  subjectId!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  score!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
