import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
export declare class OpenaiService extends OpenAI {
    private readonly config;
    constructor(config: ConfigService);
}
