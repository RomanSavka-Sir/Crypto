import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({
    description: 'code for confirm email of user',
    example: '125643'
  })
  @IsNotEmpty()
  @IsString()
  @Length(6)
  code: string;
}
