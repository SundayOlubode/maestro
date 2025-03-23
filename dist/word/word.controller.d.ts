import { WordService } from './word.service';
import { CreateIdiomDto, CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { User } from '@prisma/client';
export declare class WordController {
    private readonly wordService;
    constructor(wordService: WordService);
    create(createWordDto: CreateWordDto, user: any): Promise<{
        status: string;
        message: string;
        data: {
            word: string | {
                id: number;
                word: string;
                meaning: string;
                usages: string[];
                isIdiom: boolean;
                created_at: Date;
                updated_at: Date;
            };
        };
    }>;
    createIdiom(createIdiomDto: CreateIdiomDto, user: User): Promise<{
        status: string;
        message: string;
        data: {
            idiom: string | {
                id: number;
                word: string;
                meaning: string;
                usages: string[];
                isIdiom: boolean;
                created_at: Date;
                updated_at: Date;
            };
        };
    }>;
    createWordUsage(word: string): Promise<string>;
    sendWordUsagesToUsers(): Promise<{
        status: string;
        message: string;
    }>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateWordDto: UpdateWordDto): string;
    remove(id: string): string;
}
