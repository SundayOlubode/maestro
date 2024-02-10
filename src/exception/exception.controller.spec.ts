import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionController } from './exception.controller';
import { ExceptionService } from './exception.service';

describe('ExceptionController', () => {
  let controller: ExceptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExceptionController],
      providers: [ExceptionService],
    }).compile();

    controller = module.get<ExceptionController>(ExceptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
