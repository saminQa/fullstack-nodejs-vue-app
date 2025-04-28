import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { Klient } from './klient.entity';

@Entity('car')
export class Car extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  spz: string;

  @Column({ nullable: true })
  vin: string;

  @Column({ nullable: true })
  druh_vozidla: number;

  @Column({ nullable: true })
  znacka_vozidla: string;

  @Column({ nullable: true })
  model_vozidla: string;

  @Column({ type: 'date', nullable: true })
  datum_evidencie: Date;

  @Column({ nullable: true })
  vykon: string;

  @Column({ nullable: true })
  objem: string;

  @Column({ nullable: true })
  max_hmotnost: string;

  @Column({ nullable: true })
  pocet_sedadiel: number;

  @Column({ nullable: true })
  palivo: string;

  @Column({ nullable: true, length: 1000 })
  poznamka: string;

  @ManyToOne(() => Klient, (klient) => klient.car)
  klient: Klient;

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
