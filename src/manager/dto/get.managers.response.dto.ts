import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { BaseDTO } from 'src/shared/dto/base.dto';
import { ManagerDto } from './manager.dto';

export class GetManagersResponseDto extends BaseDTO {
  @Expose()
  @ApiProperty({ description: 'count of managers', example: 10 })
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
        updatedAt: '2022-05-24 16:35:39.701Z'
      }
    ],
    description: 'managers',
    type: 'array',
    items: {
      $ref: '#/components/schemas/ManagerDto'
    }
  })
  @ValidateNested({ each: true })
  @Type(() => ManagerDto)
  @IsNotEmpty()
  managers: ManagerDto[];
}
