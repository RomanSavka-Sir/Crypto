import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'user email', example: 'user@user.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform((o) => o.value.toLowerCase())
  email: string;

  @ApiProperty({ description: 'user password', example: 'Admin1user' })
  @IsString()
  @MinLength(10, {
    message: 'Password is too short'
  })
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is  too weak'
  })
  @IsNotEmpty()
  password: string;
}
