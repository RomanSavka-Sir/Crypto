import { ApiProperty } from '@nestjs/swagger';

export class UploadFileInfoDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
