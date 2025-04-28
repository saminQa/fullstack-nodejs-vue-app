import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';

export class CreateKlientiDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  titul: string | null;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  meno: string | null;

  @IsString()
  // @IsNotEmpty({ message: 'Pole "priezvisko" pole je povinné' })
  @IsOptional()
  priezvisko: string;

  @IsOptional()
  @IsString()
  ulica: string;

  @IsOptional()
  @IsString()
  supisne_cislo: string;

  @IsOptional()
  @IsString()
  psc: string;

  @IsOptional()
  @IsString()
  mesto: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  telefon: string | null;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  mobil: string | null;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  email: string | null;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  typ_id: number | null;

  @IsOptional()
  @IsString()
  skupina: string;

  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  rc_ico: string;

  @IsOptional()
  @IsString()
  poznamka: string;
}
