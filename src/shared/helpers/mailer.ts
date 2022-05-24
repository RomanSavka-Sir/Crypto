import { Injectable } from '@nestjs/common';
import mailer from '@sendgrid/mail';
import { MailerInterface } from '../interfaces/mailer.interface';
require('dotenv').config();

@Injectable()
export class Mailer {
  constructor() {
    mailer.setApiKey(process.env.SENDGRID_API_KEY);
  }

  sendMail(msg: MailerInterface) {
    mailer.send(msg).catch((err) => console.log(err));
  }
}
