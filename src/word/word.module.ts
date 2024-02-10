import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { OpenaiService } from 'src/openai/openai.service';

@Module({
  controllers: [WordController],
  providers: [WordService, OpenaiService],
})
export class WordModule {}
