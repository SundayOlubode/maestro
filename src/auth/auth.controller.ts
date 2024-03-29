import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth.dto';
import { AuthGuard } from './guard';
import { GetUser, Public } from './decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  create(@Body() dto: CreateUserDto) {
    return this.authService.create(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Patch('verify')
  @UseGuards(AuthGuard)
  verify(@Body('otp') otp: number, @GetUser() user: User) {
    return this.authService.verify(otp, user);
  }

  @Patch('resend-otp')
  @UseGuards(AuthGuard)
  resendOtp(@GetUser() user: User) {
    return this.authService.resendOtp(user);
  }
}
