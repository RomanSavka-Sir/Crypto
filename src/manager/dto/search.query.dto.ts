import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SearchQueryDto {
  @ApiProperty({
    example: 'Ivan',
    description: 'Search user by first name or last name or email',
    required: false
  })
  @Transform((o) => o.value.toLowerCase().trim())
  @IsOptional()
  @IsString()
  search?: string;
}
