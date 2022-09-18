import { getData, storeData } from './storageHelper';

export const addToRecentStudy = async(param) => {
    try {
        await storeData('recent_study', param);
        return true;
    }
    catch(e) {
        return false;
    }
}

export const getRecentStudy = async() => {
    try {
        let recent_study = await getData('recent_study');
        return recent_study;
    }
    catch(e) {
        return [];
    }
}