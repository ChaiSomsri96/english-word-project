import {Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Trigger } from './entity-enum';
import { Video } from './video';
import { Word } from './word';
import { Sentence } from './sentence';
import { SentenceView } from './sentence-view';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    create_date: number;
    
    @Column()
    update_date: number;

    @Column()
    name: string; // 카테고리 명

    @Column({ nullable: true })
    parent_id: number;

    @Column({
        type: "enum",
        enum: Trigger,
        default: Trigger.OFF
    })
    has_child: Trigger;   

    @Column({
        type: "enum",
        enum: Trigger,
        default: Trigger.OFF
    })
    is_delete: Trigger;

    @Column({ nullable: true })
    code: string;

    @OneToMany(_type => Video, video => video.category, {
        eager: true
    })
    videos: Video[];

    @OneToMany(_type => Word, word => word.category)
    words: Word[];

    @OneToMany(_type => Sentence, sentence => sentence.category)
    sentences: Sentence[];

    @OneToMany(_type => SentenceView, sentenceView => sentenceView.category)
    sentenceViews: SentenceView[];
}