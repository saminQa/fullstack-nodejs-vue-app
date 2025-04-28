import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config'; // .env

import { UsersModule } from './users/users.module';
import { KlientiModule } from './modules/klienti/klienti.module';
import { CarsModule } from './modules/cars/cars.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({ dest: './uploads' }), // for uploading files
    UsersModule,
    KlientiModule,
    CarsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
