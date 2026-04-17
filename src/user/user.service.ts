import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { SubjectService } from 'src/subject/subject.service';
import { UserTypeService } from 'src/user-type/user-type.service';

@Injectable()
export class UserService {
 
  constructor(
      @InjectRepository(User)
      private readonly userRepo : Repository<User>,

      private readonly subjectService : SubjectService,

      private readonly userTypeService : UserTypeService
    ) {}


  
  async create(createUserDto: CreateUserDto) {
   console.log("Checking if email exists before");
   const exists = await this.userRepo.existsBy({email:createUserDto.email});
   if(!exists){
   console.log("Saving to DB");
    const user =  this.userRepo.create({
      name: createUserDto.name,
      email : createUserDto.email,
      password : createUserDto.password,
      subject : createUserDto.subjectId ? {id : createUserDto.subjectId} : undefined,
      userType : {id : createUserDto.userTypeId}
    });
    return await this.userRepo.save(user);
  }else throw new ConflictException("This Email Already Exists");
  }

  findAll() {
    return this.userRepo.find();
  }

  async findOne(email : string) {
    return this.userRepo.findOneBy({email:email});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user  = await this.userRepo.preload({
      id,
      name :updateUserDto.name,
      email:updateUserDto.email,
      password: updateUserDto.password
    })

    if (!user){
      throw new NotFoundException("No User Found");
    }

    const [subject,userType] = await Promise.all([
      updateUserDto.subjectId != null ? this.subjectService.findById(updateUserDto.subjectId) : Promise.resolve(undefined),
      updateUserDto.userTypeId != null? this.userTypeService.findOneById(updateUserDto.userTypeId) : Promise.resolve(undefined)
    ])

    if(updateUserDto.subjectId !== undefined && !subject) throw new NotFoundException("No Subject Found with this ID");
    

    if(updateUserDto.userTypeId !== undefined && !userType) throw new NotFoundException("No User Type Found with this ID ");

    if(subject) user.subject= subject;
    if(userType) user.userType = userType; 
    

    return this.userRepo.save(user);
  }

  remove(email: string) {
    return this.userRepo.delete({email:email});
  }


  async validateUser(email: string, password: string): Promise<User | null> {
    const user  = await this.findOne(email)

    if(user && user.password === password){
    return user;
    } else return null;
  }

}
