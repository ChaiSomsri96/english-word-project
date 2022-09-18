import { exp } from 'react-native-reanimated';
import { getData, storeData, removeData } from './storageHelper';

export const addToMySentenceView = async(param) => {
    try {
        let mysentence_id_list = await getData('mysentence_view_list');
        if(mysentence_id_list == null)
            mysentence_id_list = [];
        if(mysentence_id_list.indexOf(param.id) >= 0)
            return true;
        mysentence_id_list.push(param.id);
        await storeData('mysentence_view_list', mysentence_id_list);
        await storeData('mysentence_view_' + param.id, param);
        return true;    
    }
    catch(e) {
        return false;       
    }
}

export const addListToMySentenceView = async(list) => {
    try {
        let mysentence_id_list = await getData('mysentence_view_list');
        if(mysentence_id_list == null)
            mysentence_id_list = [];
        
        for(let i = 0; i < list.length; i ++) {
            if(mysentence_id_list.indexOf(list[i]) >= 0) {
                continue;
            }
            else {
                mysentence_id_list.push(list[i]['id']);
                await storeData('mysentence_view_' + list[i]['id'], list[i]);
            }
        }
        await storeData('mysentence_view_list', mysentence_id_list);
        return true;   
    }
    catch(e) {
        return false;
    }
}

export const removeListFromMySentenceView = async(list) => {
    try {
        let mysentence_id_list = await getData('mysentence_view_list');
        if(mysentence_id_list == null)
            mysentence_id_list = [];

        for(let i = 0; i < list.length; i ++) {
            let _i = mysentence_id_list.indexOf(list[i]['id']);
            if(_i < 0)
                continue;
            mysentence_id_list.splice(_i, 1);        
            await removeData('mysentence_view_' + list[i]['id']);    
        }        
        await storeData('mysentence_view_list', mysentence_id_list);
        return true;
    }
    catch(e) {
        return false;
    }
}

export const removeFromMySentenceView = async(param) => {
    try {
        let mysentence_id_list = await getData('mysentence_view_list');
        if(mysentence_id_list == null)
            mysentence_id_list = [];
        let _i = mysentence_id_list.indexOf(param.id);
        if(_i < 0)
            return true;
        mysentence_id_list.splice(_i, 1);
        await removeData('mysentence_view_' + param.id);
        await storeData('mysentence_view_list', mysentence_id_list);
        return true;
    }
    catch(e) {
        return false;
    }
}

export const getSentenceListFromMySentenceView = async() => {
    try {
        let mysentence_id_list = await getData('mysentence_view_list');
        if(mysentence_id_list == null)
            mysentence_id_list = [];
        let mysentence_list = [];
        for(let i = 0; i < mysentence_id_list.length;)  {
            let _sentence_detail = await getData('mysentence_view_' + mysentence_id_list[i]);

            if(_sentence_detail == null) {
                mysentence_id_list.splice(i, 1);
            }
            else {
                mysentence_list.push(_sentence_detail);
                i ++;
            }
        }
        await storeData('mysentence_view_list', mysentence_id_list);
        return mysentence_list;
    }
    catch(e) {
        return [];
    }
}

export const getSentenceIdListFromMySentenceView = async() => {
    try {
        let mysentence_id_list = await getData('mysentence_view_list');
        if(mysentence_id_list == null)
            mysentence_id_list = [];
        return mysentence_id_list;
    }
    catch(e) {
        return [];
    }
}