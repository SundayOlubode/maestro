import { ConfigService } from "@nestjs/config";
import { DatabaseService } from "src/database/database.service";
import { User } from "src/user/entities/user.entity";
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly db;
    constructor(config: ConfigService, db: DatabaseService);
    validate(payload: {
        sub: number;
        email: string;
    }): Promise<User>;
}
export {};
