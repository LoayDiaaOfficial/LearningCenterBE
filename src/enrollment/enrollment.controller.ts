import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollDto } from './dto/enroll.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { CurrentUser, AuthUser } from 'src/auth/decorators/current-user.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Roles(Role.Admin, Role.Teacher)
  @Post()
  enroll(@Body() dto: EnrollDto, @CurrentUser() user: AuthUser) {
    return this.enrollmentService.enroll(dto, user);
  }

  @Roles(Role.Student)
  @Get('me')
  myEnrollments(@CurrentUser() user: AuthUser) {
    return this.enrollmentService.myEnrollments(user.id);
  }

  @Roles(Role.Admin, Role.Teacher)
  @Get('subject/:subjectId')
  bySubject(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Query() pagination: PaginationQueryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.enrollmentService.bySubject(subjectId, user, pagination);
  }

  @Roles(Role.Admin, Role.Teacher)
  @Delete(':id')
  unenroll(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.enrollmentService.unenroll(id, user);
  }
}
