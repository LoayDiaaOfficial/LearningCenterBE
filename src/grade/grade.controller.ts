import { Body, Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { GradeService } from './grade.service';
import { UpsertGradeDto } from './dto/upsert-grade.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { CurrentUser, AuthUser } from 'src/auth/decorators/current-user.decorator';

@Controller('grade')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Roles(Role.Admin, Role.Teacher)
  @Put()
  upsert(@Body() dto: UpsertGradeDto, @CurrentUser() user: AuthUser) {
    return this.gradeService.upsert(dto, user);
  }

  @Roles(Role.Student)
  @Get('me')
  myGrades(@CurrentUser() user: AuthUser) {
    return this.gradeService.myGrades(user.id);
  }

  @Roles(Role.Admin, Role.Teacher)
  @Get('subject/:subjectId')
  bySubject(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.gradeService.bySubject(subjectId, user);
  }
}
