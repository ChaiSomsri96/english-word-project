import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { isEmpty } from 'class-validator';
import { Category } from './../entity/category';
import { Video } from './../entity/video';

class CategoryController {
    static getCategoryList = async(req: Request, res: Response) => {
        const { parent_id } = req.body;
        if(isEmpty(parent_id))  {
            return res.json({ errorCode: 400, errorMsg: 'invalid_param' }); 
        }
        try {
            let compare_id;
            if(parent_id == 0)
                compare_id = null;
            else
                compare_id = parent_id;
            let query = getRepository(Category)
                        .createQueryBuilder("category");
            if(parent_id == 0) {
                query = query.where('"category"."parent_id" is NULL')
                .andWhere('"category"."is_delete" = \'N\'')
                .orderBy('"category"."id"', "ASC");
            }
            else {
                query = query.where('"category"."parent_id" = :id', { id: compare_id })
                .andWhere('"category"."is_delete" = \'N\'')
                .orderBy('"category"."id"', "ASC");
            }
            
            let result = await query.getMany();
            let ret_data: Array<any>;
            ret_data = [];
            result.forEach(function(item) {
                let ret_item: { [k: string]: any } = {};
                ret_item = {
                    id: item.id,
                    name: item.name,
                    parent_id: item.parent_id,
                    has_child: item.has_child
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

    static getVideoList = async(req: Request, res: Response) => {
        const { category_id } = req.body;
        if(isEmpty(category_id))  {
            return res.json({ errorCode: 400, errorMsg: 'invalid_param' }); 
        }
        try {
            let query = getRepository(Video)
                        .createQueryBuilder("video")
                        .where('"video"."categoryId" = :id', {id: category_id});
            let result = await query.getMany();
            let ret_data: Array<any>;
            ret_data = [];
            result.forEach(function(item) {
                let ret_item: { [k: string]: any } = {};
                ret_item = {
                    id: item.id,
                    name: item.name,
                    video_link: item.video_link,
                    video_id: item.video_id
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
export default CategoryController;