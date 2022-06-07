import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';
export class TurnOn2faDto {
  @ApiProperty({ description: 'phone for 2fa', example: '+380999999999' })
  @IsString()
  @MinLength(13)
  @MaxLength(13)
  @Matches(/^([+])([0-9]{12})$/, { message: 'Incorrect phone number' })
  @IsNotEmpty()
  phone: string;
}
