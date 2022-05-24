import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'user email', example: 'user@user.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform((o) => o.value.toLowerCase())
  email: string;

  @ApiProperty({ description: 'user password', example: '1111admin' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
