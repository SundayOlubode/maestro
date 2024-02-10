import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { OpenaiService } from 'src/openai/openai.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import {
  DEV_ASST_ID,
  DEV_THREAD_ID,
  EnglishWords,
} from 'src/constants';
import { Word } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class WordService {
  constructor(
    private readonly db: DatabaseService,
    private readonly openai: OpenaiService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateWordDto, user: any) {
    let word: string | Word = dto.word.toLowerCase();

    // CHECK IF WORD IS A VALID ENGLISH WORD
    if (!EnglishWords.check(word)) {
      throw new BadRequestException(
        `${word} is not a valid English word`,
      );
    }

    // CHECK IF WORD ALREADY EXISTS IN DATABASE
    const wordExists = await this.db.word.findFirst({
      where: {
        word,
      },
    });

    if (wordExists) {
      await this.updateWordUsersAndCounter(wordExists, user);
      return {
        status: 'success',
        message: 'Word created successfully',
        data: {
          word,
        },
      };
    }

    await this.generateWordMeaningAndUsages(word, user);

    return {
      status: 'success',
      message: 'Word created successfully',
      data: {
        word,
      },
    };
  }

  private async generateWordMeaningAndUsages(
    wordText: string,
    user: User,
  ) {
    const threadId = DEV_THREAD_ID;

    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: wordText,
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
        // fs.appendFileSync('word-meaning-and-usages.txt', result);

        const meaningRegex = /Meaning:(.*?)(?=Sentences:)/s;
        const usageRegex = /Sentences:(.*)/s;
        const sentenceRegex = /\d+\. "(.*?)"/g;

        const meaning: string = result.match(meaningRegex)[1].trim();
        const usageMatch = result.match(usageRegex)[1].trim();
        const usages = [];
        let match;
        while ((match = sentenceRegex.exec(usageMatch)) !== null) {
          usages.push(match[1].trim());
        }

        // CREATE WORD
        const word = await this.db.word.create({
          data: {
            word: wordText,
            meaning,
            usages,
            users: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        clearInterval(intervalId);
      }
    }, 20000);

    return;
  }

  private async updateWordUsersAndCounter(word: Word, user: User) {
    // UPDATE WORD USERS
    await this.db.word.update({
      where: {
        id: word.id,
      },
      data: {
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // CREATE COUNTER
    await this.db.counter.create({
      data: {
        user_id: user.id,
        word_id: word.id,
      },
    });

    return;
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
}
