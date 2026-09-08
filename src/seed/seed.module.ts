import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from 'src/user/entities/user.entity';
import { UserType } from 'src/user-type/entities/user-type.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserType]), AuthModule],
  providers: [SeedService],
})
export class SeedModule {}
