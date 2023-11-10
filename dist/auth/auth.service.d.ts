import { LoginDto } from "./dto/create-auth.dto";
import { DatabaseService } from "src/database/database.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
export declare class AuthService {
    private readonly db;
    private jwt;
    constructor(db: DatabaseService, jwt: JwtService);
    login(dto: LoginDto): Promise<string>;
    verify(otp: number, user: User): string;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
