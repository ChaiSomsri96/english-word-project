import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage get 함수 모듈
export const getData = async(storageName) => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageName)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        // error reading value
        console.log("Async GetData Error:", e);
    }
}

// AsyncStorage set 함수 모듈
export const storeData = async(storageName, item) => {
    try {
        await AsyncStorage.setItem(storageName, JSON.stringify(item));
        return true;
    }
    catch(e) {
        console.log("Async Storage Error:", e);
        return false;
    }
};

// remove 
export const removeData = async(storageName) => {
    try {
        await AsyncStorage.removeItem(storageName);
        return true;
    }
    catch(exception) {
        console.log("Async RemoveData Error:", exception);
        return false;
    }
}