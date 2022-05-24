import {
  Controller,
  Post,
  HttpCode,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiSecurity,
  ApiConsumes
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { TokenDto } from './dto/token.dto';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { GetUser } from 'src/shared/decorators/get.user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ValidationDto } from './dto/validation.dto';
import { GenerateEmailCodeDto } from './dto/generate.email.code.dto';
import { ConfirmEmailDto } from './dto/confirm.email.dto';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RoleEnum } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileInfoDto } from './dto/upload.file.info.dto';
import { multerOptions } from 'src/shared/helpers/multer.options';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Registration of user' })
  @ApiResponse({ status: 200, type: TokenDto })
  @ApiBody({ type: RegisterDto })
  @HttpCode(200)
  @Post('register')
  async register(@Body() data: RegisterDto): Promise<TokenDto> {
    return this.authService.register(data);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: TokenDto })
  @ApiBody({ type: RegisterDto })
  @HttpCode(200)
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@GetUser() user: User): Promise<TokenDto> {
    return plainToClass(TokenDto, {
      token: await this.authService.generateAccessToken({ id: String(user.id) })
    });
  }

  @ApiSecurity('accessToken')
  @ApiOperation({ summary: 'verification user data in system' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: ValidationDto })
  @HttpCode(200)
  @Roles(RoleEnum.user)
  @Post('verification')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async verification(
    @GetUser() user: User,
    @Body() data: ValidationDto
  ): Promise<void> {
    return this.authService.verification(user.id, data);
  }

  @ApiSecurity('accessToken')
  @ApiOperation({ summary: 'generate code form email confirmation for user' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: GenerateEmailCodeDto })
  @HttpCode(200)
  @Roles(RoleEnum.user)
  @Post('generateEmailCode')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async generateEmailCode(
    @GetUser() user: User,
    @Body() data: GenerateEmailCodeDto
  ): Promise<void> {
    return this.authService.generateEmailCode(user.id, data);
  }

  @ApiSecurity('accessToken')
  @ApiOperation({ summary: 'confirmation email by code for user' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: ConfirmEmailDto })
  @HttpCode(200)
  @Roles(RoleEnum.user)
  @Post('confirmEmail')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async confirmEmail(
    @GetUser() user: User,
    @Body() data: ConfirmEmailDto
  ): Promise<string> {
    return this.authService.confirmEmail(user.id, data);
  }
}
