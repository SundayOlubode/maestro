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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const jwt_1 = require("@nestjs/jwt");
const argon = require("argon2");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const email_service_1 = require("../email/email.service");
const common_2 = require("../common");
let AuthService = class AuthService {
    constructor(cacheManager, db, jwt, config, email) {
        this.cacheManager = cacheManager;
        this.db = db;
        this.jwt = jwt;
        this.config = config;
        this.email = email;
    }
    async create(dto) {
        dto.email = dto.email.toLowerCase();
        dto.password = await argon.hash(dto.password);
        const user = await this.db.user.create({
            data: dto,
        });
        delete user.password;
        const accessToken = await this.signToken(user.id, user.email);
        const { otp, otpExpiry } = (0, common_2.generateOtp)();
        await this.cacheManager.set(`otp-${user.id}`, otp, 60000);
        await this.email.sendOtp(user, otp);
        return {
            status: 'success',
            message: 'OTP sent to email. Please verify your account',
            data: { user, access_token: accessToken },
        };
    }
    async login(dto) {
        const user = await this.db.user.findUnique({
            where: {
                email: dto.email.toLowerCase(),
            },
        });
        if (!user)
            throw new common_1.ForbiddenException('Credentials incorrect');
        const pwMatches = await argon.verify(user.password, dto.password);
        if (!pwMatches) {
            throw new common_1.ForbiddenException('Credentials incorrect');
        }
        delete user.password;
        const { otp, otpExpiry } = (0, common_2.generateOtp)();
        console.log(otp, otpExpiry);
        await this.cacheManager.set(`otp-${user.id}`, JSON.stringify(otp), otpExpiry);
        const accessToken = await this.signToken(user.id, user.email);
        return {
            status: 'success',
            message: 'Login successful',
            data: { user, access_token: accessToken },
        };
    }
    async verify(otp, user) {
        if (!user)
            throw new common_1.ForbiddenException('Please login to proceed!');
        if (user.verified)
            throw new common_1.ForbiddenException('Account already verified. Please login!');
        const cachedOtp = await this.cacheManager.get(`otp-${user.id}`);
        if (!cachedOtp || cachedOtp !== otp.toString()) {
            throw new common_1.ForbiddenException('Expired or Incorrect OTP!');
        }
        await this.db.user.update({
            where: {
                id: user.id,
            },
            data: {
                verified: true,
            },
        });
        return {
            status: 'success',
            message: 'Account verified successfully!',
            statusCode: 200,
        };
    }
    async signToken(userId, email) {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '30d',
            secret,
        });
        return token;
    }
    findAll() {
        return `This action returns all auth`;
    }
    findOne(id) {
        return `This action returns a #${id} auth`;
    }
    remove(id) {
        return `This action removes a #${id} auth`;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, database_service_1.DatabaseService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map