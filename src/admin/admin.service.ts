import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { Mailer } from 'src/shared/helpers/mailer';
import { UserService } from 'src/user/user.service';
import { CreateManagerDto } from './dto/create.manager.dto';
import RandExp from 'randexp';

@Injectable()
export class AdminService {
  constructor(
    private userService: UserService,
    private mailer: Mailer,
    private authService: AuthService
  ) {}

  async createManager(
    data: CreateManagerDto,
    adminId: number
  ): Promise<TokenDto> {
    try {
      const password = new RandExp(
        /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{10}$/
      ).gen();

      const user = await this.userService.createUser(
        { ...data, password },
        adminId
      );

      this.mailer.sendMail({
        from: process.env.SENDGRID_FROM,
        to: data.email,
        subject: 'Introduction for Manager',
        text: `Here you go password: ${password}. Please use it for login`
      });

      const token = await this.authService.generateAccessToken({
        id: String(user.generatedMaps[0].id)
      });

      return plainToClass(TokenDto, { token });
    } catch {
      throw new UnauthorizedException('Registration failed');
    }
  }
}
