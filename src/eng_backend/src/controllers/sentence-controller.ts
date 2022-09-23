import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { isEmpty } from 'class-validator';
import { Sentence } from './../entity/sentence';
// import { SentenceView } from './../entity/sentence-view';
class SentenceController {
    static getSentenceList = async(req: Request, res: Response) => {
        const { category_id } = req.body;
        if(isEmpty(category_id)) {
            return res.json({ errorCode: 400, errorMsg: 'invalid_param' });     
        }
        try {
            let query = getRepository(Sentence)
                        .createQueryBuilder("sentence")
                        .where('"sentence"."categoryId" = :id', {id: category_id})
                        .orderBy('"sentence"."id"', "ASC")
            let result = await query.getMany();
            let ret_data: Array<any>;
            ret_data = [];

            result.forEach(function(item) {
                let ret_item: { [k: string]: any } = {};
                ret_item = {
                    id: item.id,
                    sentence: item.sentence,
                    meaning: item.meaning,
                    parts: item.detail
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
    
    static getSentenceViewList = async(req: Request, res: Response) => {
        const { category_id } = req.body;
        if(isEmpty(category_id)) {
            return res.json({ errorCode: 400, errorMsg: 'invalid_param' });     
        }
        try {
            /* let query = getRepository(SentenceView)
            .createQueryBuilder("sentence_view")
            .where('"sentence_view"."categoryId" = :id', {id: category_id})
            .orderBy('"sentence_view"."id"', "ASC")    */
            //let result = await query.getMany();
            let result = [
                { 
                id: 3,
                sentence: "3. He watches magic performance shows almost every day and keeps practicing magic tricks until he can perform them perfectly.",
                meaning: "그는 거의 매일 마술 쇼를 시청하고, 완벽하게 그 마술을 공연할 수 있을 때까지 계속 연습한다.",
                detail: '3. He watches magic <"행하다">perform<"">ance shows almost every day and keeps practicing magic <"마술">trick<"">s <"~까지">until<""> he can <"행하다">perform<""> them perfectly.',
                detail_word: '[{"en": "perform", "ko": "\ud589\ud558\ub2e4"}, {"en": "trick", "ko": "\ub9c8\uc220"}, {"en": "until", "ko": "~\uae4c\uc9c0"}, {"en": "perform", "ko": "\ud589\ud558\ub2e4"}]' }
            ];

            let ret_data: Array<any>;
            ret_data = [];
            result.forEach(function(item) {
                let word_parts: Array<any> = [];
                let sentence_pieces = JSON.parse(item.detail_word);

                /*  sentence_pieces
                {en: 'perform', ko: '행하다'},
                {en: 'trick', ko: '마술'},
                {en: 'until', ko: '~까지'},
                {en: 'perform', ko: '행하다'},
                */
                let loop_index = 0;

                for(let i = 0; i < sentence_pieces.length;) {
                    let _index = item.sentence.indexOf(sentence_pieces[i]['en'], loop_index);
                    if(_index >= 0) {
                        sentence_pieces[i]['index_start'] = _index;
                        loop_index = sentence_pieces[i]['en'].length + _index;
                        i ++;
                    }
                    else  {
                        sentence_pieces.splice(i, 1);
                    }
                }

                let _start = 0, _end = 0;
                for(let i = 0; i < sentence_pieces.length; i ++) {
                    if(sentence_pieces[i]['index_start'] == 0) {
                        continue;
                    }

                    if(i == 0) { _start = 0; }
                    else { 
                        _start = sentence_pieces[i - 1]['index_start'] + sentence_pieces[i - 1]['en'].length; 
                        while(item.sentence.charAt(_start) != ' ' && _start != item.sentence.length) {
                            _start ++;
                        }
                    }

                    _end = sentence_pieces[i]['index_start'];

                    let _part = item.sentence.substring(_start,  _end);
                    let _parts = _part.split(' ');

                    for(let k = 0; k < _parts.length; k ++) {
                        if(_parts[k] != '') {
                            word_parts.push({ 'en': _parts[k], 'ko': '' });
                        }
                    }

                    //extract meaning word
                    let index_end = sentence_pieces[i]['index_start'] + sentence_pieces[i]['en'].length;
                    while(item.sentence.charAt(index_end) != ' ' && index_end != item.sentence.length) {
                        index_end ++;
                    }
                    word_parts.push({ 
                        // 'en': item.sentence.substring(sentence_pieces[i]['index_start'], index_end), 
                        'en': item.sentence.substring(sentence_pieces[i]['index_start'], sentence_pieces[i]['index_start'] + sentence_pieces[i]['en'].length), 
                        'ko': sentence_pieces[i]['ko'],
                        'partial': item.sentence.substring(sentence_pieces[i]['index_start'] + sentence_pieces[i]['en'].length, index_end), 
                    });
                }
                if(sentence_pieces.length > 0) {
                    let _start = sentence_pieces[sentence_pieces.length - 1]['index_start'] + sentence_pieces[sentence_pieces.length - 1]['en'].length;
                    while(item.sentence.charAt(_start) != ' ' && _start != item.sentence.length) { _start ++; }
                    let _part = item.sentence.substring(_start);
                    let _parts = _part.split(' ');

                    for(let k = 0; k < _parts.length; k ++) {
                        if(_parts[k] != '') {
                            word_parts.push({ 'en': _parts[k], 'ko': '' });
                        }
                    }
                }

                let ret_item: { [k: string]: any } = {};
                ret_item = {
                    id: item.id,
                    sentence: item.sentence,
                    meaning: item.meaning,
                    word_parts: word_parts
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

export default SentenceController;