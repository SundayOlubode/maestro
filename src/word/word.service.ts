import { Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { OpenaiService } from 'src/openai/openai.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { DEV_ASST_ID, DEV_THREAD_ID } from 'src/constants';

@Injectable()
export class WordService {
  constructor(
    private readonly db: DatabaseService,
    private readonly openai: OpenaiService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateWordDto, user: any) {
    const word = dto.word.toLowerCase();
    //TODO: CHECK IF WORD IS A VALID ENGLISH WORD

    // CHECK IF WORD ALREADY EXISTS IN DATABASE
    const wordExists = await this.db.word.findFirst({
      where: {
        word,
      },
    });

    if (wordExists) {
      await this.db.word.update({
        where: {
          id: wordExists.id,
        },
        data: {
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    await this.db.counter.create({
      data: {
        user_id: user.id,
        word_id: wordExists.id,
      },
    });

    await this.generateWordMeaningAndUsages(word);
    return {
      status: 'success',
      message: 'Word created successfully',
      data: {
        word,
      },
    };
  }

  findAll() {
    return `This action returns all word`;
  }

  findOne(id: number) {
    return `This action returns a #${id} word`;
  }

  update(id: number, updateWordDto: UpdateWordDto) {
    return `This action updates a #${id} word`;
  }

  remove(id: number) {
    return `This action removes a #${id} word`;
  }

  private async generateWordMeaningAndUsages(word: string) {
    const threadId = DEV_THREAD_ID;

    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: word,
    });
    await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: DEV_ASST_ID,
    });

    const intervalId = setInterval(async () => {
      const response =
        await this.openai.beta.threads.messages.list(threadId);
      const lastMessage = response.data[0];
      const result = lastMessage.content[0]['text']['value'];

      if (result) {
        console.log('Result', result);
        // append result to file
        fs.appendFileSync('word-meaning-and-usages.txt', result);
        clearInterval(intervalId);
      }
    }, 5000);

    return;
  }
}
