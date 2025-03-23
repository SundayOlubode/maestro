import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { OpenaiService } from 'src/openai/openai.service';
import * as fs from 'fs';
import {
  EnglishWords,
  NODE_ENV,
  NUMWORDUSAGES,
  SYSTEM_CONTENT,
} from 'src/constants';
import { Counter, Word } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { AllWords } from 'src/common';
const modelName = 'gpt-4o-mini';

@Injectable()
export class WordService {
  constructor(
    private readonly db: DatabaseService,
    private readonly openai: OpenaiService,
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
      return this.wordCreateResponse(word);
    }

    await this.generateWordMeaningAndUsages(word, user);

    return this.wordCreateResponse(word);
  }

  private wordCreateResponse(word: string | Word) {
    return {
      status: 'success',
      message: 'Word created successfully',
      data: {
        word,
      },
    };
  }

  async createWordUsagesFromGPT(word: string) {
    const response = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_CONTENT,
        },
        { role: 'user', content: word },
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: modelName,
    });

    return response.choices[0].message.content;
  }

  private async generateWordMeaningAndUsages(
    wordText: string,
    user: User,
  ) {
    const intervalId = setInterval(async () => {
      const response = await this.createWordUsagesFromGPT(wordText);

      if (response) {
        await this.createWordFromAIResult(response, wordText, user);
        console.log('Word created successfully', response[100]);
        clearInterval(intervalId);
      }
    }, 20000);

    return;
  }

  private async createWordFromAIResult(result, wordText, user) {
    const parts = result.split('**');
    const meaning = parts.length >= 3 ? parts[2].trim() : '';

    const usages = [];
    const usageRegex = /\d+\.?\s+(.*?)(?:\.|$)/gm;
    let match;

    while ((match = usageRegex.exec(result)) !== null) {
      const usage = match[1].trim();
      if (usage) {
        usages.push(usage);
      }
    }

    // Save to file
    fs.appendFileSync('word-meaning-and-usages.txt', result + '\n\n');

    // CREATE WORD
    await this.db.word.create({
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
            countdown: NODE_ENV === 'development' ? 10 : 40,
          },
        },
      },
    });
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
    const users = await this.findUsersFromCounters();

    console.log('USERS', users);

    const totalCounters: Counter[] = [];
    let allWords: AllWords = {};

    await this.selectWordUsers(users, totalCounters, allWords);
    console.log('ALL WORDS', allWords);
    await this.emailService.sendWordUsagesToUsers(allWords);
    await this.decrementCounters(totalCounters);

    return {
      status: 'success',
      message: 'Word usages sent successfully',
    };
  }

  private async findUsersFromCounters() {
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
    return users;
  }

  private async selectWordUsers(users, totalCounters, allWords) {
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
    return;
  }

  private async decrementCounters(counters) {
    for (let counter of counters) {
      await this.db.counter.update({
        where: {
          id: counter.id,
        },
        data: {
          countdown: counter.countdown - NUMWORDUSAGES,
        },
      });
    }
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
