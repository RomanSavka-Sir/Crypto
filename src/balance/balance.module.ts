import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Balance } from './entities/balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Balance])],
  controllers: [],
  providers: []
})
export class BalanceModule {}
