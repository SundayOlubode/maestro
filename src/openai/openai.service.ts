import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService extends OpenAI {
  constructor(private readonly config: ConfigService) {
    super({
      apiKey: config.get('OPENAI_API_KEY'),
    });
  }
}
