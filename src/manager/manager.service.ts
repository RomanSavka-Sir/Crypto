import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Market } from 'src/order/entities/market.entity';
import { MarketsEnum } from 'src/order/enums/markets.enum';
import { GetPhotoResponseDto } from 'src/shared/dto/get.photo.response.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { Photo } from 'src/shared/entities/photo.entity';
import { UserIdDto } from 'src/user/dto/user.id.dto';
import { Repository } from 'typeorm';
import { GetMarketResponseDto } from './dto/get.market.response.dto';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>
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

  async getAllUserPhotots(
    pagination: PaginationDto,
    userId: number
  ): Promise<GetPhotoResponseDto> {
    const [photos, count] = await this.photoRepository.findAndCount({
      select: ['id', 'status', 'createdAt', 'deletedAt', 'userId'],
      skip: pagination.offset,
      take: pagination.limit,
      where: { userId },
      order: {
        id: 'DESC'
      }
    });

    return plainToClass(GetPhotoResponseDto, { count, photos });
  }

  //   async confirmUser(data: UserIdDto): Promise<string> {
  //     return;
  //   }

  async getUserPhoto(photoId, res) {
    const photo = await this.photoRepository.findOne({
      where: {
        id: photoId
      }
    });

    const response = await res.sendFile(photoId, { root: './uploads' });

    return response;
  }
}
