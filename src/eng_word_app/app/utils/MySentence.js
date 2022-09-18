import { getData, storeData, removeData } from './storageHelper';

export const addToMySentence = async(param) => {
    try {
        let mysentence_id_list = await getData('mysentence_list');
        if(mysentence_id_list == null)
            mysentence_id_list = [];
        if(mysentence_id_list.indexOf(param.id) >= 0)
            return true;
        mysentence_id_list.push(param.id);
        await storeData('mysentence_list', mysentence_id_list);
        await storeData('mysentence_' + param.id, param);
        return true;    
    }
    catch(e) {
        return false;       
    }
}

export const removeFromMySentence = async(param) => {
    try {
        let mysentence_id_list = await getData('mysentence_list');
        if(mysentence_id_list == null)
            mysentence_id_list = [];
        let _i = mysentence_id_list.indexOf(param.id);
        if(_i < 0)
            return true;
        mysentence_id_list.splice(_i, 1);
        await removeData('mysentence_' + param.id);
        await storeData('mysentence_list', mysentence_id_list);
        return true;
    }
    catch(e) {
        return false;
    }
}

export const removeIdListFromMySentence = async(_array) => {
    try {
        if(_array.length == 0)
            return true;
        let mysentence_id_list = await getData('mysentence_list');
        if(mysentence_id_list == null)
            mysentence_id_list = [];
        for(let i = 0; i < _array.length; i ++) {
            let _index = mysentence_id_list.indexOf(_array[i]);
            if(_index >= 0) {
                mysentence_id_list.splice(_index, 1);
                await removeData('mysentence_' + _array[i]);
            }
        }
        await storeData('mysentence_list',  mysentence_id_list);
        return true;
    }
    catch(e) {
        return false;
    }
}

export const getSentenceListFromMySentence = async() => {
    try {
        let mysentence_id_list = await getData('mysentence_list');
        if(mysentence_id_list == null)
            mysentence_id_list = [];
        let mysentence_list = [];
        for(let i = 0; i < mysentence_id_list.length;)  {
            let _sentence_detail = await getData('mysentence_' + mysentence_id_list[i]);

            if(_sentence_detail == null) {
                mysentence_id_list.splice(i, 1);
            }
            else {
                mysentence_list.push(_sentence_detail);
                i ++;
            }
        }
        await storeData('mysentence_list', mysentence_id_list);
        return mysentence_list;
    }
    catch(e) {
        return [];
    }
}

export const getSentenceIdListFromMySentence = async() => {
    try {
        let mysentence_id_list = await getData('mysentence_list');
        if(mysentence_id_list == null)
            mysentence_id_list = [];
        return mysentence_id_list;
    }
    catch(e) {
        return [];
    }
}