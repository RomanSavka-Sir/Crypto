import { SharedModule } from './../shared/shared.module';
import { GenerateEmailCode } from './entities/generate.email.code.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Mailer } from 'src/shared/helpers/mailer';
import { UserRole } from 'src/user/entities/user.role.entity';
import { Photo } from 'src/shared/entities/photo.entity';
import { TwoFactorStrategy } from './strategies/two.factor.strategy';

require('dotenv').config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }
    }),
    TypeOrmModule.forFeature([User, UserRole, Photo, GenerateEmailCode]),
    UserModule,
    PassportModule,
    SharedModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    Mailer,
    TwoFactorStrategy
  ],
  exports: [AuthService, PassportModule]
})
export class AuthModule {}
