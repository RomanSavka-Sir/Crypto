import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { BaseDTO } from 'src/shared/dto/base.dto';
import { PhotoDto } from './photo.dto';

export class GetPhotoResponseDto extends BaseDTO {
  @Expose()
  @ApiProperty({ description: 'count of markets', example: 10 })
  @IsInt()
  @IsNotEmpty()
  count: number;

  @Expose()
  @ApiProperty({
    example: [
      {
        id: '234534533332-ddd.jpg',
        status: 'pending',
        createdAt: '2022-05-24 16:35:39.701Z',
        userId: 1
      }
    ],
    description: 'photots',
    type: 'array',
    items: {
      $ref: '#/components/schemas/PhotoDto'
    }
  })
  @ValidateNested({ each: true })
  @Type(() => PhotoDto)
  @IsNotEmpty()
  photos: PhotoDto[];
}
