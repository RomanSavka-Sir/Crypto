import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class InputData2faDto {
  @ApiProperty({ description: 'code for 2fa', example: '34rtfd' })
  @IsString()
  @Length(6)
  @IsNotEmpty()
  code: string;
}
