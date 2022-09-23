import { Trigger } from './../entity/entity-enum';
import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { Category } from "../entity/category";

export class CreateCategory1624692218414 implements MigrationInterface {

    public async up(_queryRunner: QueryRunner): Promise<void> {
        let category = new Category();
        category.create_date = Math.floor(Date.now() / 1000);
        category.update_date = Math.floor(Date.now() / 1000);
        category.name = "초등부";
        category.parent_id = 0;
        category.has_child = Trigger.ON;
        const categoryRepository = getRepository(Category);
        await categoryRepository.save(category);
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
    }

}
