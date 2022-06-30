import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { BaseDTO } from 'src/shared/dto/base.dto';
import { TradeDto } from './trade.dto';
export class GetTradesResponseDto extends BaseDTO {
  @Expose()
  @ApiProperty({ description: 'count of trades', example: 10 })
  @IsInt()
  @IsNotEmpty()
  count: number;

  @Expose()
  @ApiProperty({
    example: [
      {
        id: 1,
        price: 100,
        volume: 1,
        makerUserId: 1,
        takerUserId: 2,
        marketId: 'btc-uah',
        createdAt: '2022-06-30 18:35:39.701Z'
      }
    ],
    description: 'trades',
    type: 'array',
    items: {
      $ref: '#/components/schemas/TradeDto'
    }
  })
  @ValidateNested({ each: true })
  @Type(() => TradeDto)
  @IsNotEmpty()
  trades: TradeDto[];
}
