import { getData, storeData } from './storageHelper';

export const addToCategory = async(param) => {
    try {
        await storeData('category', param);
        return true;
    }
    catch(e) {
        return false;
    }
}

export const addAllDataToCategory = async(category_id, data) => {
    try {
        if(data['sentence_view'].length > 0) {
            await storeData('sentence_view_' + category_id, data['sentence_view']);
        }
        if(data['sentence_list'].length > 0) {
            await storeData('sentence_list_' + category_id, data['sentence_list']);
        }
        if(data['word_list'].length > 0) {
            await storeData('word_list_' + category_id, data['word_list']);
        }
        if(data['video_list'].length > 0) {
            await storeData('video_list_' + category_id, data['video_list']);
        }
        return true;
    }
    catch(e) {
        return false;
    }
}

export const getDataDetail = async(category_id, key) => {
    try {
        let _detail = await getData(key + '_' + category_id);
        if(!_detail)
            return [];
        return _detail;
    }
    catch(e) {
        return [];
    }
}

export const getCategory = async(parent_id) => {
    try {
        let category_data = await getData('category');
        if( !category_data )
            return [];
        let _category_list = [];
        for(let i = 0; i < category_data.length; i ++) {
            if( (parent_id == 0 && category_data[i]['parent_id'] == null) ||
                (parent_id != 0 && category_data[i]['parent_id'] == parent_id)) {
                    _category_list.push(category_data[i]);
            }
        }
        return _category_list;
    }
    catch(e) {
        return [];
    }
}