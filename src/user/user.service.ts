import { Injectable } from '@nestjs/common';
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Market)
    private marketRepository: Repository<Market>
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

      return user;
    });
  }

  async getAllUsers(pagination: PaginationDto): Promise<GetMarketResponseDto> {
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
}
