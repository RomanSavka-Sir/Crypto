import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class PhotoDto {
  @ApiProperty({
    description: 'identifier pf photo',
    example: '234534533332-ddd.jpg'
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'status of photo',
    example: 'pending'
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'date when photo was created',
    example: '2022-05-24 16:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    description: 'date when photo was deleted',
    example: '2022-05-24 18:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  deletedAt: Date;

  @ApiProperty({ description: 'identifier of user', example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
