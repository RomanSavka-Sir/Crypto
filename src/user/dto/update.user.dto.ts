import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'first name of user',
    example: 'Ivan'
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'last name of user',
    example: 'Kilenko'
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'country of residence', example: 'UA' })
  @IsString()
  @IsOptional()
  countryOfResidence?: string;

  @ApiProperty({ description: 'country of birth', example: 'UA' })
  @IsString()
  @IsOptional()
  countryOfBirth?: string;

  @ApiProperty({ description: 'Phone number', example: '380989999999' })
  @IsString()
  @MinLength(11)
  @MaxLength(12)
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'date of birth of user', example: '1995-05-12' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;
}
