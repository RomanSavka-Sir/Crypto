import { BalanceModule } from './../balance/balance.module';
import { SharedModule } from './../shared/shared.module';
import { Currency } from './../shared/entities/currency.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from 'src/order/entities/market.entity';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.role.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Role } from './entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Role, Market, Currency]),
    SharedModule,
    BalanceModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
