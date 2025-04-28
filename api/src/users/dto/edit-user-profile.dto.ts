import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditUserProfileDto {
  @IsOptional()
  @IsString()
  meno: string;

  @IsOptional()
  @IsString()
  priezvisko: string;

  @IsOptional()
  @IsString()
  heslo: string;

  @IsOptional()
  @IsString()
  nove_heslo: string;

  @IsOptional()
  // @IsDateString()
  bd_created: Date;

  @IsOptional()
  @IsNumber()
  bd_action_user: number;
}
