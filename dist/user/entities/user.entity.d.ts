import { Word } from "src/word/entities/word.entity";
import { CoreEntity } from "src/common/entities/core.entity";
export declare class User extends CoreEntity {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    verified: boolean;
    words?: Word[];
}
