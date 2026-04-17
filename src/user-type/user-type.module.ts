import { Module } from '@nestjs/common';
import { UserTypeService } from './user-type.service';
import { UserTypeController } from './user-type.controller';
import { UserType } from './entities/user-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UserTypeController],
  providers: [UserTypeService],
  imports: [TypeOrmModule.forFeature([UserType])],
  exports: [TypeOrmModule,UserTypeService]
})
export class UserTypeModule {}
