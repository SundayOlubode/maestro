import { CreateIdiomDto, CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { OpenaiService } from 'src/openai/openai.service';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';
export declare class WordService {
    private readonly db;
    private readonly openai;
    private emailService;
    constructor(db: DatabaseService, openai: OpenaiService, emailService: EmailService);
    create(dto: CreateWordDto, user: User): Promise<{
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
    createIdiom(dto: CreateIdiomDto, user: User): Promise<{
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
    validateIdiom(phrase: string): Promise<boolean>;
    validateWord(phrase: string): Promise<boolean>;
    getAllIdioms(page?: number, limit?: number): Promise<{
        idioms: {
            id: number;
            word: string;
            meaning: string;
            usages: string[];
            isIdiom: boolean;
            created_at: Date;
            updated_at: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getIdiomByText(idiomText: string): Promise<{
        id: number;
        word: string;
        meaning: string;
        usages: string[];
        isIdiom: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    private idiomCreateResponse;
    private wordCreateResponse;
    createWordUsagesFromGPT(word: string): Promise<string>;
    createIdiomUsagesFromGPT(idiom: string): Promise<string>;
    private generateWordMeaningAndUsages;
    private generateIdiomMeaningAndUsages;
    private createWordFromAIResult;
    private updateWordUsersAndCounter;
    sendWordUsagesToUsers(): Promise<{
        status: string;
        message: string;
    }>;
    private findUsersFromCounters;
    private selectWordUsers;
    private decrementCounters;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateWordDto: UpdateWordDto): string;
    remove(id: number): string;
}
