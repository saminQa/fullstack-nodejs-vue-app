import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('cars')
@UseGuards(AuthGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto, user);
  }

  @Get()
  findServer(
    @Query('take') take: number,
    @Query('page') page: number,
    @Query('big_search') big_search: string,
    @Query('search_spz') search_spz?: string,
    @Query('search_vin') search_vin?: string,
  ) {
    return this.carsService.findServer(
      take || 50,
      page - 1 || 0,
      big_search,
      search_spz,
      search_vin,
    );
  }

  @Get('/partial')
  findPartial() {
    return this.carsService.findPartial();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    return this.carsService.update(+id, updateCarDto, user);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.carsService.remove(+id, user);
  }
}
