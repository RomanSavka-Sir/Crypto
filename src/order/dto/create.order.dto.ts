import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'type of order', example: 'sell' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'price of crypto currency', example: 100 })
  @IsInt()
  @Transform((a) => parseInt(a.value) * 100)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'amount of crypto currency', example: 1 })
  @IsInt()
  @IsNotEmpty()
  volume: number;

  @ApiProperty({ description: 'type of crypto currency', example: 'btc-usd' })
  @IsString()
  @IsNotEmpty()
  marketId: string;

  @ApiProperty({ description: 'type of currency', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currencyId: string;
}
