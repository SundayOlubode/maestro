import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

const endpoint = 'https://models.inference.ai.azure.com';

@Injectable()
export class OpenaiService extends OpenAI {
  constructor(private readonly config: ConfigService) {
    super({
      baseURL: endpoint,
      apiKey: config.getOrThrow('GITHUB_TOKEN'),
    });
  }
}
