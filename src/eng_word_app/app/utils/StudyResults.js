import { getData, storeData, removeData } from './storageHelper';

export const addToStudyResults = async(param) => {
    try {
        let history = await getData("history_data");
        if(history == null)
            history = [];
        
        history = [param].concat(history);

        await storeData("history_data", history);
    }
    catch(e) {
        console.log("getData===>", e);
        return false;
    }
}

export const getStudyResults = async() => {
    try {
        let history = await getData("history_data");
        if(history == null)
            history = [];
        return history;
    }
    catch(e) {
        return [];
    }
}

export const removeFromStudyResults = async(index) => {
    try {
        let history = await getData("history_data");
        if(history == null)
            history = [];
        if(history.length < index)
            return true;
        history.splice(index - 1, 1);
        await storeData("history_data", history);
    }
    catch(e) {
        console.log("error remove => ", e);
        return false;
    }
}