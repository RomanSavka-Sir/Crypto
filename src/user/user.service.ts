import { SmsSender } from 'src/shared/helpers/twilio.sms.sender';
import { Currency } from './../shared/entities/currency.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { RoleEnum } from 'src/shared/enums/role.enum';
import { Repository, getManager } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user.role.entity';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { GetMarketResponseDto } from 'src/manager/dto/get.market.response.dto';
import { Market } from 'src/order/entities/market.entity';
import { plainToClass } from 'class-transformer';
import { MarketsEnum } from 'src/order/enums/markets.enum';
import { GetUserResponseDto } from './dto/get.user.response.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { Balance } from 'src/balance/entities/balance.entity';
import { TurnOn2faDto } from './dto/turn.on.2fa.dto';
import RandExp from 'randexp';
import { encrypt } from 'src/shared/helpers/crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    private smsSender: SmsSender
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email
      }
    });
  }

  async createUser(data: RegisterDto, adminId?: number) {
    return await getManager().transaction(async (transactionEntityManager) => {
      data.password = await bcrypt.hash(data.password, 10);

      const user = await transactionEntityManager
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ ...data })
        .execute();

      await transactionEntityManager
        .createQueryBuilder()
        .insert()
        .into(UserRole)
        .values({
          userId: user.generatedMaps[0].id,
          roleId: adminId ? RoleEnum.manager : RoleEnum.user
        })
        .execute();

      if (!adminId) {
        const currency = await transactionEntityManager.find(Currency);

        for (const data of currency) {
          await transactionEntityManager
            .createQueryBuilder()
            .insert()
            .into(Balance)
            .values({ userId: user.generatedMaps[0].id, currency: data })
            .execute();
        }
      }

      return user;
    });
  }

  async getAllMarkets(
    pagination: PaginationDto
  ): Promise<GetMarketResponseDto> {
    const [markets, count] = await this.marketRepository.findAndCount({
      select: ['id', 'status', 'createdAt', 'updatedAt'],
      skip: pagination.offset,
      take: pagination.limit,
      where: { status: MarketsEnum.available },
      order: {
        id: 'DESC'
      }
    });

    return plainToClass(GetMarketResponseDto, { count, markets });
  }

  async getuser(userId: number): Promise<GetUserResponseDto> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        id: userId
      },
      relations: ['balances']
    });

    return plainToClass(GetUserResponseDto, user, { strategy: 'excludeAll' });
  }

  async updateUser(
    userId: number,
    data: UpdateUserDto,
    adminId?: number
  ): Promise<GetUserResponseDto> {
    try {
      let role;

      if (adminId) {
        role = await this.userRolesRepository.findOneOrFail({
          where: {
            roleId: 'manager',
            userId
          }
        });
      }
      const user = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ ...data })
        .where({ id: adminId ? role.userId : userId })
        .returning(['id'])
        .execute();

      if (!user.affected) throw new Error();

      return await this.getuser(user.raw[0].id);
    } catch {
      throw new BadRequestException('Update user(manager) was failed');
    }
  }
}
