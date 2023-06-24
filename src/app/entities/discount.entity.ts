import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false})
  discountName: string

  @Column({ nullable: false })
  tipo: string;

  @Column({ nullable: false })
  percentage: number;

  @Column({ nullable: false })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}