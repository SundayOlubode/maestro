"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const ejs_1 = require("ejs");
const constants_1 = require("../constants");
const resend_1 = require("resend");
const resend = new resend_1.Resend(constants_1.RESEND_API_KEY);
let EmailService = class EmailService {
    constructor() {
        this.from = `Maestro <no-reply@${constants_1.EMAIL_DOMAIN}>`;
    }
    async sendOtp(user, otp) {
        if (!user?.email) {
            console.log('Attempted to send OTP to user with no email address');
            return false;
        }
        try {
            const pathname = `${__dirname}/../../src/email/views/otp.ejs`;
            const html = await (0, ejs_1.renderFile)(pathname, { user, otp });
            const data = {
                from: this.from,
                to: user.email,
                subject: 'Verification Code for Your Account',
                text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
                html,
            };
            const result = await resend.emails.send(data);
            if (result.error) {
                console.log(`Failed to send OTP email to ${user.email}: ${JSON.stringify(result.error)}`);
                return false;
            }
            return true;
        }
        catch (error) {
            console.log(`Exception sending OTP email to ${user.email}: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendWordUsagesToUsers(allWords) {
        const subject = 'Your Daily Vocabulary';
        for (const email in allWords) {
            let words = allWords[email];
            words.forEach((wordData) => {
                const SLICEBEGIN = wordData.countdown - constants_1.NUMWORDUSAGES;
                const SLICEEND = wordData.countdown;
                wordData.word.usages = wordData.word.usages.slice(SLICEBEGIN, SLICEEND);
            });
            let html;
            const pathname = `${__dirname}/../../src/email/views/wordusages.ejs`;
            (0, ejs_1.renderFile)(pathname, {
                words,
            }, function (err, data) {
                html = data;
            });
            const mailOptions = {
                from: this.from,
                to: email,
                subject,
                html,
            };
            await resend.emails.send(mailOptions);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map