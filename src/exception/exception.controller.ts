import { Controller } from '@nestjs/common';
import { ExceptionService } from './exception.service';

@Controller('exception')
export class ExceptionController {
  constructor(private readonly exceptionService: ExceptionService) {}
}
