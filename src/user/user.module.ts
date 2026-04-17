import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from 'src/subject/entities/subject.entity';
import { UserType } from 'src/user-type/entities/user-type.entity';
import { SubjectModule } from 'src/subject/subject.module';
import { UserTypeModule } from 'src/user-type/user-type.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User]),SubjectModule,UserTypeModule,AuthModule],
  exports: [TypeOrmModule]
})
export class UserModule {}
