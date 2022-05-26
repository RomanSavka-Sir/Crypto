import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UserIdDto {
  @ApiProperty({ description: 'identifier of user', example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
