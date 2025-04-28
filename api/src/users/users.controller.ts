import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Session,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

import { User } from 'src/entities/user.entity';
import { EditUserProfileDto } from './dto/edit-user-profile.dto';

@Controller('auth')
@Serialize(UserDto) // User will return as described on UserDto - without password
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  // @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() body: CreateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    const user = await this.authService.signup(body, currentUser);

    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.login, body.heslo);

    session.userId = user.id;

    return user;
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/partial')
  @UseGuards(AuthGuard)
  findPartial() {
    return this.usersService.findPartial();
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException('Používateľ sa nenašiel');
    }
    return user;
  }

  // users can edit their own profile
  @Patch('/editProfile')
  @UseGuards(AuthGuard)
  async editProfile(
    @CurrentUser() user: User,
    @Body() editUserProfileDto: EditUserProfileDto,
  ) {
    if (editUserProfileDto.heslo === undefined) {
      throw new BadRequestException('Neznáme heslo');
    } else {
      const isReal = await this.authService.signin(
        user.login,
        editUserProfileDto.heslo,
      );
      if (user.id === isReal.id) {
        if (editUserProfileDto.nove_heslo) {
          await this.authService.hashPassword(editUserProfileDto);
          this.usersService.update(user.id, editUserProfileDto, user);
        } else {
          this.usersService.updateProfile(
            user.id,
            editUserProfileDto.meno,
            editUserProfileDto.priezvisko,
          );
        }
      }
    }
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.update(+id, updateUserDto, currentUser);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  removeUser(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.usersService.remove(+id, currentUser);
  }
}
