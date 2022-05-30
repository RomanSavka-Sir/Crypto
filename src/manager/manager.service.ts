import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Market } from 'src/order/entities/market.entity';
import { MarketsEnum } from 'src/order/enums/markets.enum';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { Photo } from 'src/shared/entities/photo.entity';
import { PhotoStatusEnum } from 'src/shared/enums/photo.status.enum';
import { GetUsersResponseDto } from 'src/user/dto/get.users.response.dto';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/entities/user.role.entity';
import { UserStatusEnum } from 'src/user/enums/user.status.enum';
import { getManager, ILike, In, Repository } from 'typeorm';
import { GetMarketResponseDto } from './dto/get.market.response.dto';
import { SearchQueryDto } from './dto/search.query.dto';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>
  ) {}

  async getAllMArkets(
    pagination: PaginationDto
  ): Promise<GetMarketResponseDto> {
    const [markets, count] = await this.marketRepository.findAndCount({
      select: ['id', 'status', 'createdAt', 'updatedAt'],
      skip: pagination.offset,
      take: pagination.limit,
      order: {
        id: 'DESC'
      }
    });

    return plainToClass(GetMarketResponseDto, { count, markets });
  }

  async activateMarket(marketId: string): Promise<string> {
    try {
      const market = await this.marketRepository
        .createQueryBuilder()
        .update(Market)
        .set({ status: MarketsEnum.available })
        .where({ id: marketId, status: MarketsEnum.unavailable })
        .execute();

      if (!market.affected) throw new Error();

      return 'Market successfully activated';
    } catch {
      throw new BadRequestException('Market activation failed');
    }
  }

  async deactivateMarket(marketId: string): Promise<string> {
    try {
      const market = await this.marketRepository
        .createQueryBuilder()
        .update(Market)
        .set({ status: MarketsEnum.unavailable })
        .where({ id: marketId, status: MarketsEnum.available })
        .execute();

      if (!market.affected) throw new Error();

      return 'Market successfully deactivated';
    } catch {
      throw new BadRequestException('Market deactivation failed');
    }
  }

  async getUserPhoto(photoId: string, res) {
    const photo = await this.photoRepository.findOne({
      where: {
        id: photoId
      }
    });

    const response = await res.sendFile(photoId, { root: './uploads' });

    return response;
  }

  async confirmPhoto(photoId: string): Promise<string> {
    try {
      return await getManager().transaction(
        async (transactionEntityManager) => {
          const { userId } = await transactionEntityManager.findOne(Photo, {
            where: {
              id: photoId
            }
          });

          const photo = await transactionEntityManager
            .createQueryBuilder()
            .update(Photo)
            .set({ status: PhotoStatusEnum.approved })
            .where({
              userId,
              id: photoId,
              status: PhotoStatusEnum.pending
            })
            .execute();

          if (!photo.affected) throw new Error();

          const user = await transactionEntityManager
            .createQueryBuilder()
            .update(User)
            .set({ status: UserStatusEnum.tier3 })
            .where({ id: userId, status: UserStatusEnum.tier2 })
            .execute();

          if (!user.affected) throw new Error();

          return 'user photo was successfully confirmed';
        }
      );
    } catch {
      throw new BadRequestException('Confirm user photo was failed');
    }
  }

  async rejectPhoto(photoId: string): Promise<string> {
    const { userId } = await this.photoRepository.findOne({
      where: {
        id: photoId
      }
    });

    const photo = await this.photoRepository
      .createQueryBuilder()
      .update(Photo)
      .set({ status: PhotoStatusEnum.rejected })
      .where({
        userId: userId,
        id: photoId,
        status: PhotoStatusEnum.pending
      })
      .execute();

    if (!photo.affected)
      throw new BadRequestException('Confirm user photo was failed');

    return 'user photo was successfully rejected';
  }

  async getAllUsers(
    pagination: PaginationDto,
    search: SearchQueryDto
  ): Promise<GetUsersResponseDto> {
    const role = await this.userRolesRepository.find({
      where: {
        roleId: 'user'
      }
    });

    const userIds = role.map((id) => id.userId);

    let where: object | [];

    if (search.search) {
      where = [
        { id: In(userIds), firstName: ILike(`%${search.search}%`) },
        { id: In(userIds), lastName: ILike(`%${search.search}%`) },
        { id: In(userIds), email: ILike(`%${search.search}%`) }
      ];
    } else {
      where = { id: In(userIds) };
    }

    const [users, count] = await this.userRepository.findAndCount({
      where,
      select: [
        'id',
        '2fa',
        'countryOfBirth',
        'countryOfResidence',
        'createdAt',
        'dateOfBirth',
        'email',
        'firstName',
        'lastName',
        'phone',
        'status',
        'updatedAt',
        'userRoles'
      ],
      skip: pagination.offset,
      take: pagination.limit,
      order: { id: 'DESC' },
      relations: ['balances', 'userRoles', 'photos']
    });

    return plainToClass(
      GetUsersResponseDto,
      { count, users },
      { strategy: 'excludeAll' }
    );
  }
}
