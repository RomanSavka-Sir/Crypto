import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UserRolesDto {
  @Expose()
  @ApiProperty({ description: 'identifier or user role', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Expose()
  @ApiProperty({ description: 'identifier of user', example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @Expose()
  @ApiProperty({ description: 'identifier of role', example: 'user' })
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @Expose()
  @ApiProperty({
    description: 'date when user role was created',
    example: '2022-05-24 16:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
