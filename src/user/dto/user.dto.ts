import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { BalanceDto } from 'src/balance/dto/balance.dto';
import { ManagerDto } from 'src/manager/dto/manager.dto';
import { PhotoDto } from 'src/shared/dto/photo.dto';
import { UserRolesDto } from './user.roles.dto';

export class UserDto extends ManagerDto {
  @Expose()
  @ApiProperty({
    example: [
      {
        id: 1,
        userId: 1,
        roleId: 'user',
        createdAt: '2022-05-24 16:35:39.701Z'
      }
    ],
    description: 'userRoles',
    type: 'array',
    items: {
      $ref: '#/components/schemas/UserRolesDto'
    }
  })
  @ValidateNested({ each: true })
  @Type(() => UserRolesDto)
  userRoles: UserRolesDto[];

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

  @Expose()
  @ApiProperty({
    example: [
      {
        id: '234534533332-ddd.jpg',
        status: 'pending',
        createdAt: '2022-05-24 16:35:39.701Z',
        userId: 1
      }
    ],
    description: 'photos',
    type: 'array',
    items: {
      $ref: '#/components/schemas/PhotoDto'
    }
  })
  @ValidateNested({ each: true })
  @Type(() => PhotoDto)
  photos: PhotoDto[];
}
