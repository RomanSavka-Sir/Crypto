import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class PhotoDto {
  @Expose()
  @ApiProperty({
    description: 'identifier of photo',
    example: '234534533332-ddd.jpg'
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @ApiProperty({
    description: 'status of photo',
    example: 'pending'
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @Expose()
  @ApiProperty({
    description: 'date when photo was created',
    example: '2022-05-24 16:35:39.701Z'
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'identifier of user', example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
