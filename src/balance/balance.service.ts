import { log } from 'console';
import { User } from './../user/entities/user.entity';
import { InputDataBalanceDto } from './dto/input.data.balance.dto';
import { plainToClass } from 'class-transformer';
import { Balance } from './entities/balance.entity';
import { BalanceDto } from './dto/balance.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, MoreThanOrEqual, Repository } from 'typeorm';
import { OrderTypeEnum } from 'src/order/enums/order.type.enum';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async topUpBalance(
    userId: number,
    data: InputDataBalanceDto
  ): Promise<BalanceDto> {
    try {
      const findBalance = await this.balanceRepository.findOneOrFail({
        where: {
          userId,
          currencyId: data.currencyId
        }
      });

      const balance = await this.balanceRepository
        .createQueryBuilder()
        .update(Balance)
        .set({ amountInCents: findBalance.amountInCents + data.amountInCents })
        .where({ userId, currencyId: data.currencyId })
        .returning(['*'])
        .execute();

      if (!balance.affected) throw new Error();

      return plainToClass(BalanceDto, balance.raw[0], {
        strategy: 'excludeAll'
      });
    } catch {
      throw new BadRequestException('Top up balance was failed');
    }
  }

  async withdrawBalance(
    userId: number,
    data: InputDataBalanceDto
  ): Promise<BalanceDto> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          id: userId,
          ['2fa']: true
        }
      });

      const findBalance = await this.balanceRepository.findOneOrFail({
        where: {
          userId,
          currencyId: data.currencyId
        }
      });

      const balance = await this.balanceRepository
        .createQueryBuilder()
        .update(Balance)
        .set({ amountInCents: findBalance.amountInCents - data.amountInCents })
        .where({
          userId: user.id,
          currencyId: data.currencyId,
          amountInCents: MoreThanOrEqual(data.amountInCents)
        })
        .returning(['*'])
        .execute();

      if (!balance.affected) throw new Error();

      return plainToClass(BalanceDto, balance.raw[0], {
        strategy: 'excludeAll'
      });
    } catch {
      throw new BadRequestException('Wathdraw balance was failed');
    }
  }

  async changeBalanceForOrder(
    transactionEntityManager: EntityManager,
    type: string,
    orderAmountInCents: number,
    orderVolume: number,
    orderPrice: number,
    userId: number,
    currencyId: string
  ): Promise<void> {
    console.log(
      orderAmountInCents,
      orderVolume,
      orderPrice,
      type,
      userId,
      currencyId
    );

    await transactionEntityManager
      .createQueryBuilder()
      .update(Balance)
      .set({
        amountInCents:
          type === OrderTypeEnum.buy
            ? orderAmountInCents - orderVolume * orderPrice
            : orderAmountInCents + orderVolume * orderPrice
      })
      .where({
        userId,
        currencyId
      })
      .execute();
  }

  async findBalanceForOrder(
    transactionEntityManager: EntityManager,
    userId: number,
    currencyId: string
  ): Promise<Balance> {
    return transactionEntityManager.findOne(Balance, {
      where: {
        userId,
        currencyId
      }
    });
  }
}
