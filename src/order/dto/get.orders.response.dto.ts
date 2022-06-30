import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, ValidateNested } from 'class-validator';
import { BaseDTO } from './../../shared/dto/base.dto';
import { OrderDto } from './order.dto';
export class GetOrdersResponseDto extends BaseDTO {
  @Expose()
  @ApiProperty({ description: 'count of orders', example: 10 })
  @IsInt()
  @IsNotEmpty()
  count: number;

  @Expose()
  @ApiProperty({
    example: [
      {
        id: 1,
        type: 'sell',
        price: 100,
        volume: 1,
        status: 'open',
        userId: 1,
        marketId: 'btc-uah',
        currencyId: 'UAH',
        createdAt: '2022-06-30 16:35:39.701Z',
        updatedAt: '2022-06-30 17:35:39.701Z'
      }
    ],
    description: 'orders',
    type: 'array',
    items: {
      $ref: '#/components/schemas/OrderDto'
    }
  })
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  @IsNotEmpty()
  orders: OrderDto[];
}
