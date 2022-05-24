import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { Order } from './entities/order.entity';
import { Trade } from './entities/trade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Market, Order, Trade])],
  controllers: [],
  providers: []
})
export class OrderModule {}
