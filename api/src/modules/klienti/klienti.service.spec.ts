import { Test, TestingModule } from '@nestjs/testing';
import { KlientiService } from './klienti.service';

describe('KlientiService', () => {
  let service: KlientiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KlientiService],
    }).compile();

    service = module.get<KlientiService>(KlientiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
