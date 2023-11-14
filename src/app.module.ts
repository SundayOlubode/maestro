import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { WordModule } from "./word/word.module";
import { CommonModule } from "./common/common.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "./email/email.module";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    WordModule,
    CommonModule,
    AuthModule,
    EmailModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 600000, // 10mins
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
