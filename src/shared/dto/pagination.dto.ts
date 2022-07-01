import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'limit of items per page',
    example: 10,
    required: false
  })
  @IsInt()
  @IsOptional()
  limit: number;

  @ApiProperty({ description: 'number of page', example: 0, required: false })
  @IsInt()
  @IsOptional()
  offset: number;
}
