import { Category } from './category';
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class SentenceView {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    create_date: number;

    @Column()
    update_date: number;

    @Column({ nullable: true })
    sentence: string;

    @Column({ nullable: true })
    meaning: string;

    @Column({ nullable: true })
    detail: string;

    @Column({ nullable: true })
    detail_word: string;

    @Column({ nullable: true })
    category_code: string;
    
    @ManyToOne(_type => Category, category => category.sentenceViews)
    category: Category;
}