import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Car } from './car.entity';

@Entity('klient')
//@Unique('unique_klient', ['priezvisko', 'rc_ico'])
export class Klient extends BaseEntity {
  //  pri migracii treba zmenit sekvenciu id na aktualnu - priamo v databaze, inak bude duplicate key
  //    select last_value from klient_id_seq; ---- zisti poslednu value zo sekvenceru
  //    ALTER SEQUENCE klient_id_seq RESTART WITH 60100; --- zmenit value zo sekvenceru
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  titul: string;

  @Column({ nullable: true })
  meno: string;

  @Column({ nullable: true })
  priezvisko: string;

  @Column({ nullable: true })
  ulica: string;

  @Column({ nullable: true })
  supisne_cislo: string;

  @Column({ nullable: true })
  psc: string;

  @Column({ nullable: true })
  mesto: string;

  @Column({ nullable: true })
  telefon: string;

  @Column({ nullable: true })
  mobil: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  rc_ico: string;

  @Column({ nullable: true, length: 1000 })
  poznamka: string;

  @OneToMany(() => Car, (car) => car.klient)
  car: Car;

  // BUSINESS DATA //

  @Column({ type: 'timestamptz', nullable: true })
  bd_created: Date;

  @Column({ nullable: true })
  bd_creator: number;

  @Column({ nullable: true })
  bd_action_user: number;

  @Column({ nullable: true })
  bd_is_active: number;
}
