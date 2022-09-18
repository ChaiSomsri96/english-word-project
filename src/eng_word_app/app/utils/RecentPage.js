import { exp } from 'react-native-reanimated';
import { getData, storeData, removeData } from './storageHelper';

export const setRecentPage = async(pageName, pageData) => {
    try {
        await storeData('recent_page_name', pageName);
        await storeData('recent_page_data', pageData);
        await storeData('recent_page_dynamic_data', null);
        return true;
    }
    catch(e) {
        return false;
    }
}

export const setRecentPageDynamicData = async(data = null) => {
    try {
        await storeData('recent_page_dynamic_data', data);
    }
    catch(e) {
        return false;
    }
}

export const getRecentpage = async() => {
    try {
        let recent_page_name = await getData('recent_page_name');
        let recent_page_data = await getData('recent_page_data');
        let recent_page_dynamic_data = await getData('recent_page_dynamic_data');
        if(!recent_page_data || !recent_page_name) 
            return null;

        if(!recent_page_dynamic_data) {
            return {
                recent_page_name: recent_page_name,
                recent_page_data: recent_page_data
            }
        }
        else {
            return {
                recent_page_name: recent_page_name,
                recent_page_data: {
                    ...recent_page_data,
                    ...recent_page_dynamic_data
                }
            }
        }
    }
    catch(e) {
        return null;
    }
}