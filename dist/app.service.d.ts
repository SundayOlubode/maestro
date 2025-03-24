import { WordService } from "./word/word.service";
export declare class AppService {
    private readonly wordService;
    constructor(wordService: WordService);
    handleDailyWordUsageNotification(): Promise<void>;
    getHello(): string;
}
