import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserProfileDto } from './dto/edit-user-profile.dto';
import { User } from 'src/entities/user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(createUserDto: CreateUserDto, currentUser: User) {
    // See if email is in use
    const users = await this.usersService.isUser(createUserDto.login);
    if (users.length) {
      throw new BadRequestException('Login already in use');
    }

    //Hash the users password
    // generate a salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and the password together
    const hash = (await scrypt(createUserDto.heslo, salt, 32)) as Buffer;
    // join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    createUserDto.heslo = result;

    //Create a new user and save it
    const user = await this.usersService.create(createUserDto, currentUser);

    //return the user
    return user;
  }

  async signin(login: string, heslo: string) {
    const [user] = await this.usersService.isUser(login);
    if (!user) {
      throw new NotFoundException('Používateľ sa nenašiel');
    }

    const [salt, storedHash] = user.heslo.split('.');
    const hash = ((await scrypt(heslo, salt, 32)) as Buffer) || String;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Zadané heslo nie je správne');
    }
    return user;
  }

  async hashPassword(editUserProfileDto: EditUserProfileDto) {
    //Hash the users password
    // generate a salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and the password together
    const hash = (await scrypt(
      editUserProfileDto.nove_heslo,
      salt,
      32,
    )) as Buffer;
    // join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    editUserProfileDto.heslo = result;

    //return the dto
    return editUserProfileDto;
  }
}
