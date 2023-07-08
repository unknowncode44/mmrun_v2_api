import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Sponsor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false})
    sponsorName: string

    @Column({ nullable: false })
    tipo: string;

    @Column({ nullable: false })
    imgUrl: string;

    @Column({ nullable: false })
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}