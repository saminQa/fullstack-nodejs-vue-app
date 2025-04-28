import { PartialType } from '@nestjs/mapped-types';
import { CreateKlientiDto } from './create-klienti.dto';

export class UpdateKlientiDto extends PartialType(CreateKlientiDto) {}
