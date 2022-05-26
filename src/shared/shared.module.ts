import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/user/entities/user.role.entity';
import { Currency } from './entities/currency.entity';
import { Photo } from './entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency, UserRole, Photo])],
  controllers: [],
  providers: []
})
export class SharedModule {}
