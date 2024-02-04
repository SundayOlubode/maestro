import { HttpException } from '@nestjs/common';
export declare class ErrorService extends HttpException {
    constructor(message: string, status: number);
}
