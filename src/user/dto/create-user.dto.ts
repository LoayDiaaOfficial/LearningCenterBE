import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name!:string;

    @IsString()
    @IsNotEmpty()
    email!:string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    subjectId ?: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    userTypeId !: number;
}
