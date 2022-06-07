import { VerifiedEmailGuard } from './../shared/guards/verified.email.guard';
import { TokenDto } from 'src/auth/dto/token.dto';
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
import { AuthGuard } from '@nestjs/passport';
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
import { ChangePasswordDto } from './dto/change.password.dto';
import { InputData2faDto } from './dto/input.data.2fa.dto';
import { plainToClass } from 'class-transformer';

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
  async login(@GetUser() user: User): Promise<TokenDto | number> {
    return this.authService.login(user.id);
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
  @ApiOperation({ summary: 'generate code for email confirmation for user' })
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

  @ApiSecurity('accessToken')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'upload photo for validation account by user' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: UploadFileInfoDto })
  @HttpCode(200)
  @Roles(RoleEnum.user)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @Post('upload')
  @UseGuards(AuthGuard('jwt'), RolesGuard, VerifiedEmailGuard)
  async uploadFile(@GetUser() user: User, @UploadedFile() file): Promise<any> {
    return this.authService.uploadFile(user.id, file);
  }

  @ApiSecurity('accessToken')
  @ApiOperation({ summary: 'change password' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: ChangePasswordDto })
  @HttpCode(200)
  @Roles(RoleEnum.user)
  @Post('changePassword')
  @UseGuards(AuthGuard('jwt'), RolesGuard, VerifiedEmailGuard)
  async changePassword(
    @Body() data: ChangePasswordDto,
    @GetUser() user: User
  ): Promise<string> {
    return this.authService.changePassword(data, user.id);
  }

  @ApiOperation({ summary: '2fa authentication' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: InputData2faDto })
  @HttpCode(200)
  @Roles(RoleEnum.user)
  @Post('2fa')
  @UseGuards(AuthGuard('custom'), RolesGuard, VerifiedEmailGuard)
  async twoFactorVerification(
    @Body() data: InputData2faDto
  ): Promise<TokenDto> {
    return plainToClass(TokenDto, {
      token: await this.authService.generateAccessToken({ id: String(data.id) })
    });
  }

  @ApiSecurity('accessToken')
  @ApiOperation({ summary: 'turn on 2fa' })
  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @Roles(RoleEnum.user)
  @Post('turnOn2fa')
  @UseGuards(AuthGuard('jwt'), RolesGuard, VerifiedEmailGuard)
  async turnOn2fa(@GetUser() user: User): Promise<void> {
    return this.authService.twoFactorVerification(user.id);
  }

  @ApiSecurity('accessToken')
  @ApiOperation({ summary: 'confirm phone for 2fa' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: InputData2faDto })
  @HttpCode(200)
  @Roles(RoleEnum.user)
  @Post('confirmPhone2fa')
  @UseGuards(AuthGuard(['jwt', 'custom']), RolesGuard, VerifiedEmailGuard)
  async confirmPhone2fa(
    @GetUser() user: User,
    @Body() data: InputData2faDto
  ): Promise<string> {
    return this.authService.confirmPhone2fa(user.id, data);
  }

  @ApiSecurity('accessToken')
  @ApiOperation({ summary: 'turn off 2fa' })
  @ApiResponse({ status: 200 })
  @HttpCode(200)
  @Roles(RoleEnum.user)
  @Post('turnOff2fa')
  @UseGuards(AuthGuard('jwt'), RolesGuard, VerifiedEmailGuard)
  async turnOff2fa(@GetUser() user: User): Promise<string> {
    return this.authService.turnOff2fa(user.id);
  }
}
