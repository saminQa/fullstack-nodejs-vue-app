// User will return as described  - only exposed columns, no password
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  login: string;

  @Expose()
  meno: string;

  @Expose()
  priezvisko: string;

  @Expose()
  email: string;

  @Expose()
  bd_is_active: number;
}
