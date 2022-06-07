import { decrypt } from 'src/shared/helpers/crypto';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

require('dotenv').config();

@Injectable()
export class TwoFactorStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super();
  }

  async validate(@Req() req): Promise<User> {
    const user = await this.userRepository.findOne({
      id: req.body.id
    });

    const code = decrypt(
      process.env.SECRET_TOKEN,
      process.env.SECRET_IV,
      user.code2fa
    );

    if (code !== req.body.code2fa) {
      throw new UnauthorizedException('Login failed');
    }
    return user;
  }
}
