import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch(HttpException)
export class ExceptionService implements ExceptionFilter {
  private readonly configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const message = exception.getResponse();

    if (this.configService.get('NODE_ENV') === 'development') {
      console.log(exception);
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    } else if (this.configService.get('NODE_ENV') === 'production') {
      response.status(status).json({
        statusCode: status,
        message,
      });
    }
  }
}
