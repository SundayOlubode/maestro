import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [EmailModule],
})
export class AuthModule {}
