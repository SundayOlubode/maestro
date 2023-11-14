import { LoginDto } from './dto/create-auth.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { EmailService } from 'src/email/email.service';
export declare class AuthService {
    private cacheManager;
    private readonly db;
    private jwt;
    private config;
    private email;
    constructor(cacheManager: Cache, db: DatabaseService, jwt: JwtService, config: ConfigService, email: EmailService);
    create(dto: CreateUserDto): Promise<{
        status: string;
        message: string;
        data: {
            user: {
                id: number;
                firstname: string;
                lastname: string;
                email: string;
                password: string;
                verified: boolean;
                created_at: Date;
                updated_at: Date;
            };
            access_token: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        status: string;
        message: string;
        data: {
            user: {
                id: number;
                firstname: string;
                lastname: string;
                email: string;
                password: string;
                verified: boolean;
                created_at: Date;
                updated_at: Date;
            };
            access_token: string;
        };
    }>;
    verify(otp: number, user: User): Promise<string>;
    private signToken;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
