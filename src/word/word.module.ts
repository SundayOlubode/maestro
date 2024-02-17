import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { OpenaiService } from 'src/openai/openai.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [WordController],
  providers: [WordService, OpenaiService],
  imports: [EmailModule],
})
export class WordModule {}
