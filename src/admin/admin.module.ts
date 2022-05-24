import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/user/entities/user.role.entity';
import { UserModule } from 'src/user/user.module';
import { Mailer } from 'src/shared/helpers/mailer';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole]), UserModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService, Mailer],
  exports: [AdminService]
})
export class AdminModule {}
