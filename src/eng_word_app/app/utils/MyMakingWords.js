import { getData, storeData, removeData } from './storageHelper';
/*
- vocabulary_count: 0
- vocabulary_list: [
    {id: 1, name: ''},
    {id: 2, name: ''}
]
- vocabulary_data_id
[
    {
        no:1, word:'', meaning: '', order: 1 //2
    }
]
*/
export const getVocabularyList = async() => {
    try {
        let v_id_list = await getData('vocabulary_list');
        if(v_id_list == null)
            v_id_list = [];
        return v_id_list;
    }
    catch(e) {
        return [];
    }
}

export const saveVocabulary = async(prev_data, data) => {
    try {
        await storeData('vocabulary_list', data);
        for(let i = 0; i < prev_data.length; i ++) {
            let flag = false;
            for(let j = 0; j < data.length; j ++) {
                if(prev_data[i]['id'] == data[j]['id']) {
                    flag = true;
                    break;
                }
            }
            if(!flag) {
                await removeData('vocabulary_data_' + prev_data[i]['id']);
            }
        }
        return true;
    }
    catch(e) {
        return false;
    }
}

export const getVocabularyData = async(id) => {
    try {
        let v_data = await getData('vocabulary_data_' + id);
        if(v_data == null)
            return [];
        return v_data;
    }
    catch(e) {
        return [];
    }
}

async function getWordDictName(id, name) {
    try {
        let v_id_list = await getData('vocabulary_list');
        let copy = 0, isDuplicate = false;
        let _name = name;
        while(1) {
            isDuplicate = false;
            for(let i = 0; i < v_id_list.length; i ++) {
                if(id != 0 && id == v_id_list[i]['id'])
                    continue;

                if(v_id_list[i]['name'] == _name) {
                    isDuplicate = true;
                    break;
                }
            }

            if(!isDuplicate)
                return _name;

            copy ++;
            _name = name + '(' + copy + ')';
        }
    }
    catch(e) {
        return name;
    }
}

export const saveVocabularyData = async(id, _name, data) => {
    try {
        let vocabulary_count = await getData('vocabulary_count');
        let v_id_list = await getData('vocabulary_list');
        v_id_list = v_id_list == null ? [] : v_id_list;

        _name = await getWordDictName(id, _name);

        if(id == 0) // 새로 추가  
        {
            id = vocabulary_count+ 1;
            v_id_list.push({id: (vocabulary_count+ 1) , name: _name});
            await storeData('vocabulary_list', v_id_list);
            await storeData('vocabulary_count', vocabulary_count + 1);
        }
        else if(_name != ''){
            for(let i = 0; i < v_id_list.length; i ++) {
                if(v_id_list[i]['id'] == id) {
                    v_id_list[i]['name'] = _name;
                    break;
                }
            }
            await storeData('vocabulary_list', v_id_list);
        }
        await storeData('vocabulary_data_' + id, data);
        return true;
    }
    catch(e) {
        return false;
    }
}

export const getVocabularyCount = async() => {
    try {
        let vocabulary_count = await getData('vocabulary_count');
        return vocabulary_count;
    }
    catch(e) {
        return 0;
    }
}