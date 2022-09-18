import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { fonts, normalize } from './../../assets/styles';
export default class ChoiceItem extends React.Component {
    constructor(props) {
        super(props);
    }
    clickChoice() {
        this.props.triggerChoice(this.props.problemNo, this.props.choice);
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={0.6} disabled={this.props.status == 'ready' ? false : true}
             style={[styles.choiceItem, this.props.correct ? styles.correctItem : (this.props.wrong ? styles.wrongItem : styles.generalItem)]}
             onPress={() => {this.clickChoice()}}>
                <View style={{ width: (this.props.studyMethod == 'entoko' ? normalize(40) : normalize(50)), alignItems: 'center' }}>
                    <View style={{width: 24, height: 24, borderWidth: 1, borderRadius: 12, 
                                 borderColor: ((this.props.correct || this.props.wrong) ? 'white' : 'black'),
                                 alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={[this.props.studyMethod == 'entoko' ? fonts.size14 : fonts.size16, fonts.familyRegular, (this.props.correct || this.props.wrong) ? fonts.colorWhite : fonts.colorBlack ]}>{this.props.index}</Text>
                    </View>
                </View>
                <View style={{flexShrink: 1}}>
                    <Text numberOfLines={2}
                    style={[this.props.studyMethod == 'entoko' ? fonts.size12 : fonts.size16, fonts.familyBold, (this.props.correct || this.props.wrong) ? fonts.colorWhite : fonts.colorBlack]}>
                        {this.props.choice}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }   
}
const styles = StyleSheet.create({
    choiceItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: normalize(40),
        paddingLeft: normalize(0),
        paddingRight: normalize(20),
        marginBottom: normalize(12),
        borderRadius: normalize(4),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,     
    },
    generalItem: {
        backgroundColor: 'white'
    },
    correctItem: {
        backgroundColor: '#92BEF8'
    },
    wrongItem: {
        backgroundColor: '#F0B5B5'
    }
});