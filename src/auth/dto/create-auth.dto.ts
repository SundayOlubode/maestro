import { PartialType, PickType } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";

export class LoginDto extends PartialType(
  PickType(User, ["email", "password"]),
) {}
