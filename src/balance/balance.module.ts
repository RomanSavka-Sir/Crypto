import { User } from './../user/entities/user.entity';
import { BalanceService } from './balance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Balance } from './entities/balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Balance, User])],
  controllers: [],
  providers: [BalanceService],
  exports: [BalanceService]
})
export class BalanceModule {}
