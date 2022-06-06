import { SmsSender } from './helpers/twilio.sms.sender';
import { Mailer } from './helpers/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/user/entities/user.role.entity';
import { Currency } from './entities/currency.entity';
import { Photo } from './entities/photo.entity';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN
    }),
    TypeOrmModule.forFeature([Currency, UserRole, Photo])
  ],
  controllers: [],
  providers: [Mailer, SmsSender],
  exports: [Mailer, SmsSender]
})
export class SharedModule {}
