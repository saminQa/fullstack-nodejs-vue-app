import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateKlientiDto } from './dto/create-klienti.dto';

import { Klient } from 'src/entities/klient.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class KlientiService {
  constructor(@InjectRepository(Klient) private repo: Repository<Klient>) {}

  // ----- VYTVORI NOVY TYP POISTENIA
  create(createKlientiDto: CreateKlientiDto, user: User) {
    const klient = this.repo.create(createKlientiDto);
    klient.bd_action_user = user.id;
    klient.bd_creator = user.id;
    klient.bd_created = new Date();
    klient.bd_is_active = 1;

    return this.repo.save(klient);
  }

  // ----- NAJDE VSETKY TYPY POISTENIA
  findAll() {
    return this.repo.find();
  }

  // vyhladava serverovo podla priezviska zvlast, rc_ica zvlast, big_search => aj priezvisko aj rc_ico aj mesto
  async findServer(
    take: number,
    page: number,
    search_priezvisko?: string,
    big_search?: string,
  ) {
    const klienti = this.repo.createQueryBuilder('klient');

    if (search_priezvisko) {
      klienti.where('klient.priezvisko ILIKE :priezvisko', {
        priezvisko: `${search_priezvisko}%`,
      });
    }

    if (big_search) {
      klienti.andWhere(
        new Brackets((qb) => {
          qb.where('klient.priezvisko ILIKE :mesto', {
            mesto: `${big_search}%`,
          }).orWhere('klient.mesto ILIKE :mesto', {
            mesto: `${big_search}%`,
          });
        }),
      );
    }

    klienti.andWhere(
      new Brackets((qb) => {
        qb.where('klient.bd_is_active is null').orWhere(
          'klient.bd_is_active = :aktivny',
          {
            aktivny: 1,
          },
        );
      }),
    );
    const result = await klienti

      .take(take)
      .skip(page * take)
      .orderBy({ priezvisko: 'ASC', meno: 'ASC', id: 'ASC' })
      .getManyAndCount();
    return result;
  }

  // ----- NAJDE VYBRANY TYP POISTENIA
  async findOne(id: number) {
    const zaznam = await this.repo.findOneBy({ id });
    if (!zaznam) {
      throw new NotFoundException('Záznam nebol nájdený');
    }
    return zaznam;
  }

  // ----- UPRAVI VYBRANY TYP POISTENIA
  async update(id: number, attrs: Partial<Klient>, user: User) {
    const klient = await this.findOne(+id);
    if (!klient) {
      throw new NotFoundException('Zadaný klient nebol nájdený');
    }
    Object.assign(klient, attrs);
    klient.bd_action_user = user.id;
    klient.bd_created = new Date();
    return this.repo.save(klient);
  }

  // ----- VYMAZE VYBRANY TYP POISTENIA
  async remove(id: number, user: User) {
    const klient = await this.findOne(+id);

    if (!klient) {
      throw new NotFoundException('Zadaný klient nebol nájdený');
    }
    klient.bd_action_user = user.id;
    klient.bd_created = new Date();
    klient.bd_is_active = 0;
    return this.repo.save(klient);
  }
}
