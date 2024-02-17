import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { renderFile } from 'ejs';

import * as FormData from 'form-data';
import Mailgun, {
  MailgunClientOptions,
  MailgunMessageData,
} from 'mailgun.js';
import {
  MAESTROSENDER,
  MAILGUN_API_KEY,
  NODE_ENV,
  EMAIL_DOMAIN,
} from 'src/constants';
import { User } from 'src/user/entities/user.entity';
const mailgun = new Mailgun(FormData);

const mailgunClientOptions: MailgunClientOptions = {
  username: 'api',
  key: MAILGUN_API_KEY,
};

const mg = mailgun.client(mailgunClientOptions);
const NUMWORDUSAGES = NODE_ENV === 'production' ? 8 : 5;

@Injectable()
export class EmailService {
  to: string;
  firstname: string;
  from: string;

  constructor(private configService: ConfigService) {
    this.from = MAESTROSENDER;
  }

  private async send(
    template: string,
    subject: string,
    user: User,
    otp: number,
  ) {
    const data: MailgunMessageData = {
      from: this.from,
      to: user.email,
      template,
      subject,
      'h:X-Mailgun-Variables': JSON.stringify({
        firstname: user.firstname,
        otp,
      }),
    };

    try {
      console.log(MAILGUN_API_KEY);

      await mg.messages.create(EMAIL_DOMAIN, data);
    } catch (error) {
      console.log(error);
    }
  }

  async sendOtp(user: User, otp: number) {
    await this.send(
      'maestro-otp',
      'OTP! Verify Your Account',
      user,
      otp,
    );
  }

  async sendWordUsagesToUsers(allWords: any) {
    const subject = 'Word Usages';

    for (const email in allWords) {
      let words = allWords[email];

      words.forEach((wordData) => {
        const SLICEBEGIN = wordData.countdown - NUMWORDUSAGES;
        const SLICEEND = wordData.countdown;
        wordData.word.usages = wordData.word.usages.slice(
          SLICEBEGIN,
          SLICEEND,
        );
      });

      //1. RENDER HTML BASED BODY
      let html;
      const pathname = `${__dirname}/../../src/email/views/wordusages.ejs`;
      renderFile(
        pathname,
        {
          words,
        },
        function (err, data) {
          html = data;
        },
      );

      const mailOptions = {
        from: this.from,
        to: email,
        subject,
        html,
      };

      await mg.messages.create(EMAIL_DOMAIN, mailOptions);
    }
  }
}
