import { User } from "src/user/entities/user.entity";
import { CoreEntity } from "src/common/entities/core.entity";
export declare class Word extends CoreEntity {
    word: string;
    definition: string;
    example: string[];
    users: User[];
}
