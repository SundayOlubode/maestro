import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WordService } from './word/word.service';

@Injectable()
export class AppService {
  constructor(private readonly wordService: WordService) {}

  @Cron('0 50 4 * * *') // Every day at 6:50 AM (4:50 PM UTC - Server time)
  async handleDailyWordUsageNotification() {
    console.log('Sending word usages to users...');
    await this.wordService.sendWordUsagesToUsers();
  }

  @Cron('0 45 11 * * *') // Every day at 6:50 AM (4:50 PM UTC - Server time)
  async handleDailyNoonWordUsageNotification() {
    console.log('Sending word usages to users...');
    await this.wordService.sendWordUsagesToUsers();
  }

  @Cron('0 20 20 * * *') // Every day at 10:50 PM (20:20 PM UTC - Server time)
  async handleDailyEveningWordUsageNotification() {
    console.log('Sending evening word usages to users...');
    await this.wordService.sendWordUsagesToUsers();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
