import { Test, TestingModule } from '@nestjs/testing';
import { KlientiController } from './klienti.controller';
import { KlientiService } from './klienti.service';

describe('KlientiController', () => {
  let controller: KlientiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KlientiController],
      providers: [KlientiService],
    }).compile();

    controller = module.get<KlientiController>(KlientiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
