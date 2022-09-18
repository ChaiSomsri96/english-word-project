import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { fonts, normalize } from './../../assets/styles';
import Images from './../../assets/Images';

export default class StudyHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{backgroundColor: '#DBEAFE'}}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: normalize(12)}}>
                    <View style={{flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.totalProblems}>
                            <Text style={[fonts.size16, fonts.familyBold, fonts.colorWhite]}>총문제</Text>
                        </View>
                        <View>
                            <Text style={[fonts.size16, fonts.familyBold, fonts.colorBlue, {marginLeft: normalize(12)}]}>{this.props.totalProblems} 문제</Text>
                        </View>
                    </View>
                    <View style={{flex:1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                        <Icon type='evilicon' name='clock' color="#006DFF" size={30} />
                        <View>
                            <Text style={[fonts.size16, fonts.familyBold, fonts.colorBlue, {marginLeft: normalize(12)}]}>시간</Text>
                        </View>
                        <View>
                            <Text style={[fonts.size16, fonts.familyBold, fonts.colorBlue, {marginLeft: normalize(16)}]}>{this.props.time}</Text>
                        </View>
                    </View>
                </View>

                <View style={{display: 'flex', flexDirection: 'row', paddingHorizontal: normalize(24), paddingVertical: normalize(18)}}>
                    <View style={[styles.boxShadow, {flex: 1, backgroundColor: 'white', 
                                marginRight: normalize(19), paddingVertical: normalize(18),
                                borderRadius: normalize(8)}]}>
                        <View style={[{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
                                        paddingHorizontal: normalize(12)}]}>
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={Images.correct} style={styles.resultIcon} resizeMode='cover' />
                                <Text style={[fonts.size14, fonts.familyBold, styles.studyTextColor, {marginLeft: normalize(6)}]}>정답</Text>
                            </View>
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={[fonts.size24, fonts.familyBold, styles.studyTextColor]}>{this.props.correctProblems}</Text>
                                <Text style={[fonts.size14, fonts.familyBold, styles.studyTextColor, {marginLeft: normalize(6)}]}>개</Text>
                            </View>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
                                        paddingHorizontal: normalize(12)}}>
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={Images.wrong} style={styles.resultIcon} resizeMode='contain' />
                                <Text style={[fonts.size14, fonts.familyBold, styles.studyTextColor, {marginLeft: normalize(6)}]}>오답</Text>
                            </View>
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={[fonts.size24, fonts.familyBold, styles.studyTextColor]}>{this.props.wrongProblems}</Text>
                                <Text style={[fonts.size14, fonts.familyBold, styles.studyTextColor, {marginLeft: normalize(6)}]}>개</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.boxShadow, 
                                {display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                    flex: 1, 
                                    backgroundColor: 'white', marginLeft: normalize(19),
                                    borderRadius: normalize(8), position: 'relative'}]}>

                        <View style={styles.boxBadge}>
                                <Text style={[fonts.size14, fonts.familyBold, fonts.colorWhite]}>평균점수</Text>
                        </View>

                        <Text style={[fonts.size40, fonts.familyBold]}>{this.props.mark}</Text>
                        <Text style={[fonts.size24, fonts.familyBold, {color: 'rgba(0,0,0,0.5)', marginLeft: normalize(8)}]}>점</Text>
                    </View>
                </View>
            </View>
        )
    }    
}

const styles = StyleSheet.create({
    totalProblems: {
        backgroundColor: '#006DFF',
        paddingVertical: normalize(7),  
        paddingHorizontal: normalize(21),
        borderTopRightRadius: normalize(50),
        borderBottomRightRadius: normalize(50)
    },
    resultIcon: {
        width: 20,
        height: 20
    },
    studyTextColor: {
        color: 'rgba(0, 0, 0, 0.6)'
    },    
    boxShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    boxBadge: {
        height: 26,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute', backgroundColor: 'black', top: normalize(-13),
        paddingHorizontal: normalize(4),
        borderRadius: normalize(4)
    },
});
