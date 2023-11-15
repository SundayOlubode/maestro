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
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guard';
import { JwtModule } from '@nestjs/jwt';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

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
  ],
})
export class AppModule {}
