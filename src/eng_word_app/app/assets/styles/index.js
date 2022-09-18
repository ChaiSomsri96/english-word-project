import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions, Platform, PixelRatio, StatusBar} from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";
import { getBrand } from 'react-native-device-info';


/*
const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window');
const scale =  SCREEN_WIDTH / 360;
let size_scale = scale;
if (scale >= 2) {
    size_scale = scale * 0.566;
}

export function normalize(size) {
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(size_scale * size)) + 2;
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(size))
    }
} */

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window');

let phoneBrand = getBrand();

const scale =  SCREEN_WIDTH / 320;

let size_scale = scale;
if (scale >= 2) {
    size_scale = scale * 0.566;
}

export function getScreenWidth() {
    return SCREEN_WIDTH;
}

export function getScreenHeight() {
    return SCREEN_HEIGHT;
}

export function normalize(size) {
    const newSize = size * size_scale;
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
}

export function normalize1(size) {
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(size_scale * size)) + 2;
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(size))
    }
}

const tabHeight = 95, buttonSpacing = 32, userHeaderHeight = 50;
let safeAreaViewHeight = 0;

if(Platform.OS == 'ios') {
    const statusBarHeight = getStatusBarHeight(true);
    if (isIphoneX()) {
        safeAreaViewHeight = SCREEN_HEIGHT - statusBarHeight - getBottomSpace() - tabHeight;
    } else {
        safeAreaViewHeight = SCREEN_HEIGHT - statusBarHeight - tabHeight;
    }
}
else {
    if(phoneBrand == 'HUAWEI') {
        safeAreaViewHeight = SCREEN_HEIGHT - tabHeight;
    }
    else {
        safeAreaViewHeight = SCREEN_HEIGHT - tabHeight - StatusBar.currentHeight;
    }
}

export function getSafeAreaViewHeight () {
    return safeAreaViewHeight + tabHeight - userHeaderHeight;
}

export function getSafeAreaViewWidth () {
    let safeAreaViewWidth = SCREEN_WIDTH;
    if(Platform.OS == 'ios') {
        const statusBarHeight = getStatusBarHeight(true);
        if (isIphoneX()) {
            safeAreaViewWidth = SCREEN_WIDTH - statusBarHeight;
        } else {
            safeAreaViewWidth = SCREEN_WIDTH - statusBarHeight;
        }
    }
    else {
        if(phoneBrand == 'HUAWEI') {
            safeAreaViewWidth = SCREEN_WIDTH - StatusBar.currentHeight;
        }
        else {
            safeAreaViewWidth = SCREEN_WIDTH - StatusBar.currentHeight;
        }
    }   
    return safeAreaViewWidth;
}

export function getCreateWordPageHeight() {
    return safeAreaViewHeight + tabHeight;
}

export function calcButtonListMarginTop(buttonCnt, buttonHeight) {
    if(safeAreaViewHeight - (buttonCnt - 1) * (buttonSpacing + buttonHeight) - buttonHeight < 0)
        return normalize(32);
    else {
        return (safeAreaViewHeight - (buttonCnt - 1) * (buttonSpacing + buttonHeight) - buttonHeight) / 2;
    }
}

export const fonts = EStyleSheet.create({
    // familyRegular: { fontFamily: 'NotoSansCJKkr-Regular' },
    familyMedium: { fontFamily: 'NotoSansCJKkr-Medium' },
    // familyBold: { fontFamily: 'NotoSansCJKkr-Bold' },

    familyBold: { fontFamily: 'Malgun-Gothic-Bold' },
    familyRegular: { fontFamily: 'Malgun-Gothic-Regular' },

    /*size10 : { fontSize: normalize(10), lineHeight: normalize(13) },
    size11 : { fontSize: normalize(11), lineHeight: normalize(15) },
    size12 : { fontSize: normalize(12), lineHeight: normalize(16) },
    size14 : { fontSize: normalize(14), lineHeight: normalize(18) },
    size15 : { fontSize: normalize(15), lineHeight: normalize(19) },
    size16 : { fontSize: normalize(16), lineHeight: normalize(20) },
    size18 : { fontSize: normalize(18), lineHeight: normalize(24) },
    size20 : { fontSize: normalize(20), lineHeight: normalize(26) },
    size22 : { fontSize: normalize(22), lineHeight: normalize(30) },
    size24 : { fontSize: normalize(24), lineHeight: normalize(32) },
    size32 : { fontSize: normalize(32), lineHeight: normalize(42) },
    size38 : { fontSize: normalize(38), lineHeight: normalize(52) },
    size40 : { fontSize: normalize(40), lineHeight: normalize(54) },*/

    size10 : { fontSize: normalize(10), lineHeight: normalize(11) },
    size11 : { fontSize: normalize(11), lineHeight: normalize(12) },
    size12 : { fontSize: normalize(12), lineHeight: normalize(13) },
    size13 : { fontSize: normalize(13), lineHeight: normalize(14) },
    size14 : { fontSize: normalize(14), lineHeight: normalize(15) },
    size15 : { fontSize: normalize(15), lineHeight: normalize(16) },
    size16 : { fontSize: normalize(16), lineHeight: normalize(17) },
    size18 : { fontSize: normalize(18), lineHeight: normalize(19) },
    size19 : { fontSize: normalize(19), lineHeight: normalize(20) },
    size20 : { fontSize: normalize(20), lineHeight: normalize(21) },
    size22 : { fontSize: normalize(22), lineHeight: normalize(23) },
    size24 : { fontSize: normalize(24), lineHeight: normalize(25) },
    size30 : { fontSize: normalize(30), lineHeight: normalize(31) },
    size32 : { fontSize: normalize(32), lineHeight: normalize(33) },
    size38 : { fontSize: normalize(38), lineHeight: normalize(39) },
    size40 : { fontSize: normalize(40), lineHeight: normalize(41) },

    weightNormal: { fontWeight: 'normal' },
    weightBold: { fontWeight: 'bold' },

    colorRed: { color: '#EB5757' },
    colorBlack: { color: 'black' },
    colorWhite: { color: 'white'},
    colorBlue: { color: '#006DFF'},
    colorRedOpacity: { color: '#F5ABAB'},
    colorBlueOpacity: { color: '#80B6FF' },
    colorLightGray: { color: '#E6E6E6' },
    colorDeepGray: { color: '#737373' }
});

export const tabs = EStyleSheet.create({
    tab: {
        backgroundColor: '#E4E4E4',
        borderTopLeftRadius: normalize(16),
        borderTopRightRadius: normalize(16),
        height: normalize(32),
        marginRight: normalize(8)
    },
    tabItem: {
        backgroundColor: 'white',
        borderTopLeftRadius: normalize(16),
        borderTopRightRadius: normalize(16),
        height: normalize(32),
        marginRight: normalize(8)
    },
    text: {
        fontSize: normalize(16), lineHeight: normalize(20),
        color: 'black', fontFamily: 'Malgun-Gothic-Bold'
    },
    activeText: {
        fontSize: normalize(16), lineHeight: normalize(20),
        color: 'black', fontFamily: 'Malgun-Gothic-Bold'
    },
    tabBarUnderline: {
        height: 0,
        borderBottomWidth: 0
    },
    scrollTabContainerStyle: {
        justifyContent: 'flex-start'    
    },
    scrollTabStyle: {
        height: normalize(32), borderBottomWidth: 0   
    }
});