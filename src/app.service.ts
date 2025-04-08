import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WordService } from './word/word.service';

@Injectable()
export class AppService {
  constructor(private readonly wordService: WordService) {}

  @Cron('0 50 3 * * *') // Every day at 5:50 AM (3:50 PM UTC - Server time)
  async handleDailyWordUsageNotification() {
    console.log('Sending word usages to users...');
    await this.wordService.sendWordUsagesToUsers();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
