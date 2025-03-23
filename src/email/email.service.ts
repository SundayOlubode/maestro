import { Injectable } from '@nestjs/common';
import { renderFile } from 'ejs';

import {
  EMAIL_DOMAIN,
  NUMWORDUSAGES,
  RESEND_API_KEY,
} from 'src/constants';

import { User } from 'src/user/entities/user.entity';

import { Resend } from 'resend';
const resend = new Resend(RESEND_API_KEY);

@Injectable()
export class EmailService {
  to: string;
  firstname: string;
  from: string;

  constructor() {
    this.from = `Maestro <no-reply@${EMAIL_DOMAIN}>`;
  }

  /**
   * Send OTP verification email to user with styled template
   */
  async sendOtp(user: User, otp: number): Promise<boolean> {
    if (!user?.email) {
      console.log(
        'Attempted to send OTP to user with no email address',
      );
      return false;
    }

    try {
      // Render the HTML template
      const pathname = `${__dirname}/../../src/email/views/otp.ejs`;
      const html = await renderFile(pathname, { user, otp });

      const data = {
        from: this.from,
        to: user.email,
        subject: 'Verification Code for Your Account',
        text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
        html,
      };

      const result = await resend.emails.send(data);

      // Check if there's an error in the response
      if (result.error) {
        console.log(
          `Failed to send OTP email to ${
            user.email
          }: ${JSON.stringify(result.error)}`,
        );
        return false;
      }

      return true;
    } catch (error) {
      console.log(
        `Exception sending OTP email to ${user.email}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  async sendWordUsagesToUsers(allWords: any) {
    const subject = 'Your Daily Vocabulary';

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
      await resend.emails.send(mailOptions);
    }
  }
}
