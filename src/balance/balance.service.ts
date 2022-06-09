import { User } from './../user/entities/user.entity';
import { InputDataBalanceDto } from './dto/input.data.balance.dto';
import { RoleEnum } from 'src/shared/enums/role.enum';
import { plainToClass } from 'class-transformer';
import { Balance } from './entities/balance.entity';
import { BalanceDto } from './dto/balance.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

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
}
