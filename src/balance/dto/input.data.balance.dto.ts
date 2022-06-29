import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class InputDataBalanceDto {
  @ApiProperty({ description: 'amount in cents', example: '100' })
  @IsInt()
  @Transform((a) => parseInt(a.value) * 100)
  @IsNotEmpty()
  amountInCents: number;

  @ApiProperty({ description: 'name of currency', example: 'UAH' })
  @IsString()
  @IsNotEmpty()
  currencyId: string;
}
