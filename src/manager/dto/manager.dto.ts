import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { BaseDTO } from 'src/shared/dto/base.dto';

export class ManagerDto extends BaseDTO {
  @Expose()
  @ApiProperty({
    description: 'identifier of user',
    example: 1
  })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Expose()
  @ApiProperty({
    description: 'email of user',
    example: 'user@user.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @ApiProperty({
    description: 'status of user',
    example: 'tier1'
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @Expose()
  @ApiProperty({
    description: 'first name of user',
    example: 'Ivan'
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @Expose()
  @ApiProperty({
    description: 'last name of user',
    example: 'Kilenko'
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @Expose()
  @ApiProperty({ description: 'country of residence', example: 'UA' })
  @IsString()
  @IsOptional()
  countryOfResidence: string;

  @Expose()
  @ApiProperty({ description: 'country of birth', example: 'UA' })
  @IsString()
  @IsOptional()
  countryOfBirth: string;

  @Expose()
  @ApiProperty({ description: 'Phone number', example: '380989999999' })
  @IsString()
  @MinLength(11)
  @MaxLength(12)
  @IsOptional()
  phone: string;

  @Expose()
  @ApiProperty({ description: 'date of birth of user', example: '1995-05-12' })
  @IsDateString()
  @IsOptional()
  dateOfBirth: string;

  @Expose()
  @ApiProperty({ description: '2fa status of user', example: false })
  @IsBoolean()
  @IsNotEmpty()
  ['2fa']: boolean;

  @Expose()
  @ApiProperty({
    description: 'date when user was created',
    example: '2022-05-24 16:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'date when user was created',
    example: '2022-05-24 16:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
