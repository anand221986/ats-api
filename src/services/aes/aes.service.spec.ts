import { Test, TestingModule } from '@nestjs/testing';
import { AesService } from './aes.service';

describe('AesService', () => {
  let service: AesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AesService],
    }).compile();

    service = module.get<AesService>(AesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
