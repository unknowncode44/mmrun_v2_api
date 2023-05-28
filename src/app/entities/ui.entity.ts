import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UiElement {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false})
    name: string

    @Column({nullable: true})
    item: string

    @Column({nullable: false})
    active: boolean

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}