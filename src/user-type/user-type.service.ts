import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UserType } from './entities/user-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserTypeService {
  constructor(
      @InjectRepository(UserType)
      private readonly userTypeRepo : Repository<UserType>,
    ) {}

 create(createUserTypeDto: CreateUserTypeDto) {
    const userType=  this.userTypeRepo.create(createUserTypeDto);
    return this.userTypeRepo.save(userType);
  }
  findAll() {
    return this.userTypeRepo.find();
  }

  findOneById(id : number){
    return this.userTypeRepo.findOneBy({id});
  }

  findOne(type:string) {
    return this.userTypeRepo.findOneBy({type});
  }

  async update(id: number, updateUserTypeDto: UpdateUserTypeDto) {
    const userType = await this.userTypeRepo.preload({
      id,
      ...updateUserTypeDto
    })

    if(!userType){
      return new NotFoundException("There is no userType with this ID");
    }

    return this.userTypeRepo.save(userType);
  }

  remove(type: string) {
    return this.userTypeRepo.delete(type);
  }
}
