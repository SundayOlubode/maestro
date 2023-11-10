import { Global, Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  providers: [DatabaseService, ConfigService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
