import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class MarketDto {
  @ApiProperty({
    description: 'identifier of market',
    example: 'BTC-UAH'
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'status of market',
    example: 'available'
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'date when market was created',
    example: '2022-05-24 16:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    description: 'date when market was updated',
    example: '2022-05-24 18:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
