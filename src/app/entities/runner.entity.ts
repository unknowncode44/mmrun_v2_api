import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Runner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true})
  runnerNumber: string

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  partnerID: string;

  @Column({ nullable: false })
  catValue: string;

  @Column({ nullable: false })
  runnerAge: string;

  @Column({ nullable: false})
  dni: string;

  @Column({ nullable: false })
  runnerBirthDate: string;

  @Column({ nullable: true })
  runnerGenre: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  status_detail: string;

  @Column({ nullable: true })
  tshirtSize: string;

  // added 230618
  @Column({nullable: true})
  preference_id: string

  @Column({nullable: true})
  payment_amount: string

  // added 230628 
  @Column({nullable: true})
  payment_id: string

  @Column({nullable: true})
  merchant_order_id: string

  @Column({nullable: true, length: 600})
  paymentStatusCheckUrl: string

  @Column({nullable: true, default: false})
  mailSent: boolean

  //added 230709
  @Column({nullable: true})
  identification_number: string

  //added 230816
  @Column({nullable: true})
  discountText: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  phone: string;
}