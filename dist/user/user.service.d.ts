import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
export declare class UserService {
    private readonly db;
    constructor(db: DatabaseService);
    create(dto: CreateUserDto): Promise<{
        id: string;
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
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        password: string;
        verified: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}
