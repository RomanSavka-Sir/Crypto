import { BaseDTO } from "src/shared/dto/base.dto";
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class TokenDto extends BaseDTO {
    @Expose()
    @ApiProperty({
        description: 'user token', example: 'eyJhbGwddsciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjIzMTQyOTE...'
    })
    @IsNotEmpty()
    @IsString()
    token: string;

}