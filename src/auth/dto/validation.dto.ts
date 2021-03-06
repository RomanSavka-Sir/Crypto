import {
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidationDto {
  @ApiProperty({ example: 'Anton', description: 'first name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Ivanow', description: 'last name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'UA', description: 'country of residence' })
  @IsNotEmpty()
  countryOfResidence: string;

  @ApiProperty({ example: 'UA', description: 'country of birth' })
  @IsNotEmpty()
  countryOfBirth: string;

  @ApiProperty({ example: '+380989999999', description: 'Phone number' })
  @IsNotEmpty()
  @IsString()
  @MinLength(13)
  @MaxLength(13)
  @Matches(/^([+])([0-9]{12})$/, { message: 'Incorrect phone number' })
  phone: string;

  @ApiProperty({ example: '1995-05-12', description: 'date of birth of user' })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;
}
