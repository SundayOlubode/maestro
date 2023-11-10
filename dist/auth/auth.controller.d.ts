import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/create-auth.dto";
import { User } from "src/user/entities/user.entity";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<string>;
    verify(otp: number, user: User): string;
    findAll(): string;
    findOne(id: string): string;
    remove(id: string): string;
}
