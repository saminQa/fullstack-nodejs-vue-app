import { Module } from '@nestjs/common';
import { KlientiService } from './klienti.service';
import { KlientiController } from './klienti.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Klient } from 'src/entities/klient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Klient])],
  controllers: [KlientiController],
  providers: [KlientiService],
})
export class KlientiModule {}
