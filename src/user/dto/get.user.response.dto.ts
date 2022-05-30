import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { BalanceDto } from 'src/balance/dto/balance.dto';
import { ManagerDto } from 'src/manager/dto/manager.dto';

export class GetUserResponseDto extends ManagerDto {
  @Expose()
  @ApiProperty({
    example: [
      {
        id: 1,
        amountInCents: 1,
        userId: 1,
        currencyId: 'UAH',
        createdAt: '2022-05-24 16:35:39.701Z',
        updatedAt: '2022-05-24 16:35:39.701Z'
      }
    ],
    description: 'balances',
    type: 'array',
    items: {
      $ref: '#/components/schemas/BalanceDto'
    }
  })
  @ValidateNested({ each: true })
  @Type(() => BalanceDto)
  balances: BalanceDto[];
}
