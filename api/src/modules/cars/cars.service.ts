import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from 'src/entities/car.entity';
import { Brackets, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Klient } from 'src/entities/klient.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private autoRepo: Repository<Car>,
  ) {}
  // ----- VYTVORI NOVE AUTO
  create(createCarDto: CreateCarDto, user: User) {
    const auto = this.autoRepo.create(createCarDto);
    auto.bd_creator = user.id;
    auto.bd_is_active = 1;
    auto.bd_action_user = user.id;
    auto.bd_created = new Date();

    return this.autoRepo.save(auto);
  }

  async findServer(
    take: number,
    page: number,
    big_search?: string,
    search_spz?: string,
    search_vin?: string,
  ) {
    const auta = this.autoRepo.createQueryBuilder('auto');
    if (search_spz) {
      auta.where('auto.spz ILIKE :spz', { spz: `${search_spz}%` });
    }
    if (search_vin) {
      auta.andWhere('auto.vin ILIKE :vin', { vin: `${search_vin}%` });
    }
    if (big_search) {
      auta.andWhere(
        new Brackets((qb) => {
          qb.where('auto.spz ILIKE :big_search', {
            big_search: `${big_search}%`,
          }).orWhere('auto.vin ILIKE :big_search', {
            big_search: `${big_search}%`,
          });
        }),
      );
    }
    const result = await auta
      .andWhere('auto.bd_is_active = 1')
      .take(take)
      .skip(page * take)
      .orderBy({ bd_is_active: 'DESC', id: 'DESC', spz: 'ASC' })
      .getManyAndCount();
    return result;
  }

  async findPartial() {
    const partialAuta = this.autoRepo.find({
      select: {
        id: true,
        spz: true,
        vin: true,
      },
      where: { bd_is_active: 1 },
      order: { spz: 'ASC' },
    });

    return partialAuta;
  }

  // ----- NAJDE VYBRANY AUTO PODLA ID
  async findOne(id: number) {
    const zaznam = await this.autoRepo.findOneBy({ id });
    if (!zaznam) {
      throw new NotFoundException('Záznam nebol nájdený');
    }
    return zaznam;
  }

  // ----- UPRAVI VYBRANE AUTO PODLA ID
  async update(id: number, attrs: Partial<Car>, user: User) {
    const auto = await this.findOne(+id);
    if (!auto) {
      throw new NotFoundException('Zadané auto sa nenašlo.');
    }
    Object.assign(auto, attrs);
    auto.bd_action_user = user.id;
    auto.bd_created = new Date();
    return this.autoRepo.save(auto);
  }

  async remove(id: number, user: User) {
    const auto = await this.findOne(+id);

    if (!auto) {
      throw new NotFoundException('Zadané auto sa nenašlo.');
    }
    auto.bd_is_active = 0;
    auto.bd_created = new Date();
    auto.bd_action_user = user.id;
    return this.autoRepo.save(auto);
  }
}
