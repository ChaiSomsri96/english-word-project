import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { isEmpty } from 'class-validator';
import { Word } from './../entity/word';
class WordController {
    static getWordList = async(req: Request, res: Response) => {
        const { category_id } = req.body;
        if(isEmpty(category_id)) {
            return res.json({ errorCode: 400, errorMsg: 'invalid_param' });     
        }
        try {
            let query = getRepository(Word)
                        .createQueryBuilder("word")
                        .where('"word"."categoryId" = :id', {id: category_id})
                        .orderBy('"word"."id"', "ASC")
            let result = await query.getMany();
            let ret_data: Array<any>;
            ret_data = [];
            result.forEach(function(item) {
                let ret_item: { [k: string]: any } = {};
                ret_item = {
                    id: item.id,
                    word: item.word,
                    meaning: item.meaning,
                    ex: item.ex == null ? [] : item.ex,
                    pronunciation: item.pronunciation
                };
                ret_data.push(ret_item);
            });
            return res.json({ errorCode: 0, errorMsg: '', data: ret_data });
        }
        catch(error) {
            console.log(error);
            return res.json({ errorCode: 500, errorMsg: "internal_server_error" });
        }
    };
}

export default WordController;

/*
[
    {
        "ex_word": "Firemen believe a new electrical appliance may have started the blaze.",
        "ex_meaning": "소방관들은 새로운 전기 기구가 화재를 일으켰을 수도 있다고 믿는다."
    }
]
*/