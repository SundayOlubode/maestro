import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
export declare class ExceptionService implements ExceptionFilter {
    private readonly configService;
    constructor();
    catch(exception: HttpException, host: ArgumentsHost): void;
}
