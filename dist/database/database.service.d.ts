import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
export declare class DatabaseService extends PrismaClient {
    constructor(config: ConfigService);
}
