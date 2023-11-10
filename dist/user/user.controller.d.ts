import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        firstname: string;
        lastname: string;
        email: string;
        password: string;
        verified: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    findAll(): string;
    findOne(id: string): Promise<{
        id: number;
        firstname: string;
        lastname: string;
        email: string;
        password: string;
        verified: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): string;
    remove(id: string): string;
}
