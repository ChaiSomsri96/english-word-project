import { Category } from './category';
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    create_date: number;

    @Column()
    update_date: number;
    
    @Column()
    name: string; // 비디오 명

    @Column({ nullable: true })
    video_link: string;

    @Column({ nullable: true })
    video_id: string;
    
    @ManyToOne(_type => Category, category => category.videos)
    category: Category; 

    @Column({ nullable: true })
    category_code: string;
}