import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateCarDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  spz: string;

  @IsOptional()
  @IsString()
  vin: string;

  @IsOptional()
  @IsNumber()
  druh_vozidla: number;

  @IsOptional()
  @IsString()
  znacka_vozidla: string;

  @IsOptional()
  @IsString()
  model_vozidla: string;

  @IsOptional()
  datum_evidencie: Date;

  @IsOptional()
  @IsString()
  vykon: string;

  @IsOptional()
  @IsString()
  objem: string;

  @IsOptional()
  @IsString()
  max_hmotnost: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pocet_sedadiel: number;

  @IsOptional()
  @IsString()
  palivo: string;

  @IsOptional()
  @IsString()
  poznamka: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bd_is_active: number | null;
}
