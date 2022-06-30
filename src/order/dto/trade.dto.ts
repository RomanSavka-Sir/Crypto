import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class TradeDto {
  @Expose()
  @ApiProperty({ description: 'identifier of trade', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Expose()
  @ApiProperty({
    description: 'amount of money for crypto currency',
    example: 100
  })
  @IsInt()
  @IsNotEmpty()
  price: number;

  @Expose()
  @ApiProperty({ description: 'amount of crypto currency', example: 1 })
  @IsInt()
  @IsNotEmpty()
  volume: number;

  @Expose()
  @ApiProperty({ description: 'identifier of maker', example: 1 })
  @IsInt()
  @IsNotEmpty()
  makerUserId: number;

  @Expose()
  @ApiProperty({ description: 'identifier of taker', example: 2 })
  @IsInt()
  @IsNotEmpty()
  takerUserId: number;

  @Expose()
  @ApiProperty({ description: 'identifier of market', example: 'btc-uah' })
  @IsString()
  @IsNotEmpty()
  marketId: string;

  @Expose()
  @ApiProperty({
    description: 'data when trade was created',
    example: '2022-06-30 18:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
