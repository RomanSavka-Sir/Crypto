import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { BaseDTO } from 'src/shared/dto/base.dto';
import { MarketDto } from './market.dto';

export class GetMarketResponseDto extends BaseDTO {
  @Expose()
  @ApiProperty({ description: 'count of markets', example: 10 })
  @IsInt()
  @IsNotEmpty()
  count: number;

  @Expose()
  @ApiProperty({
    example: [
      {
        id: 1,
        status: 'available',
        createdAt: '2022-05-24 16:35:39.701Z',
        updatedAt: '2022-05-24 18:35:39.701Z'
      }
    ],
    description: 'markets',
    type: 'array',
    items: {
      $ref: '#/components/schemas/MarketDto'
    }
  })
  @ValidateNested({ each: true })
  @Type(() => MarketDto)
  @IsNotEmpty()
  markets: MarketDto[];
}
