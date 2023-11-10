import { Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/create-auth.dto";
import { DatabaseService } from "src/database/database.service";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private jwt: JwtService,
  ) {}

  /**
   *
   * @param dto
   * @returns
   */
  async login(dto: LoginDto) {
    dto.password = await argon.hash(dto.password);
    const user = await this.db.user.findUnique({
      where: { email: dto.email },
    });
    return "This action adds a new auth";
  }

  /**
   *
   * @param otp
   * @param user
   * @returns {string}
   */
  verify(otp: number, user: User) {
    return `This action updates a #${user.id} auth`;
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
