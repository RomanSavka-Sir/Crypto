import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class OrderDto {
  @Expose()
  @ApiProperty({ description: 'identifier of order', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Expose()
  @ApiProperty({ description: 'type of order', example: 'sell' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @Expose()
  @ApiProperty({ description: 'price of crypto currency', example: 100 })
  @IsInt()
  @IsNotEmpty()
  price: number;

  @Expose()
  @ApiProperty({ description: 'amount of crypto currency', example: 1 })
  @IsInt()
  @IsNotEmpty()
  volume: number;

  @Expose()
  @ApiProperty({ description: 'status of order', example: 'open' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @Expose()
  @ApiProperty({ description: 'identifier of user', example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @Expose()
  @ApiProperty({ description: 'identifier of market', example: 'btc-uah' })
  @IsString()
  @IsNotEmpty()
  marketId: string;

  @Expose()
  @ApiProperty({ description: 'identifier of currency', example: 'UAH' })
  @IsString()
  @IsNotEmpty()
  currencyId: string;

  @Expose()
  @ApiProperty({
    description: 'data when order was created',
    example: '2022-06-30 16:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'data when order was updated',
    example: '2022-06-30 17:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
