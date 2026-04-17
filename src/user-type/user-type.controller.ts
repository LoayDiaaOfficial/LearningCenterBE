import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserTypeService } from './user-type.service';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';

@Controller('user-type')
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Post()
  create(@Body() createUserTypeDto: CreateUserTypeDto) {
    return this.userTypeService.create(createUserTypeDto);
  }

  @Get()
  findAll() {
    return this.userTypeService.findAll();
  }

  @Get(':type')
  findOne(@Param('type') type: string) {
    return this.userTypeService.findOne(type);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserTypeDto: UpdateUserTypeDto) {
    return this.userTypeService.update(+id, updateUserTypeDto);
  }

  @Delete('type')
  remove(@Param('type') type: string) {
    return this.userTypeService.remove(type);
  }
}
