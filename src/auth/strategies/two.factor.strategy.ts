import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

require('dotenv').config();

@Injectable()
export class TwoFactorStrategy extends PassportStrategy(Strategy, '2fa') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: { code2fa: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        code2fa: payload.code2fa
      }
    });

    if (!user)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    return user;
  }
}
