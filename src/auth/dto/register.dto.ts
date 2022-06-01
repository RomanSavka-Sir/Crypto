import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches
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
  @Length(10)
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{10}$/, {
    message: 'Password too weak'
  })
  @IsNotEmpty()
  password: string;
}
