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
import { KlientiService } from './klienti.service';
import { CreateKlientiDto } from './dto/create-klienti.dto';
import { UpdateKlientiDto } from './dto/update-klienti.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('klienti')
@UseGuards(AuthGuard)
export class KlientiController {
  constructor(private readonly klientiService: KlientiService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createKlientiDto: CreateKlientiDto,
  ) {
    return this.klientiService.create(createKlientiDto, user);
  }

  @Get()
  findServer(
    @Query('take') take: number,
    @Query('page') page: number,
    @Query('search_priezvisko') search_priezvisko?: string,
    @Query('big_search') big_search?: string,
  ) {
    return this.klientiService.findServer(
      take || 50,
      page - 1 || 0,
      search_priezvisko,
      big_search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.klientiService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateKlientiDto: UpdateKlientiDto,
  ) {
    return this.klientiService.update(+id, updateKlientiDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.klientiService.remove(+id, user);
  }
}
