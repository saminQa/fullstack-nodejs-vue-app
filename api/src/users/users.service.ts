import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(createUserDto: CreateUserDto, currentUser: User) {
    const user = this.repo.create(createUserDto);
    user.bd_created = new Date();
    user.bd_is_active = 1;
    user.bd_creator = currentUser.id;

    return this.repo.save(user);
  }

  async findAll() {
    const users = await this.repo.find({
      order: { bd_is_active: 'DESC', login: 'DESC' },
    });

    return users;
  }

  async findPartial() {
    const partialKlienti = this.repo.find({
      select: { id: true, login: true, priezvisko: true, meno: true },
      order: { login: 'ASC', id: 'ASC' },
      where: { bd_is_active: 1 },
    });
    // console.log(partialKlienti);
    return partialKlienti;
  }

  isUser(login: string) {
    return this.repo.find({
      where: { login, bd_is_active: 1 },
    });
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOne({
      where: { id },
    });
  }

  async update(id: number, attrs: Partial<UpdateUserDto>, currentUser: User) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Používateľ nebol nájdený');
    }
    if (user.id > 2) {
      Object.assign(user, attrs);
      user.bd_action_user = currentUser.id;
      user.bd_created = new Date();

      return this.repo.save(user);
    } else {
      throw new ForbiddenException({
        objectOrError: 'Na zmenu tohto používateľa nemáte oprávnenie.',
      });
    }
  }

  async updateProfile(id: number, meno: string, priezvisko: string) {
    let user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Používateľ nebol nájdený');
    }
    const updatedName = {
      id: user.id,
      meno: meno,
      priezvisko: priezvisko,
    };

    return this.repo.save(updatedName);
  }

  async remove(id: number, currentUser: User) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Používateľ nebol nájdený');
    }
    user.bd_action_user = currentUser.id;
    user.bd_created = new Date();
    user.bd_is_active = 0;
    return this.repo.save(user);
  }
}
