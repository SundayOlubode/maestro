import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
export declare class EmailService {
    private configService;
    to: string;
    firstname: string;
    from: string;
    constructor(configService: ConfigService);
    private send;
    sendOtp(user: User, otp: number): Promise<void>;
    sendWordUsagesToUsers(allWords: any): Promise<void>;
}
