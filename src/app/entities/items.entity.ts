import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    category_id:number;

    @Column()
    currency_id: string;

    @Column()
    description: string;

    @Column()
    title: string;

    @Column()
    quantity: number;

    @Column()
    unit_price: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}