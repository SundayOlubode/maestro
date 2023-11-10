import { User } from "src/user/entities/user.entity";
declare const LoginDto_base: import("@nestjs/common").Type<Partial<Pick<User, keyof User>>>;
export declare class LoginDto extends LoginDto_base {
}
export {};
