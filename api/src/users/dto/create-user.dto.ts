import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';

import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  heslo: string;

  @IsOptional()
  @IsString()
  meno: string;

  @IsOptional()
  @IsString()
  priezvisko: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1)
  isActive: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1)
  bd_is_active: number;
}
