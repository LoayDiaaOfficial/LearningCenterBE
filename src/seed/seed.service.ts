import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from 'src/user-type/entities/user-type.entity';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/enums/role.enum';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepo: Repository<UserType>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedAdmin();
  }

  private async seedRoles() {
    for (const type of Object.values(Role)) {
      const exists = await this.userTypeRepo.existsBy({ type });
      if (!exists) {
        await this.userTypeRepo.save(this.userTypeRepo.create({ type }));
        this.logger.log(`Created user type: ${type}`);
      }
    }
  }

  private async seedAdmin() {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!email || !password) {
      this.logger.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set; skipping admin seed');
      return;
    }

    const exists = await this.userRepo.existsBy({ email });
    if (exists) return;

    const adminType = await this.userTypeRepo.findOneBy({ type: Role.Admin });
    if (!adminType) return;

    await this.userRepo.save(
      this.userRepo.create({
        name: 'Admin',
        email,
        password: await this.authService.hashPassword(password),
        userType: adminType,
      }),
    );
    this.logger.log(`Seeded admin user ${email}`);
  }
}
