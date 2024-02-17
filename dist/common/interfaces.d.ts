import { Word } from '@prisma/client';
export declare class AllWords {
    [key: string]: {
        id: number;
        countdown: number;
        word: Word;
    }[];
}
