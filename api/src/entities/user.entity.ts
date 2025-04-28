import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  heslo: string;

  @Column({ nullable: true })
  meno: string;

  @Column({ nullable: true })
  priezvisko: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  isActive: number;

  @Column({ type: 'timestamptz', nullable: true })
  bd_created: Date;

  @Column({ nullable: true })
  bd_creator: number;

  @Column({ nullable: true })
  bd_is_active: number;

  @Column({ nullable: true })
  bd_action_user: number;
}
