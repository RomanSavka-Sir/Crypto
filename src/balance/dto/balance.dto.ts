import { BaseDTO } from 'src/shared/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class BalanceDto extends BaseDTO {
  @Expose()
  @ApiProperty({ description: 'identifier of balance', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Expose()
  @ApiProperty({ description: 'amount of user balance', example: 100 })
  @IsInt()
  @IsNotEmpty()
  amountInCents: number;

  @Expose()
  @ApiProperty({ description: 'identifier of user', example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @Expose()
  @ApiProperty({
    description: 'name of currency',
    example: 'UAH'
  })
  @IsString()
  @IsNotEmpty()
  currencyId: string;

  @Expose()
  @ApiProperty({
    description: 'date when balance was created',
    example: '2022-05-24 16:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'date when balance was created',
    example: '2022-05-24 16:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
