import { User } from 'src/user/entities/user.entity';
export declare class EmailService {
    to: string;
    firstname: string;
    from: string;
    constructor();
    sendOtp(user: User, otp: number): Promise<boolean>;
    sendWordUsagesToUsers(allWords: any): Promise<void>;
}
