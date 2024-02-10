import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { WordModule } from './word/word.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guard';
import { JwtModule } from '@nestjs/jwt';
import type { RedisClientOptions } from 'redis';
import { ExceptionModule } from './exception/exception.module';
import * as redisStore from 'cache-manager-redis-store';
import { ExceptionService } from './exception/exception.service';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    JwtModule.register({
      global: true,
    }),
    DatabaseModule,
    UserModule,
    WordModule,
    CommonModule,
    AuthModule,
    EmailModule,
    CacheModule.register({
      isGlobal: true,
    }),
    ExceptionModule,
    OpenaiModule,
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionService,
    },
  ],
})
export class AppModule {}
