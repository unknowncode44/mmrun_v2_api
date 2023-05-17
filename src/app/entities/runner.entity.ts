import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Runner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  partnerID: number;

  @Column({ nullable: true })
  catValue: string;

  @Column({ nullable: true })
  runnerAge: string;

  @Column({ nullable: true })
  runnerBirthDate: string;

  @Column({ nullable: true })
  runnerGenre: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  status_detail: string;

  @Column({ nullable: true })
  tshirtSize: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}