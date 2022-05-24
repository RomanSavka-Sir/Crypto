import { OmitType } from '@nestjs/swagger';
import { RegisterDto } from 'src/auth/dto/register.dto';

export class CreateManagerDto extends OmitType(RegisterDto, ['password']) {}
