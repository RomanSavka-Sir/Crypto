import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional
} from 'class-validator';

export class InputData2faDto {
  @ApiProperty({ description: 'code for 2fa', example: '34rtfd' })
  @IsString()
  @Length(6)
  @IsNotEmpty()
  code2fa: string;

  @ApiProperty({ description: 'identifier of user', example: 1 })
  @IsInt()
  @IsOptional()
  id?: number;
}
