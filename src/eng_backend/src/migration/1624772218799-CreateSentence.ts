import {MigrationInterface, QueryRunner} from "typeorm";
import { Sentence } from './../entity/sentence';
import { Category } from "../entity/category";
import { getRepository } from "typeorm";

export class CreateSentence1624772218799 implements MigrationInterface {

    public async up(_queryRunner: QueryRunner): Promise<void> {
        const categoryRepository = getRepository(Category);
        let category = await categoryRepository.findOne(15);
        if(category != undefined)
        {
            let sentence = new Sentence();
            sentence.id = 7;
            sentence.create_date = Math.floor(Date.now() / 1000);
            sentence.update_date = Math.floor(Date.now() / 1000);
            sentence.sentence = "They can stay in the sample place in the air for a long time.";
            sentence.meaning = "그들은 오랫동안 한곳에 머물며 날수 있다.";
            sentence.category = category;
            // sentence.parts = ['can', 'stay', 'sample', 'place', 'air', 'they', 'long time'];
            const sentenceRepository = getRepository(Sentence);
            await sentenceRepository.save(sentence);
        }
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
    }

}
