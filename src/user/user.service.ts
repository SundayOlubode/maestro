import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "src/database/database.service";
import * as argon from "argon2";

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateUserDto) {
    dto.email = dto.email.toLowerCase();
    dto.password = await argon.hash(dto.password);

    const user = await this.db.user.create({
      data: dto,
    });

    delete user.password;
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const user = await this.db.user.findUnique({
      where: { id },
    });

    delete user.password;
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
