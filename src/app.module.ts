import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { WordModule } from "./word/word.module";
import { CommonModule } from "./common/common.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UserModule, WordModule, CommonModule, AuthModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
