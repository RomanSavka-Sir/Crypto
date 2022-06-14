import { Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';

require('dotenv').config();

@Injectable()
export class SmsSender {
  constructor(@InjectTwilio() private readonly client: TwilioClient) {}

  async sendSMS(code: string, phone: string) {
    try {
      return await this.client.messages.create({
        body: `here your code for 2fa authentication ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
    } catch (e) {
      console.log(e);
      throw new Error('Send code was failed');
    }
  }
}
