import { Category } from './category';
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Word {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    create_date: number;
    
    @Column()
    update_date: number;

    @Column({ nullable: true })
    word: string;

    @Column({ nullable: true })
    meaning: string;

    @Column({ type: "jsonb" , nullable: true})
    ex: { [k: string]: any };

    @Column({ nullable: true })
    pronunciation: string;

    @Column({ nullable: true })
    category_code: string;

    @ManyToOne(_type => Category, category => category.words)
    category: Category; 
}