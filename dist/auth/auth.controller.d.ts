import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
