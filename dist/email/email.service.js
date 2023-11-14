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
const Config = new config_1.ConfigService();
const FormData = require("form-data");
const mailgun_js_1 = require("mailgun.js");
const mailgun = new mailgun_js_1.default(FormData);
const mailgunClientOptions = {
    username: "api",
    key: Config.get("MAILGUN_API_KEY"),
};
const mg = mailgun.client(mailgunClientOptions);
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.from = `Maestro <no-reply@maestroapi.com>`;
    }
    async send(template, subject, user, otp) {
        const data = {
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
        }
        catch (error) {
            console.log(error);
        }
    }
    async sendOtp(user, otp) {
        await this.send("maestro-otp", "OTP! Verify Your Account", user, otp);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map