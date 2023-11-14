import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { EmailModule } from "src/email/email.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [EmailModule, JwtModule.register({})],
})
export class AuthModule {}
