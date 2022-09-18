import React from 'react';
import { Container, Content, Button } from 'native-base';
import { StyleSheet, View, Text, TextInput, Keyboard, Image } from 'react-native';
import UserHeader from './../../components/shared/UserHeader';
import WordStudyHeader from './../../components/wordstudy/WordStudyHeader';
import { fonts, normalize, getCreateWordPageHeight } from './../../assets/styles';
import Images from './../../assets/Images';
import {Actions} from 'react-native-router-flux';
import { getCurrentDate } from './../../components/shared/global';
import { getRecentStudy } from './../../utils/RecentStudy';
import { setRecentPage, setRecentPageDynamicData } from './../../utils/RecentPage';

let pageTitle = '단어 학습';
let problemList = [];

export default class WordStudySubject extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cur_problem_no: !this.props.cur_problem_no ? 1 : this.props.cur_problem_no,
            cur_problem_status: !this.props.cur_problem_status ? 'ready' : this.props.cur_problem_status,
            correctProblems: !this.props.correctProblems ? 0 : this.props.correctProblems, //정답
            wrongProblems: !this.props.wrongProblems ? 0 : this.props.wrongProblems, //오답
            answer: '',
            timer: !this.props.timer ? 0 : this.props.timer,
            selectedSubject: null,
            scrollToHeight: 0,
        };
    }    
    makeResult() {
        // 유저가 입력한 정답 처리
        let _answer = this.state.answer;
        _answer = _answer.replace(/\s/g,''); //공백 제거
        _answer = _answer.replace(/~/g, ""); //~ 제거

        if(this.props.studyMethod == 'kotoen') {
            _answer = _answer.toLowerCase();
        }
        // remove [] , ()
        _answer = _answer.replace(/ *\([^)]*\) */g, "");
        _answer = _answer.replace(/ *\[[^)]*\] */g, "");
        // DB에 저장된 단어 뜻 처리
        let _compare = this.props.params[this.state.cur_problem_no - 1]['answer'];
        // let _compare = "[열심히] 일하기, (가지마)((가라고))";
        _compare = _compare.replace(/\s/g,''); //공백 제거
        _compare = _compare.replace(/~/g, ""); //~ 제거
        if(this.props.studyMethod == 'kotoen') {
            _compare = _compare.toLowerCase();
        }

        let _compare_temp = _compare;

        // remove [] , ()
        _compare = _compare.replace(/ *\([^)]*\) */g, "");
        _compare = _compare.replace(/ *\[[^)]*\] */g, "");

        let _answer_list = _answer.split(',');
        let _compare_list = _compare.split(',');

      for(let i = 0; i < _answer_list.length; i ++) {
            if(_compare_list.indexOf(_answer_list[i]) >= 0)
                return true;
      }
        _compare_temp = _compare_temp.replace(/[\[\]']+/g,'');
        _compare_temp = _compare_temp.replace(/[\(\)']+/g,'');
        _compare_list = _compare_temp.split(',');
      for(let i = 0; i < _answer_list.length; i ++) {
            if(_compare_list.indexOf(_answer_list[i]) >= 0)
                return true;
      }
        return false;
    }
    async checkAnswer() {
        Keyboard.dismiss();
        if(this.state.answer == '')
            return;
        if(this.makeResult()) { // correct
            problemList.push({
                // id: this.props.params[this.state.cur_problem_no - 1]['id'],
                word_id: this.props.params[this.state.cur_problem_no - 1]['word_id'],
                problem: this.props.params[this.state.cur_problem_no - 1]['problem'],
                answer: this.props.params[this.state.cur_problem_no - 1]['answer'],
                user_answer: this.state.answer,
                result: 'correct'    
            });
            this.setState({cur_problem_status: 'correct',
                           correctProblems: this.state.correctProblems + 1 });


            let _correctProblems = this.state.correctProblems + 1;

            await setRecentPageDynamicData({
                problemList: problemList,
                cur_problem_status: 'ready',
                correctProblems: _correctProblems,
                wrongProblems: this.state.wrongProblems,
                cur_problem_no: this.state.cur_problem_no + 1,
                timer: this.state.timer
            });
            

            setTimeout(function() {
                this.nextProblem();
            }.bind(this), 1000);
        }
        else {
            problemList.push({
                // id: this.props.params[this.state.cur_problem_no - 1]['id'],
                word_id: this.props.params[this.state.cur_problem_no - 1]['word_id'],
                problem: this.props.params[this.state.cur_problem_no - 1]['problem'],
                answer: this.props.params[this.state.cur_problem_no - 1]['answer'],
                user_answer: this.state.answer,
                result: 'wrong'    
            });
            this.setState({cur_problem_status: 'wrong',
                            wrongProblems: this.state.wrongProblems + 1});

            let _wrongProblems = this.state.wrongProblems + 1;

            await setRecentPageDynamicData({
                problemList: problemList,
                cur_problem_status: 'ready',
                correctProblems: this.state.correctProblems,
                wrongProblems: _wrongProblems,
                cur_problem_no: this.state.cur_problem_no + 1,
                timer: this.state.timer
            });
        }
    }
    nextProblem()     {
        if(this.state.cur_problem_no == this.props.params.length) { // 학습 완료
            Actions.push("study_results_detail", {
                params: {
                    "totalProblems": this.props.params.length, //총문제
                    "time": this.state.timer, //시간
                    "correctProblems": this.state.correctProblems,  // 정답    
                    "wrongProblems": this.state.wrongProblems,  // 오답
                    "mark": Math.floor(( this.state.correctProblems / this.props.params.length ) * 100),
                    "problemList": problemList,                           
                    'end_time': getCurrentDate(),

                    'type': this.props.type,  //객관식/주관식
                    'studyMethod': this.props.studyMethod, //단어학습방식  entoko or kotoen
                    'progressOrder': this.props.progressOrder,
                    'category': this.props.category,
                    'fromStudyResultHome': this.props.fromStudyResultHome ? true : false
                }
            });    
        }
        else {
            this.setState({
                cur_problem_no: this.state.cur_problem_no + 1,
                cur_problem_status: 'ready',
                answer: ''
            });    
            this.answerInput.focus();
        };
    }    
    async componentDidMount() {
        try {
            await setRecentPage("word_study_subject", this.props);
            problemList = [];
            let selectedStudy = await getRecentStudy();
            if(selectedStudy) {
                this.setState({selectedSubject: selectedStudy})
            }
        }
        catch(err) {
            console.log("WordStudySubject err: ", err);
        }
    }
    render() {
        return (
            <Container> 
                <UserHeader title={pageTitle} />
                <WordStudyHeader title={this.state.selectedSubject ? this.state.selectedSubject.selectedName : ''}
                                 totalProblems={this.props.params.length} currentNo={this.state.cur_problem_no} 
                                 rightAnswer={this.state.correctProblems} wrongAnswer={this.state.wrongProblems}
                                 changeTime={(e) => {this.setState({timer: e})}}
                                 timerP={this.state.timer} />
                <Content style={styles.container}> 
                            <View style={[styles.problemContainer]}>
                                <View style={{position: 'absolute', top: normalize(28)}}>
                                    <Text style={[fonts.size14, fonts.familyBold]}>
                                        다음 단어의 뜻을 입력해주세요.
                                    </Text>
                                </View>
                                {
                                    this.state.cur_problem_status == 'correct' ? 
                                    <Image source={Images.correct2x} style={styles.correctIcon} resizeMode='contain' /> :
                                    ( this.state.cur_problem_status == 'wrong' ? 
                                    <Image source={Images.wrong2x} style={styles.correctIcon} resizeMode='contain' /> :
                                        null
                                    )
                                }
                                <Text style={[this.props.studyMethod=='entoko' ? fonts.size30 : fonts.size18, 
                                fonts.familyBold,
                                {lineHeight: (this.props.studyMethod=='entoko'? 40 : 26)} ]}>
                                { this.props.params[this.state.cur_problem_no - 1]['problem'] }
                                </Text>
                                {
                                    this.state.cur_problem_status == 'ready' ? null
                                    :
                                    <View style={{position: 'absolute', bottom: normalize(15), 
                                        display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={{backgroundColor: (this.state.cur_problem_status == 'correct' ? '#92BEF8' : '#F0B5B5'), borderRadius: normalize(4), padding: normalize(4)}}>
                                            <Text style={[fonts.size14, fonts.colorWhite, fonts.familyBold]}>정답</Text>
                                        </View>
                                        <View style={{marginLeft: normalize(8), flexShrink: 1}}>
                                            <Text 
                                            numberOfLines={3} 
                                            style={[fonts.familyBold, this.props.studyMethod=='entoko' ? fonts.size12 : fonts.size16, 
                                            {color: (this.state.cur_problem_status == 'correct' ? '#92BEF8' : '#F0B5B5')}]}>{ this.props.params[this.state.cur_problem_no - 1]['answer'] }</Text>
                                        </View>
                                    </View>
                                }

                            </View>
                            
                            
                            <View style={{ alignItems: 'center'}}>
                                {
                                    /*
                                    <TextInput
                                        style={[styles.textInput, fonts.colorBlack]}
                                        onChangeText={(text) => {
                                            this.setState({ answer: text });
                                        }}
                                        onSubmitEditing={() => {this.checkAnswer()}}
                                        value={this.state.answer}
                                        placeholder="정답을 입력하세요."
                                        placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                                        editable={(this.state.cur_problem_status == 'ready') ? true : false}
                                        selectTextOnFocus={this.state.cur_problem_status == 'ready' ? true : false}
                                        autoFocus={true}
                                        ref={ (input) => { this.answerInput = input } }
                                    >
                                    </TextInput>
                                    */
                                }

                                {
                                    <TextInput
                                        style={[styles.textInput, fonts.colorBlack]}
                                        onChangeText={(text) => {
                                            this.setState({ answer: text });
                                        }}
                                        placeholder="정답을 입력하세요."
                                        placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                                        onSubmitEditing={() => {this.checkAnswer()}}
                                        value={this.state.answer}
                                        autoFocus={true}
                                        ref={ (input) => { this.answerInput = input } }
                                        editable={(this.state.cur_problem_status == 'ready') ? true : false}
                                    >
                                    </TextInput>
                                }
                                
                            </View>
                            {
                                this.state.cur_problem_status == 'wrong' ?
                                <View style={[styles.footerConfirm]}>
                                    <Button style={styles.confirmButton}
                                    onPress={() => {this.nextProblem()}}>
                                        <Text style={[fonts.familyBold, fonts.size18, fonts.colorWhite]}>확인</Text>
                                    </Button> 
                                </View>
                                : null
                            }
                </Content>
                <View style={styles.footerComment}>
                    <Text style={[fonts.familyBold, fonts.size12, {textAlign: 'center', lineHeight: normalize(20)}]}>※ 정답 입력 시 '~'와 '( ), [ ]'안의 </Text>
                    <Text style={[fonts.familyBold, fonts.size12, {textAlign: 'center', lineHeight: normalize(20)}]}>내용은 쓰지 않아도 됩니다 </Text>
                </View>
            </Container>
        ); 
    }   
}

const styles = StyleSheet.create({
    footerComment: {
        height: normalize(50),
        justifyContent: 'center',
        backgroundColor: '#F4F4F4',
        position: 'absolute',
        top: (getCreateWordPageHeight() - normalize(50)),
        width: '100%',
        paddingHorizontal: normalize(16)
    },
    textInput: {
        fontSize: normalize(18),
        lineHeight: normalize(18),
        height: normalize(32),
        width: normalize(285),
        paddingTop: normalize(6),
        paddingBottom: normalize(6),
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
        fontFamily: 'Malgun-Gothic-Regular'
    },
    container: {
        height: getCreateWordPageHeight() - 50 - normalize(59) - normalize(50),
        backgroundColor: '#F4F4F4'
    },
    problemContainer: {
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: normalize(180), 
        position: 'relative',
        paddingHorizontal: normalize(8)
    },
    correctIcon: {
        opacity: 0.5, 
        width: normalize(80), 
        height: normalize(80),
        position: 'absolute',
    },
    footerConfirm: {
        height: normalize(126),
        paddingTop: normalize(18),
        alignSelf: 'center'
    },
    confirmButton: {
        backgroundColor: '#F0B5B5',
        width: normalize(176),
        height: normalize(48),
        display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        borderRadius: normalize(8),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 3.65,
        elevation: 3,
    }
});