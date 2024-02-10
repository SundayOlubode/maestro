import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [EmailModule],
})
export class AuthModule {}
