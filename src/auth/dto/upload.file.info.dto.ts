import { ApiProperty } from "@nestjs/swagger";

export class UploadFileInfoDto {
    @ApiProperty({
        type: 'file',
        properties: {
            file: {
                type: 'string',
                format: 'binary',
            },
        },
    })
    file: any;
}