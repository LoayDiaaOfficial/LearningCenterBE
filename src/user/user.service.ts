import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SubjectService } from 'src/subject/subject.service';
import { UserTypeService } from 'src/user-type/user-type.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly subjectService: SubjectService,
    private readonly userTypeService: UserTypeService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const exists = await this.userRepo.existsBy({ email: createUserDto.email });
    if (exists) throw new ConflictException('This Email Already Exists');

    const user = this.userRepo.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: await this.authService.hashPassword(createUserDto.password),
      subject: createUserDto.subjectId ? { id: createUserDto.subjectId } : undefined,
      userType: { id: createUserDto.userTypeId },
    });
    const saved = await this.userRepo.save(user);
    return this.findById(saved.id);
  }

  findAll() {
    return this.userRepo.find();
  }

  findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async findOne(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new NotFoundException('No User Found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.preload({
      id,
      name: updateUserDto.name,
      email: updateUserDto.email,
    });

    if (!user) {
      throw new NotFoundException('No User Found');
    }

    if (updateUserDto.password) {
      user.password = await this.authService.hashPassword(updateUserDto.password);
    }

    const [subject, userType] = await Promise.all([
      updateUserDto.subjectId != null
        ? this.subjectService.findById(updateUserDto.subjectId)
        : Promise.resolve(undefined),
      updateUserDto.userTypeId != null
        ? this.userTypeService.findOneById(updateUserDto.userTypeId)
        : Promise.resolve(undefined),
    ]);

    if (updateUserDto.subjectId !== undefined && !subject) {
      throw new NotFoundException('No Subject Found with this ID');
    }

    if (updateUserDto.userTypeId !== undefined && !userType) {
      throw new NotFoundException('No User Type Found with this ID ');
    }

    if (subject) user.subject = subject;
    if (userType) user.userType = userType;

    await this.userRepo.save(user);
    return this.findById(id);
  }

  async remove(email: string) {
    const result = await this.userRepo.delete({ email });
    if (!result.affected) throw new NotFoundException('No User Found');
    return { deleted: true };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.userType', 'userType')
      .leftJoinAndSelect('user.subject', 'subject')
      .where('user.email = :email', { email })
      .getOne();

    if (user && (await this.authService.validatePassword(password, user.password))) {
      return user;
    }
    return null;
  }
}
