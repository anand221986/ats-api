import { Test, TestingModule } from '@nestjs/testing';
import { ErrorLoggerService } from './error-logger.service';

describe('ErrorLoggerService', () => {
  let service: ErrorLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorLoggerService],
    }).compile();

    service = module.get<ErrorLoggerService>(ErrorLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
