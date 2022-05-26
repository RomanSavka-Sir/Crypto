import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Market } from 'src/order/entities/market.entity';
import { Photo } from 'src/shared/entities/photo.entity';
import { UserRole } from 'src/user/entities/user.role.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserRole, Market, Photo])],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService]
})
export class ManagerModule {}
