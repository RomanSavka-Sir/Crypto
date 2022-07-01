import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import moment from 'moment';

export class OrderFilterDto {
  @ApiProperty({
    description: 'status of order',
    example: 'open',
    required: false
  })
  @IsString()
  @IsOptional()
  statusFilter?: string;

  @ApiProperty({
    example: '2022-06-30 13:27:00',
    description: 'Range "From" for createdAt',
    required: false
  })
  @IsString()
  @Transform((o) =>
    o.value ? moment(new Date(o.value)).format('YYYY-MM-DDTHH:mm:ss') : null
  )
  @IsOptional()
  createdAtFrom?: string;

  @ApiProperty({
    example: '2022-06-30 17:27:00',
    description: 'Range "From" for createdAt',
    required: false
  })
  @IsString()
  @Transform((o) =>
    o.value ? moment(new Date(o.value)).format('YYYY-MM-DDTHH:mm:ss') : null
  )
  @IsOptional()
  createdAtTo?: string;

  @ApiProperty({
    description: 'market id filter ',
    example: 'btc-uah',
    required: false
  })
  @IsString()
  @IsOptional()
  marketIdFilter?: string;

  @ApiProperty({
    description: 'currency id filter',
    example: 'UAH',
    required: false
  })
  @IsString()
  @IsOptional()
  currencyIdFilter?: string;

  @ApiProperty({
    description: 'Range "From" for price',
    example: 100,
    required: false
  })
  @IsInt()
  @Transform((a) => parseInt(a.value) * 100)
  @IsOptional()
  priceFrom?: number;

  @ApiProperty({
    description: 'Range "To" for price',
    example: 200,
    required: false
  })
  @IsInt()
  @Transform((a) => parseInt(a.value) * 100)
  @IsOptional()
  priceTo?: number;

  @ApiProperty({
    description: 'Range "From" for volume',
    example: 1,
    required: false
  })
  @IsInt()
  @IsOptional()
  volumeFrom?: number;

  @ApiProperty({
    description: 'Range "To for volume',
    example: 3,
    required: false
  })
  @IsInt()
  @IsOptional()
  volumeTo?: number;
}
