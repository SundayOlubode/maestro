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
const config_1 = require("@nestjs/config");
const ejs_1 = require("ejs");
const FormData = require("form-data");
const mailgun_js_1 = require("mailgun.js");
const constants_1 = require("../constants");
const mailgun = new mailgun_js_1.default(FormData);
const mailgunClientOptions = {
    username: 'api',
    key: constants_1.MAILGUN_API_KEY,
};
const mg = mailgun.client(mailgunClientOptions);
const NUMWORDUSAGES = constants_1.NODE_ENV === 'production' ? 8 : 5;
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.from = constants_1.MAESTROSENDER;
    }
    async send(template, subject, user, otp) {
        const data = {
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
            console.log(constants_1.MAILGUN_API_KEY);
            await mg.messages.create(constants_1.EMAIL_DOMAIN, data);
        }
        catch (error) {
            console.log(error);
        }
    }
    async sendOtp(user, otp) {
        await this.send('maestro-otp', 'OTP! Verify Your Account', user, otp);
    }
    async sendWordUsagesToUsers(allWords) {
        const subject = 'Word Usages';
        for (const email in allWords) {
            let words = allWords[email];
            words.forEach((wordData) => {
                const SLICEBEGIN = wordData.countdown - NUMWORDUSAGES;
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
            await mg.messages.create(constants_1.EMAIL_DOMAIN, mailOptions);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map