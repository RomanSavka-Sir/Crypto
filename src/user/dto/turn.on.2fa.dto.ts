import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class TurnOn2faDto {
  @ApiProperty({ description: 'phone for 2fa', example: '+380999999999' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
