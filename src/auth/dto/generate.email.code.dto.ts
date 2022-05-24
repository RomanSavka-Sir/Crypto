import { OmitType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

export class GenerateEmailCodeDto extends OmitType(RegisterDto, ['password']) {}
