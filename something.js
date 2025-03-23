// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { renderFile } from 'ejs';

// import {
//   MAESTROSENDER,
//   MAILGUN_API_KEY,
//   NODE_ENV,
//   EMAIL_DOMAIN,
//   NUMWORDUSAGES,
//   RESEND_API_KEY,
// } from 'src/constants';

// import { User } from 'src/user/entities/user.entity';

// import { Resend } from 'resend';
// // const resend = new Resend('re_123456789');
// const resend = new Resend(RESEND_API_KEY);
// resend.domains.create({ name: 'zidify.com' });

// @Injectable()
// export class EmailService {
//   to: string;
//   firstname: string;
//   from: string;

//   constructor(private configService: ConfigService) {
//     this.from = MAESTROSENDER || 'Sam <sam@maestro.com>';
//   }

//   private async send(subject: string, user: User, otp: number) {
//     const data = {
//       from: this.from,
//       to: user.email,
//       text: `Your OTP is ${otp}`,
//       subject,
//     };

//     try {
//       await resend.emails.send(data);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async sendOtp(user: User, otp: number) {
//     await this.send('OTP! Verify Your Account', user, otp);
//   }

//   async sendWordUsagesToUsers(allWords: any) {
//     const subject = 'Word Usages';

//     for (const email in allWords) {
//       let words = allWords[email];

//       words.forEach((wordData) => {
//         const SLICEBEGIN = wordData.countdown - NUMWORDUSAGES;
//         const SLICEEND = wordData.countdown;
//         wordData.word.usages = wordData.word.usages.slice(
//           SLICEBEGIN,
//           SLICEEND,
//         );
//       });

//       //1. RENDER HTML BASED BODY
//       let html;
//       const pathname = `${__dirname}/../../src/email/views/wordusages.ejs`;
//       renderFile(
//         pathname,
//         {
//           words,
//         },
//         function (err, data) {
//           html = data;
//         },
//       );

//       const mailOptions = {
//         from: this.from,
//         to: email,
//         subject,
//         html,
//       };

//       console.log('MAIL OPTIONS', mailOptions);

//       await resend.emails.send(mailOptions);

//       // await mg.messages.create(EMAIL_DOMAIN, mailOptions);
//     }
//   }
// }
