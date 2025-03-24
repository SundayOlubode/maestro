import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { WordService } from "./word/word.service";

@Injectable()
export class AppService {
  constructor(private readonly wordService: WordService) { }

  @Cron('0 6 * * *') // Runs every day at 8 AM
  async handleDailyWordUsageNotification() {
    console.log('Sending word usages to users...');
    await this.wordService.sendWordUsagesToUsers();
  }

  getHello(): string {
    return "Hello World!";
  }
}
