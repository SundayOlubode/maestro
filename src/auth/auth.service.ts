import {
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmailService } from 'src/email/email.service';
import { generateOtp } from 'src/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly db: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
    private email: EmailService,
  ) {}

  /**
   * REGISTER USER
   * @param dto
   * @returns
   */
  async create(dto: CreateUserDto) {
    dto.email = dto.email.toLowerCase();
    dto.password = await argon.hash(dto.password);

    const user = await this.db.user.create({
      data: dto,
    });

    delete user.password;
    const accessToken = await this.signToken(user.id, user.email);

    // GENERATE OTP
    const { otp, otpExpiry } = generateOtp();

    // STORE OTP IN CACHE, EXP AS OTPEXPIRY
    await this.cacheManager.set(`otp-${user.id}`, otp, otpExpiry);

    // SEND OTP TO EMAIL
    if (this.config.get('NODE_ENV') === 'production') {
      await this.email.sendOtp(user, otp);
    } else {
      console.log('OTP', otp);
    }

    return {
      status: 'success',
      message: 'OTP sent to email. Please verify your account',
      data: { user, access_token: accessToken },
    };
  }

  /**
   * LOGIN USER
   * @param dto
   * @returns
   */
  async login(dto: LoginDto) {
    const user = await this.db.user.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    delete user.password;

    const accessToken = await this.signToken(user.id, user.email);

    return {
      status: 'success',
      message: 'Login successful',
      data: { user, access_token: accessToken },
    };
  }

  /**
   * VERIFY USER
   * @param otp
   * @param user
   * @returns { resp: Promise<string> }
   */
  async verify(otp: number, user: User) {
    if (!user)
      throw new ForbiddenException('Please login to proceed!');
    if (user.verified)
      throw new ForbiddenException(
        'Account already verified. Please login!',
      );

    // VERIFY OTP
    console.log('VERIFY KEY', `otp-${user.id}`);

    const cachedOtp: string = await this.cacheManager.get<string>(
      `otp-${user.id}`,
    );
    console.log(cachedOtp, otp);

    if (!cachedOtp || parseInt(cachedOtp) !== otp) {
      throw new ForbiddenException('Expired or Incorrect OTP!');
    }
    await this.db.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
      },
    });
    return {
      status: 'success',
      message: 'Account verified successfully!',
      statusCode: 200,
    };
  }

  /**
   * SIGN TOKEN
   * @param userId
   * @param email
   * @returns { token: string }
   */
  private async signToken(
    userId: number,
    email: string,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret,
    });
    return token;
  }

  /**
   * RESEND OTP
   * @param user
   * @returns { status: string, message: string }
   */
  async resendOtp(user: User) {
    if (!user)
      throw new ForbiddenException('Please login to proceed!');

    const { otp, otpExpiry } = generateOtp();
    await this.cacheManager.set(`otp-${user.id}`, otp, otpExpiry);

    // SEND OTP TO EMAIL
    if (this.config.get('NODE_ENV') === 'production') {
      await this.email.sendOtp(user, otp);
    } else {
      console.log('OTP', otp);
    }

    return {
      status: 'success',
      message: 'OTP sent to email. Please verify your account',
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
