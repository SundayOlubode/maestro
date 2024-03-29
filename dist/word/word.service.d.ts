import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { OpenaiService } from 'src/openai/openai.service';
import { EmailService } from 'src/email/email.service';
export declare class WordService {
    private readonly db;
    private readonly openai;
    private emailService;
    constructor(db: DatabaseService, openai: OpenaiService, emailService: EmailService);
    create(dto: CreateWordDto, user: any): Promise<{
        status: string;
        message: string;
        data: {
            word: string | {
                id: number;
                word: string;
                meaning: string;
                usages: string[];
                created_at: Date;
                updated_at: Date;
            };
        };
    }>;
    private WordCreateResponse;
    private generateWordMeaningAndUsages;
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
