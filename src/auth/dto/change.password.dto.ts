import { RegisterDto } from './register.dto';
import { OmitType } from '@nestjs/swagger';
export class ChangePasswordDto extends OmitType(RegisterDto, ['email']) {}
