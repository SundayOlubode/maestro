import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIdiomDto, CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { DatabaseService } from 'src/database/database.service';
import { OpenaiService } from 'src/openai/openai.service';
import * as fs from 'fs';
import {
  NUM_WORD_TO_GEN,
  NUMWORDUSAGES,
  SYSTEM_CONTENT,
  IDIOM_SYSTEM_CONTENT,
  IDIOM_VALIDATOR_SYSTEM_CONTENT,
  WORD_VALIDATOR_SYSTEM_CONTENT,
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

  async create(dto: CreateWordDto, user: User) {
    let word: string | Word = dto.word.toLowerCase();

    const isValidIdiom = await this.validateWord(word);
    if (!isValidIdiom) {
      throw new BadRequestException(
        `"${dto.word}" does not appear to be a recognized English word`,
      );
    }

    // CHECK IF WORD ALREADY EXISTS IN DATABASE
    const wordExists = await this.db.word.findFirst({
      where: {
        word,
      },
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    if (wordExists) {
      await this.updateWordUsersAndCounter(wordExists, user);
      return this.wordCreateResponse(word);
    }

    await this.generateWordMeaningAndUsages(word, user);

    return this.wordCreateResponse(word);
  }

  /**
   * Create an idiom using the existing Word model structure
   */
  async createIdiom(dto: CreateIdiomDto, user: User) {
    let idiom: string | Word = dto.idiom.toLowerCase().trim();

    // CHECK IF IDIOM ALREADY EXISTS IN DATABASE
    const idiomExists = await this.db.word.findFirst({
      where: {
        word: idiom,
        isIdiom: true,
      },
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    if (idiomExists) {
      await this.updateWordUsersAndCounter(idiomExists, user);
      return this.idiomCreateResponse(idiom);
    }

    // First validate if it's a legitimate idiom using OpenAI
    const isValidIdiom = await this.validateIdiom(idiom);
    if (!isValidIdiom) {
      throw new BadRequestException(
        `"${dto.idiom}" does not appear to be a recognized English idiom`,
      );
    }

    await this.generateIdiomMeaningAndUsages(idiom, user);

    return this.idiomCreateResponse(idiom);
  }

  /**
   * Validates if a phrase is a recognized idiom using OpenAI
   */
  async validateIdiom(phrase: string): Promise<boolean> {
    try {
      const response = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: IDIOM_VALIDATOR_SYSTEM_CONTENT,
          },
          {
            role: 'user',
            content: `Is "${phrase}" a recognized English idiom or common phrase?`,
          },
        ],
        temperature: 0.2, // Lower temperature for more deterministic response
        max_tokens: 10,
        model: modelName,
      });

      const result = response.choices[0].message.content
        .trim()
        .toUpperCase();
      return result.includes('YES');
    } catch (error) {
      console.error(`Error validating idiom: ${error.message}`);
      return false;
    }
  }

  /**
   * Validates if a word is a recognized idiom using OpenAI
   */
  async validateWord(phrase: string): Promise<boolean> {
    try {
      const response = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: WORD_VALIDATOR_SYSTEM_CONTENT,
          },
          {
            role: 'user',
            content: `Is "${phrase}" a recognized English word?`,
          },
        ],
        temperature: 0.2,
        max_tokens: 10,
        model: modelName,
      });

      const result = response.choices[0].message.content
        .trim()
        .toUpperCase();
      return result.includes('YES');
    } catch (error) {
      console.error(`Error validating word: ${error.message}`);
      return false;
    }
  }
  /**
   * Get all idioms in the system
   */
  async getAllIdioms(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const idioms = await this.db.word.findMany({
      where: {
        isIdiom: true,
      },
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });

    const total = await this.db.word.count({
      where: {
        isIdiom: true,
      },
    });

    return {
      idioms,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a specific idiom by text
   */
  async getIdiomByText(idiomText: string) {
    const idiom = await this.db.word.findFirst({
      where: {
        word: idiomText.toLowerCase().trim(),
        isIdiom: true,
      },
    });

    if (!idiom) {
      throw new BadRequestException(`Idiom "${idiomText}" not found`);
    }

    return idiom;
  }

  private idiomCreateResponse(idiom: string | Word) {
    return {
      status: 'success',
      message: 'Idiom created successfully',
      data: {
        idiom,
      },
    };
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

  /**
   * Create idiom usages from GPT with specialized prompt for idioms
   */
  async createIdiomUsagesFromGPT(idiom: string) {
    const response = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: IDIOM_SYSTEM_CONTENT,
        },
        { role: 'user', content: idiom },
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: modelName,
    });

    return response.choices[0].message.content;
  }

  /**
   * Generate word meaning and usages in the background
   */
  private async generateWordMeaningAndUsages(
    wordText: string,
    user: User,
  ): Promise<void> {
    // Start a background process and return immediately
    this.handleWordGeneration(wordText, user).catch((err) =>
      console.error(`Error generating word "${wordText}":`, err),
    );

    return;
  }

  /**
   * Handle the actual word generation process
   * This runs in the background and handles all the steps
   */
  private async handleWordGeneration(
    wordText: string,
    user: User,
  ): Promise<void> {
    try {
      // First check if the word already exists to avoid duplicate work
      const existingWord = await this.db.word.findUnique({
        where: { word: wordText },
        include: { users: true },
      });

      if (existingWord) {
        await this.updateWordUsersAndCounter(existingWord, user);
        console.log(
          `Word "${wordText}" already exists, updated users and counter`,
        );
        return;
      }

      // Only make the API call if the word doesn't exist
      let attempts = 0;
      const maxAttempts = 3;
      let response = null;

      // Try up to maxAttempts times with exponential backoff
      while (attempts < maxAttempts && !response) {
        try {
          response = await this.createWordUsagesFromGPT(wordText);
        } catch (error) {
          attempts++;
          console.log(
            `Attempt ${attempts} failed for word "${wordText}". Retrying...`,
          );

          if (attempts >= maxAttempts) {
            throw new Error(
              `Failed to generate content for word "${wordText}" after ${maxAttempts} attempts`,
            );
          }

          // Exponential backoff: 2s, 4s, 8s, etc.
          await new Promise((resolve) =>
            setTimeout(resolve, 2000 * Math.pow(2, attempts - 1)),
          );
        }
      }

      if (response) {
        // Check again before creating to handle race conditions
        const wordCheck = await this.db.word.findUnique({
          where: { word: wordText },
        });

        if (!wordCheck) {
          await this.createWordFromAIResult(
            response,
            wordText,
            user,
            false,
          );
          console.log(`Word "${wordText}" created successfully`);
        } else {
          await this.updateWordUsersAndCounter(wordCheck, user);
          console.log(
            `Word "${wordText}" was created by another process, updated users and counter`,
          );
        }
      }
    } catch (error) {
      console.error(`Error processing word "${wordText}":`, error);
    }
  }

  /**
   * Generate idiom meaning and usages in the background
   */
  private async generateIdiomMeaningAndUsages(
    idiomText: string,
    user: User,
  ): Promise<void> {
    // Start a background process and return immediately
    this.handleIdiomGeneration(idiomText, user).catch((err) =>
      console.error(`Error generating idiom "${idiomText}":`, err),
    );

    return;
  }

  /**
   * Handle the actual idiom generation process
   * This runs in the background and handles all the steps
   */
  private async handleIdiomGeneration(
    idiomText: string,
    user: User,
  ): Promise<void> {
    try {
      // First check if the idiom already exists to avoid duplicate work
      const existingIdiom = await this.db.word.findUnique({
        where: { word: idiomText },
        include: { users: true },
      });

      if (existingIdiom) {
        await this.updateWordUsersAndCounter(existingIdiom, user);
        console.log(
          `Idiom "${idiomText}" already exists, updated users and counter`,
        );
        return;
      }

      // Only make the API call if the idiom doesn't exist
      let attempts = 0;
      const maxAttempts = 3;
      let response = null;

      // Try up to maxAttempts times with exponential backoff
      while (attempts < maxAttempts && !response) {
        try {
          response = await this.createIdiomUsagesFromGPT(idiomText);
        } catch (error) {
          attempts++;
          console.log(
            `Attempt ${attempts} failed for idiom "${idiomText}". Retrying...`,
          );

          if (attempts >= maxAttempts) {
            throw new Error(
              `Failed to generate content for idiom "${idiomText}" after ${maxAttempts} attempts`,
            );
          }

          // Exponential backoff: 2s, 4s, 8s, etc.
          await new Promise((resolve) =>
            setTimeout(resolve, 2000 * Math.pow(2, attempts - 1)),
          );
        }
      }

      if (response) {
        // Check again before creating to handle race conditions
        const idiomCheck = await this.db.word.findUnique({
          where: { word: idiomText },
        });

        if (!idiomCheck) {
          await this.createWordFromAIResult(
            response,
            idiomText,
            user,
            true,
          );
          console.log(`Idiom "${idiomText}" created successfully`);
        } else {
          await this.updateWordUsersAndCounter(idiomCheck, user);
          console.log(
            `Idiom "${idiomText}" was created by another process, updated users and counter`,
          );
        }
      }
    } catch (error) {
      console.error(`Error processing idiom "${idiomText}":`, error);
      // Optionally, you could log this to a database or monitoring system
    }
  }

  private async createWordFromAIResult(
    result,
    wordText,
    user,
    isIdiom = false,
  ) {
    try {
      const meaningRegex = /\*\*Meaning(?:.*?):\*\*(.*?)(?=\*\*|$)/s;
      const meaningMatch = result.match(meaningRegex);
      const meaning = meaningMatch ? meaningMatch[1].trim() : '';

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
      fs.appendFileSync(
        isIdiom
          ? 'idiom-meaning-and-usages.txt'
          : 'word-meaning-and-usages.txt',
        result + '\n\n',
      );

      // CREATE WORD/IDIOM
      await this.db.word.create({
        data: {
          word: wordText,
          meaning,
          usages,
          isIdiom, // Mark as idiom if applicable
          users: {
            connect: {
              id: user.id,
            },
          },
          counters: {
            create: {
              user_id: user.id,
              countdown: NUM_WORD_TO_GEN,
            },
          },
        },
      });
      return;
    } catch (error) {
      console.error(`Error creating word: ${error.message}`);
      throw new BadRequestException(
        `Error creating word: ${error.message}`,
      );
    }
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
        countdown: NUM_WORD_TO_GEN,
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
    return await this.db.counter.findMany({
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
  }

  private async selectWordUsers(users, totalCounters, allWords) {
    for (let user of users) {
      // SELECT ONLY WORD FIELD FROM COUNTER TABLE WHERE USER_ID = USERID
      const counters = await this.db.counter.findMany({
        where: {
          user_id: user.user_id,
          countdown: {
            gt: 0,
          },
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
