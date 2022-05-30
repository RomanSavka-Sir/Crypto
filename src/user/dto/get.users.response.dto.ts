import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { BaseDTO } from 'src/shared/dto/base.dto';
import { UserDto } from './user.dto';

export class GetUsersResponseDto extends BaseDTO {
  @Expose()
  @ApiProperty({ description: 'count of users', example: 10 })
  @IsInt()
  @IsNotEmpty()
  count: number;

  @Expose()
  @ApiProperty({
    example: [
      {
        id: 1,
        email: 'user@user.com',
        status: 'tier1',
        firstName: 'Ivan',
        lastName: 'Kilenko',
        countryOfResidence: 'UA',
        countryOfBirth: 'UA',
        phone: '380989999999',
        dateOfBirth: '1995-05-12',
        ['2fa']: false,
        createdAt: '2022-05-24 16:35:39.701Z',
        updatedAt: '2022-05-24 16:35:39.701Z',
        userRoles: [
          {
            id: 1,
            userId: 1,
            roleId: 'user',
            createdAt: '2022-05-24 16:35:39.701Z'
          }
        ],
        balances: [
          {
            id: 1,
            amountInCents: 1,
            userId: 1,
            currencyId: 'UAH',
            createdAt: '2022-05-24 16:35:39.701Z',
            updatedAt: '2022-05-24 16:35:39.701Z'
          }
        ],
        photos: [
          {
            id: '234534533332-ddd.jpg',
            status: 'pending',
            createdAt: '2022-05-24 16:35:39.701Z',
            userId: 1
          }
        ]
      }
    ],
    description: 'users',
    type: 'array',
    items: {
      $ref: '#/components/schemas/UserDto'
    }
  })
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  @IsNotEmpty()
  users: UserDto[];
}
