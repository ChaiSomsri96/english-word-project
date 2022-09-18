import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { Button } from 'native-base';
import { fonts, normalize } from './../../assets/styles';
import {Actions} from 'react-native-router-flux';
export default class StudyResultHistoryDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    detailPage() {
        if(this.props.params.classify && this.props.params.classify == 'sentence') {
            Actions.push('sentence_results_detail', {
                params: {
                    "totalProblems": this.props.params.totalProblems,
                    "correctProblems": this.props.params.correctProblems,
                    "wrongProblems": this.props.params.wrongProblems,
                    "mark": this.props.params.mark,
                    "problemList": this.props.params.problemList,
                    "end_time": this.props.params.end_time,
                    "category": this.props.params.category,
                    "fromStudyResultHome": true,
                    "random": this.props.params.random,
                    "disabledStorage": true
                }
            });
        }
        else {
            Actions.push('study_results_detail', {
                params: {
                    "totalProblems": this.props.params.totalProblems,
                    "time": this.props.params.time, //시간
                    "correctProblems": this.props.params.correctProblems,  // 정답 
                    "wrongProblems": this.props.params.wrongProblems,  // 오답
                    "mark": this.props.params.mark,
                    "problemList": this.props.params.problemList,
                    'end_time': this.props.params.end_time,
    
                    'type': this.props.params.type, //객관식/주관식
                    'studyMethod': this.props.params.studyMethod, //단어학습방식  entoko or kotoen
                    'progressOrder': this.props.params.progressOrder,
                    'category': this.props.params.category,
                    'fromStudyResultHome': true,
                    'disabledStorage': true
                }
            });
        }
    }

    removeHistory() {
        this.props.removeHistory(this.props.id);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight style={{flex: 6}} activeOpacity={0.8} underlayColor="rgb(248, 248, 248)"
                    onPress={() => this.detailPage()}>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <View>
                            <Text style={[fonts.size14, fonts.familyRegular]}>{this.props.id}.</Text>    
                        </View>
                        <View style={{marginLeft: normalize(12)}}>
                            <Text style={[fonts.size14, fonts.familyRegular]}>{this.props.params.end_time}</Text>
                            <Text style={[fonts.size13, fonts.familyRegular, {marginTop: normalize(4)}]}>
                                { this.props.params.categoryTitle }
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={styles.detailView}>
                    <View style={{marginLeft: normalize(0)}}>
                        <Button style={[styles.labelButton, {backgroundColor: (this.props.params.classify && this.props.params.classify == 'sentence' ? '#81c147' : '#FF9636') }]}>
                            <Text style={[fonts.size14, fonts.familyBold, fonts.colorWhite]}>
                                {
                                    this.props.params.classify && this.props.params.classify == 'sentence'
                                    ? '문장'
                                    : '단어'
                                }
                            </Text>
                        </Button>
                    </View>
                    <View style={{alignItems: 'flex-end', flexGrow: 1}}>
                        <Text style={[fonts.size14, fonts.familyBold]}>{this.props.params.correctProblems}/{this.props.params.totalProblems}</Text>
                        <Text style={[fonts.size16, fonts.familyBold, fonts.colorRed]}>{this.props.params.mark}점</Text>
                    </View>
                    <View style={{marginLeft: normalize(12)}}>
                        <Button style={styles.removeButton}
                        onPress={() => {this.removeHistory()}}>
                            <Text style={[fonts.size14, fonts.familyBold, fonts.colorWhite]}>삭제</Text>
                        </Button>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(12),
        borderBottomWidth: 1,
        borderColor: '#D2D2D2'
    },
    detailView: {
        display: 'flex', flexDirection: 'row',
        alignItems: 'center', flex: 6,
        justifyContent: 'space-between',
        paddingLeft: normalize(20)
    },
    removeButton: {
        backgroundColor: '#1BA3E5',
        width: normalize(45),
        height: normalize(36),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: normalize(4)
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    labelButton: {
        width: normalize(45),
        height: normalize(36),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: normalize(4)
    }
});
