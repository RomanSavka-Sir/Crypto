import { BalanceModule } from './../balance/balance.module';
import { OrderService } from './order.service';
import { UserRole } from './../user/entities/user.role.entity';
import { OrderController } from './order.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { Order } from './entities/order.entity';
import { Trade } from './entities/trade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Market, Order, Trade, UserRole]),
    BalanceModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
