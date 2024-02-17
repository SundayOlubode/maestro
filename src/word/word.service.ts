import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { OpenaiService } from 'src/openai/openai.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import {
  ASST_ID,
  DEV_ASST_ID,
  DEV_THREAD_ID,
  EnglishWords,
  NODE_ENV,
  THREAD_ID,
} from 'src/constants';
import { Word } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class WordService {
  constructor(
    private readonly db: DatabaseService,
    private readonly openai: OpenaiService,
    private readonly config: ConfigService,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateWordDto, user: any) {
    let word: string | Word = dto.word.toLowerCase();

    // CHECK IF WORD IS A VALID ENGLISH WORD
    if (!EnglishWords.check(word)) {
      throw new BadRequestException(
        `${dto.word} is not a valid English word`,
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
      return this.WordCreateResponse(word);
    }

    await this.generateWordMeaningAndUsages(word, user);

    return this.WordCreateResponse(word);
  }

  private WordCreateResponse(word: string | Word) {
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
    const threadId =
      NODE_ENV === 'development' ? DEV_THREAD_ID : THREAD_ID;

    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: wordText,
    });
    await this.openai.beta.threads.runs.create(threadId, {
      assistant_id:
        NODE_ENV === 'development' ? DEV_ASST_ID : ASST_ID,
    });

    const intervalId = setInterval(async () => {
      const response =
        await this.openai.beta.threads.messages.list(threadId);
      const lastMessage = response.data[0];
      const result = lastMessage.content[0]['text']['value'];

      if (result) {
        fs.appendFileSync(
          'word-meaning-and-usages.txt',
          result + '\n',
        );

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
            counters: {
              create: {
                user_id: user.id,
                countdown:
                  NODE_ENV === 'development' ? 10 : undefined,
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

  async sendWordUsagesToUsers() {
    // SELECT UNIQUE USER_ID ON COUNTER WHERE COUNTDOWN > 0
    const users = await this.db.counter.findMany({
      distinct: ['user_id'],
      select: {
        user_id: true,
        user: true,
      },
      where: {
        countdown: {
          gt: 0,
        },
      },
    });

    const totalCounters = [];
    let allWords: {
      [key: string]: {
        id: number;
        countdown: number;
        word: Word;
      }[];
    } = {};

    for (let user of users) {
      // SELECT ONLY WORD FIELD FROM COUNTER TABLE WHERE USER_ID = USERID
      const counters = await this.db.counter.findMany({
        where: {
          user_id: user.user_id,
        },
        select: {
          id: true,
          word: true,
          countdown: true,
        },
        orderBy: {
          countdown: 'asc',
        },
        take: 3,
      });

      allWords[user.user.email] = counters;
      totalCounters.push(...counters);
    }

    await this.emailService.sendWordUsagesToUsers(allWords);
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
