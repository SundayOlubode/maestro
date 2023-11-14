import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const Config = new ConfigService();

import * as FormData from "form-data";
import Mailgun, { MailgunClientOptions, MailgunMessageData } from "mailgun.js";
import { User } from "src/user/entities/user.entity";
const mailgun = new Mailgun(FormData);

const mailgunClientOptions: MailgunClientOptions = {
  username: "api",
  key: Config.get("MAILGUN_API_KEY"),
};

const mg = mailgun.client(mailgunClientOptions);

@Injectable()
export class EmailService {
  to: string;
  firstname: string;
  from: string;

  constructor(private configService: ConfigService) {
    this.from = `Maestro <no-reply@maestroapi.com>`;
  }

  async send(template: string, subject: string, user: User, otp: number) {
    const data: MailgunMessageData = {
      from: this.from,
      to: user.email,
      template,
      subject,
      "h:X-Mailgun-Variables": JSON.stringify({
        firstname: user.firstname,
        otp,
      }),
    };

    try {
      await mg.messages.create(Config.get("DOMAIN"), data);
    } catch (error) {
      console.log(error);
    }
  }

  async sendOtp(user: User, otp: number) {
    await this.send("maestro-otp", "OTP! Verify Your Account", user, otp);
  }
}
