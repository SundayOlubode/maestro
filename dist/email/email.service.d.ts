import { ConfigService } from "@nestjs/config";
import { User } from "src/user/entities/user.entity";
export declare class EmailService {
    private configService;
    to: string;
    firstname: string;
    from: string;
    constructor(configService: ConfigService);
    send(template: string, subject: string, user: User, otp: number): Promise<void>;
    sendOtp(user: User, otp: number): Promise<void>;
}
