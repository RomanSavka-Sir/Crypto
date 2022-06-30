import { BalanceService } from './../balance/balance.service';
import { Trade } from './entities/trade.entity';
import { OrderTypeEnum } from './enums/order.type.enum';
import { Injectable, BadRequestException } from '@nestjs/common';
import { getManager, EntityManager, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create.order.dto';
import { Order } from './entities/order.entity';
import { OrderStatusEnum } from './enums/order.status.enum';
import { Balance } from 'src/balance/entities/balance.entity';
import { GetOrdersResponseDto } from './dto/get.orders.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { GetTradesResponseDto } from './dto/get.trades.response.dto';

@Injectable()
export class OrderService {
  constructor(
    private balanceService: BalanceService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>
  ) {}

  async createOrder(userId: number, data: CreateOrderDto): Promise<string> {
    try {
      return await getManager().transaction(
        async (transactionEntityManager) => {
          const order = await transactionEntityManager
            .createQueryBuilder()
            .insert()
            .into(Order)
            .values({
              userId,
              type: data.type,
              price: data.price,
              volume: data.volume,
              marketId: data.marketId,
              currencyId: data.currencyId
            })
            .returning('*')
            .execute();

          const orders = await transactionEntityManager.find(Order, {
            where: {
              status: OrderStatusEnum.open,
              type:
                order.generatedMaps[0].type === OrderTypeEnum.buy
                  ? OrderTypeEnum.sell
                  : OrderTypeEnum.buy,
              price: data.price
            }
          });

          let volume = +order.generatedMaps[0].volume;
          let orderBalance: Balance;
          let ordersBalance: Balance;

          if (orders.length) {
            for (let i = 0; i < orders.length; i++) {
              if (volume < orders[i].volume) {
                await transactionEntityManager
                  .createQueryBuilder()
                  .update(Order)
                  .set({ volume: +orders[i].volume - volume })
                  .where({ id: orders[i].id })
                  .execute();

                await transactionEntityManager
                  .createQueryBuilder()
                  .update(Order)
                  .set({ status: OrderStatusEnum.closed })
                  .where({ id: order.generatedMaps[0].id })
                  .execute();

                volume = 0;

                orderBalance = await this.balanceService.findBalanceForOrder(
                  transactionEntityManager,
                  order.generatedMaps[0].userId,
                  data.currencyId
                );

                ordersBalance = await this.balanceService.findBalanceForOrder(
                  transactionEntityManager,
                  orders[i].userId,
                  data.currencyId
                );

                if (
                  data.type === OrderTypeEnum.buy &&
                  orderBalance.amountInCents < +data.volume * +data.price
                )
                  throw new Error('not money');

                await this.balanceService.changeBalanceForOrder(
                  transactionEntityManager,
                  data.type,
                  +orderBalance.amountInCents,
                  +order.generatedMaps[0].volume,
                  +order.generatedMaps[0].price,
                  order.generatedMaps[0].userId,
                  data.currencyId
                );

                await this.balanceService.changeBalanceForOrder(
                  transactionEntityManager,
                  orders[i].type,
                  +ordersBalance.amountInCents,
                  +order.generatedMaps[0].volume,
                  +order.generatedMaps[0].price,
                  orders[i].userId,
                  data.currencyId
                );

                await this.createTrade(
                  transactionEntityManager,
                  data.marketId,
                  +data.price,
                  +order.generatedMaps[0].volume,
                  data.type,
                  order.generatedMaps[0].userId,
                  orders[i].userId
                );
              } else if (volume > orders[i].volume) {
                await transactionEntityManager
                  .createQueryBuilder()
                  .update(Order)
                  .set({
                    volume: +order.generatedMaps[0].volume - +orders[i].volume
                  })
                  .where({ id: order.generatedMaps[0].id })
                  .execute();

                await transactionEntityManager
                  .createQueryBuilder()
                  .update(Order)
                  .set({ status: OrderStatusEnum.closed })
                  .where({ id: orders[i].id })
                  .execute();

                volume = volume - +orders[i].volume;

                orderBalance = await this.balanceService.findBalanceForOrder(
                  transactionEntityManager,
                  order.generatedMaps[0].userId,
                  data.currencyId
                );

                ordersBalance = await this.balanceService.findBalanceForOrder(
                  transactionEntityManager,
                  orders[i].userId,
                  data.currencyId
                );

                if (
                  data.type === OrderTypeEnum.buy &&
                  orderBalance.amountInCents < +orders[i].volume * +data.price
                )
                  throw new Error('not money');

                await this.balanceService.changeBalanceForOrder(
                  transactionEntityManager,
                  data.type,
                  +orderBalance.amountInCents,
                  +orders[i].volume,
                  +orders[i].price,
                  order.generatedMaps[0].userId,
                  data.currencyId
                );

                await this.balanceService.changeBalanceForOrder(
                  transactionEntityManager,
                  orders[i].type,
                  +ordersBalance.amountInCents,
                  +orders[i].volume,
                  +orders[i].price,
                  orders[i].userId,
                  data.currencyId
                );

                await this.createTrade(
                  transactionEntityManager,
                  data.marketId,
                  +data.price,
                  +orders[i].volume,
                  data.type,
                  order.generatedMaps[0].userId,
                  orders[i].userId
                );
              } else if (volume === orders[i].volume) {
                await transactionEntityManager
                  .createQueryBuilder()
                  .update(Order)
                  .set({ status: OrderStatusEnum.closed })
                  .where({ id: order.generatedMaps[0].id })
                  .execute();

                await transactionEntityManager
                  .createQueryBuilder()
                  .update(Order)
                  .set({ status: OrderStatusEnum.closed })
                  .where({ id: orders[i].id })
                  .execute();

                volume = 0;

                orderBalance = await this.balanceService.findBalanceForOrder(
                  transactionEntityManager,
                  order.generatedMaps[0].userId,
                  data.currencyId
                );

                ordersBalance = await this.balanceService.findBalanceForOrder(
                  transactionEntityManager,
                  orders[i].userId,
                  data.currencyId
                );

                if (
                  data.type === OrderTypeEnum.buy &&
                  orderBalance.amountInCents < +data.volume * +data.price
                )
                  throw new Error('not money');

                await this.balanceService.changeBalanceForOrder(
                  transactionEntityManager,
                  data.type,
                  +orderBalance.amountInCents,
                  +orders[i].volume,
                  +orders[i].price,
                  order.generatedMaps[0].userId,
                  data.currencyId
                );

                await this.balanceService.changeBalanceForOrder(
                  transactionEntityManager,
                  orders[i].type,
                  +ordersBalance.amountInCents,
                  +orders[i].volume,
                  +orders[i].price,
                  orders[i].userId,
                  data.currencyId
                );

                await this.createTrade(
                  transactionEntityManager,
                  data.marketId,
                  +data.price,
                  +data.volume,
                  data.type,
                  order.generatedMaps[0].userId,
                  orders[i].userId
                );
              } else {
                break;
              }
            }
          }

          return 'order was sussesfully created';
        }
      );
    } catch {
      throw new BadRequestException('Create order was failed');
    }
  }

  async createTrade(
    transactionEntityManager: EntityManager,
    marketId: string,
    price: number,
    volume: number,
    type: string,
    orderUserId: number,
    ordersUserId: number
  ): Promise<void> {
    await transactionEntityManager
      .createQueryBuilder()
      .insert()
      .into(Trade)
      .values({
        marketId,
        price,
        volume,
        makerUserId: type === OrderTypeEnum.sell ? orderUserId : ordersUserId,
        takerUserId: type === OrderTypeEnum.buy ? orderUserId : ordersUserId
      })
      .execute();
  }

  async getOrders(userId: number): Promise<GetOrdersResponseDto> {
    const [orders, count] = await this.orderRepository.findAndCount({
      where: { status: OrderStatusEnum.open, userId },
      select: [
        'id',
        'type',
        'price',
        'volume',
        'status',
        'userId',
        'marketId',
        'currencyId',
        'createdAt',
        'updatedAt'
      ],
      skip: 0,
      take: 15,
      order: { createdAt: 'DESC' }
    });

    return plainToClass(
      GetOrdersResponseDto,
      { count, orders },
      { strategy: 'excludeAll' }
    );
  }

  async getTrades(userId: number): Promise<GetTradesResponseDto> {
    const [trades, count] = await this.tradeRepository.findAndCount({
      where: [{ makerUserId: userId }, { takerUserId: userId }],
      select: [
        'id',
        'price',
        'volume',
        'makerUserId',
        'takerUserId',
        'marketId',
        'createdAt'
      ],
      skip: 0,
      take: 15,
      order: { createdAt: 'DESC' }
    });

    return plainToClass(
      GetTradesResponseDto,
      { count, trades },
      { strategy: 'excludeAll' }
    );
  }

  async cancelOrder(orderId: number, userId: number): Promise<string> {
    try {
      const order = await this.orderRepository
        .createQueryBuilder()
        .update(Order)
        .set({ status: OrderStatusEnum.cancelled })
        .where({ userId, id: orderId, status: OrderStatusEnum.open })
        .execute();

      if (!order.affected) throw new Error();

      return `Order ${orderId} was sussesfully cancelled`;
    } catch {
      throw new BadRequestException('Cancel order was failed');
    }
  }
}
