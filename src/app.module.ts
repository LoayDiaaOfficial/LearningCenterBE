import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeModule } from './user-type/user-type.module';
import { SubjectModule } from './subject/subject.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-super-queen-alvrernt.c-3.eu-central-1.aws.neon.tech',
      port: 5432,
      username: 'neondb_owner',
      password: 'npg_FRJ1vVQ2eyjP',
      database: 'LearningCenterDB',
      ssl: { rejectUnauthorized: false },
      synchronize: true, // ONLY in development
      autoLoadEntities: true, // loads all entities aSutomatically
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: '',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'LearningCenterDB',
    //   synchronize: true, // ONLY in development
    //   autoLoadEntities: true, // loads all entities aSutomatically
    // }),
    UserTypeModule,
    SubjectModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
