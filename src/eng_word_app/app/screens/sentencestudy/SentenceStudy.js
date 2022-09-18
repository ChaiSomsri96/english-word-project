import React from 'react';
import { Container } from 'native-base';
import { StyleSheet, View, Text, FlatList, TouchableOpacity,Keyboard, TextInput, Image, BackHandler } from 'react-native';
import { fonts, normalize, getSafeAreaViewWidth } from './../../assets/styles';
import { Button } from 'native-base';
import StudyHeader from './../../components/shared/StudyHeader';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {Actions} from 'react-native-router-flux';
import Orientation from 'react-native-orientation';
import { Icon } from 'react-native-elements';
import Images from './../../assets/Images';
import { showToast } from '../../components/shared/global';
import { addToMySentence, removeFromMySentence } from './../../utils/MySentence'
import { getCurrentDate } from './../../components/shared/global';
import { setRecentPage } from './../../utils/RecentPage';

let pageTitle = '문장 학습';

export default class SentenceStudy extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true, 
            serverRespond: false,
            wordList: [],           // 문장별 단어목록 (선택 목록) 문장 변경시 reset 됩니다.
            correct: false,         // 정답/오답 여부 - 문장변경시 reset 됩니다. 
            confirmAnswer: false,   // 정답확인 버튼 클릭 여부 
            inputAnswer: '',        // 유저가 입력한 문장
            inputIds: [],           // 유저가 클릭한 아이디 목록 (close 아이콘 작동을 위한 변수) - 문장 변경시 reset 됩니다
            inputWords: [],         // 유저가 클릭한 단어 목록 (close 아이콘 작동을 위한 변수) - 문장 변경시 reset 됩니다
            correctAnswer: null,    // 정답확인을 위한 문장 (curIndex로 얻는다.)
            curIndex: 0,            // 문장학습 문제 번호 (현재번호)
            curQuestion: null,      // 현재 
            sentenceList: this.props.sentenceList
        };
    }    

    async componentDidMount() {
        try {

            await setRecentPage('sentence_study', this.props);

            Orientation.lockToLandscape();

            this.setState({correctAnswer: this.state.sentenceList[this.state.curIndex].sentence})
            let curSetence = this.state.sentenceList[this.state.curIndex];
            this.setState({curQuestion: curSetence})

            let temp = this.state.sentenceList[this.state.curIndex].parts;
            if(temp && temp.length > 0) {
                let wordList = []
                temp = temp.sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
                temp.map((item, index) => {
                    wordList.push({id: index, word: item, clicked: false})
                })
                if(wordList.length % 4 == 1) {
                    wordList.push({id: wordList.length, word: '', clicked: false})
                    wordList.push({id: wordList.length + 1, word: '', clicked: false})
                    wordList.push({id: wordList.length + 2, word: '', clicked: false})
                } else if(wordList.length % 4 == 2) {
                    wordList.push({id: wordList.length, word: '', clicked: false})
                    wordList.push({id: wordList.length+1, word: '', clicked: false})
                } else if(wordList.length % 4 == 3) {
                    wordList.push({id: wordList.length, word: '', clicked: false})
                }
                this.setState({wordList})
            }
            BackHandler.addEventListener("hardwareBackPress", this.backAction);
        }
        catch(err) {
            console.log("SentenceStudy err: ", err);
        }
    }

    UNSAFE_componentWillReceiveProps() {
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    }

    backAction = () => {
        Orientation.lockToPortrait();
        setTimeout(() => {
            Actions.refresh();
        }, 300);
    };

    confirm() { // 정답확인
        this.setState({confirmAnswer: true})
        let correctAnswer = this.state.correctAnswer.replace(/[^a-zA-Z, ]/g, "").replace(/ /g, "").toLowerCase();
        let inputAnswer = this.state.inputAnswer.replace(/[^a-zA-Z, ]/g, "").replace(/ /g, "").toLowerCase();

        if(inputAnswer == correctAnswer) {
            let _curQuestion = this.state.curQuestion;
            _curQuestion['correct'] = true;
            _curQuestion['input_answer'] = this.state.inputAnswer;
            this.setState({correct: true, curQuestion: _curQuestion});
        } else {
            let _curQuestion = this.state.curQuestion;
            _curQuestion['correct'] = false;
            _curQuestion['input_answer'] = this.state.inputAnswer;
            this.setState({correct: false, curQuestion: _curQuestion});
        }
    }

    again() { // 다시 풀기
        this.setState({inputAnswer: '', inputIds: [], inputWords: []});
        let wordList = this.state.wordList;
        if(wordList && wordList.length > 0) {
            wordList.map((item ,index) => {
                wordList[index]['clicked'] = false;
            })
            this.setState({wordList: wordList})
        }
        this.setState({confirmAnswer: false})
    }

    renderWord(item, index) {
        if(item.word && !item.clicked)
            return <TouchableOpacity style={[styles.word, {backgroundColor: index % 4 == 0 ? '#5DABDD' : index % 4 == 1 ? '#F0B6B7' : index % 4 == 2 ? '#F4D9A7' : '#F1BE9C'}]} onPress={() => this.clickWord(item)}>
                <Text style={fonts.size12}>{item.word}</Text>
            </TouchableOpacity>
        else
            return <View style={styles.word}></View>
    }

    clickWord(word) {
        let inputWords = this.state.inputWords;
        inputWords.push(word.word);
        this.setState({inputAnswer: inputWords.join(" ")});

        let wordList = this.state.wordList;
        let inputIds = this.state.inputIds;

        if(wordList && wordList.length > 0) {
            wordList.map((item ,index) => {
                if(item.id == word.id) {
                    wordList[index]['clicked'] = true;
                    inputIds.push(index);
                }
            })
            this.setState({wordList: wordList, inputIds: inputIds})
        }
    }

    cancelOneStep() {
        if(this.state.confirmAnswer)
            return;
        let inputIds = this.state.inputIds;
        let inputWords = this.state.inputWords;
        if(inputIds.length > 0 && inputWords.length > 0) {
            let wordList = this.state.wordList;
            wordList[inputIds[inputIds.length - 1]]['clicked'] = false;
            inputIds.splice(inputIds.length - 1, 1);
            inputWords.splice(inputWords.length - 1, 1);
            this.setState({ inputAnswer: inputWords.join(" "), inputIds: inputIds, inputWords: inputWords, wordList: wordList });
        }
    }

    async isFav() {
        let curSetence = this.state.curQuestion
        curSetence['isFavorite'] = !curSetence['isFavorite']
        this.setState({curQuestion: curSetence})
        if(curSetence['isFavorite']) { //checked
            if( await addToMySentence(  {...this.state.sentenceList[this.state.curIndex], checked: false} ) ) {
                showToast("add_to_mysentence", "success");
            }
        }
        else {
            if( await removeFromMySentence( {...this.state.sentenceList[this.state.curIndex], checked: false} ) ) {
                showToast("remove_from_mysentence", "success");
            }
        }
    }

    async chooseSetence(prev_next) {
        this.setState({wordList: []})
        this.setState({loaded: false})
        let curIndex = this.state.curIndex
        if(prev_next == -1)
            curIndex = curIndex - 1;
        else
            curIndex = curIndex + 1;
        this.setState({correct: false})
        this.setState({confirmAnswer: false})
        this.setState({inputAnswer: '', inputIds: [], inputWords: []})
        this.setState({correctAnswer: this.state.sentenceList[curIndex].sentence})
        
        let curSetence = this.state.sentenceList[curIndex];
        this.setState({curQuestion: curSetence})

        let temp = this.state.sentenceList[curIndex].parts;
        if(temp && temp.length > 0) {
            let wordList = []

            temp = temp.sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });

            temp.map((item, index) => {
                wordList.push({id: index, word: item, clicked: false})
            })
            if(wordList.length % 4 == 1) {
                wordList.push({id: wordList.length, word: '', clicked: false})
                wordList.push({id: wordList.length + 1, word: '', clicked: false})
                wordList.push({id: wordList.length + 2, word: '', clicked: false})
            } else if(wordList.length % 4 == 2) {
                wordList.push({id: wordList.length, word: '', clicked: false})
                wordList.push({id: wordList.length + 1, word: '', clicked: false})
            } else if(wordList.length % 4 == 3) {
                wordList.push({id: wordList.length, word: '', clicked: false})
            }
            this.setState({wordList })
        }
        this.setState({curIndex: curIndex})
        this.setState({loaded: true})
    }

    shuffle(array) {
        var currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    endStudy() {
        this.setState({loaded: false});

        let correctProblems = 0, wrongProblems = 0;
        for(let i = 0; i < this.state.sentenceList.length; i ++) {
            if(this.state.sentenceList[i]['correct'])
                correctProblems ++;
            else
                wrongProblems ++;
        }
        this.setState({loaded: true});

        BackHandler.removeEventListener("hardwareBackPress", this.backAction);

        Orientation.lockToPortrait();
        Actions.push('sentence_results_detail', {
            params: {
                "totalProblems": this.state.sentenceList.length, //총문제
                "correctProblems": correctProblems, //정답
                "wrongProblems": wrongProblems, //오답 
                "mark": Math.floor(( correctProblems / this.state.sentenceList.length ) * 100),
                "problemList": this.state.sentenceList,
                "end_time": getCurrentDate(),
                "category": this.props.category,
                "fromStudyResultHome": this.props.fromStudyResultHome ? true : false,
                "random": this.props.random
            }
        });
    }

    render()  {
        return (
            <Container>
                <StudyHeader title={pageTitle} />
                <View style={{paddingHorizontal: 12, paddingTop: 13}}>
                    {
                        this.state.curQuestion ?
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            {
                                this.props.category.before == 'detail' ?
                                <TouchableOpacity onPress={() => this.isFav()}>
                                    <Icon name='star' type='antdesign' size={20} color={this.state.curQuestion.isFavorite ? '#F2C94C' : 'rgba(0,0,0,0.2)'} /> 
                                </TouchableOpacity>
                                : null
                            }
                            <Text style={[{paddingLeft: 6, fontSize: 12, lineHeight: 15}]}>{this.state.curIndex + 1}.  {this.state.curQuestion.meaning}</Text>
                        </View>
                        :
                        null
                    }
                </View>
                <View>
                    <TouchableOpacity style={{position: 'absolute', right: 12, top: 10}} onPress={() => this.cancelOneStep()}>
                        <Icon name='closecircle' type='antdesign' size={20} color='#828282' /> 
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.textInput, fonts.colorBlack]}
                        onChangeText={(text) => {
                            this.setState({ inputAnswer: text });
                        }}
                        textDecorationLine={this.state.confirmAnswer && !this.state.correct ? "line-through" : ''}
                        onSubmitEditing={Keyboard.dismiss}   
                        value={this.state.inputAnswer}
                        editable={false}
                        multiline={true}
                    >
                    </TextInput>
                </View>

                <TextInput
                    style={[styles.textInput,{borderBottomColor: '#E1E1E1', color: 'rgba(0,0,0,0.5)'}]}
                    onSubmitEditing={Keyboard.dismiss}   
                    value={this.state.confirmAnswer ? this.state.correctAnswer : ''}
                    editable={false}
                    multiline={true}
                >
                </TextInput>
                {
                    this.state.confirmAnswer && !this.state.correct ?
                    <View style={[styles.container, styles.scrollView, {justifyContent: 'center', alignItems: 'center'}]}>
                        <Image source={Images.wrong2x} style={styles.resultIcon} resizeMode='contain' />
                    </View>
                    :
                    this.state.confirmAnswer && this.state.correct ?
                    <View style={[styles.container, styles.scrollView, {justifyContent: 'center', alignItems: 'center'}]}>
                        <Image source={Images.correct2x} style={styles.resultIcon} resizeMode='contain' />
                    </View>
                    :
                    <FlatList
                        style={[styles.container, styles.scrollView]}
                        columnWrapperStyle={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}
                        data={this.state.wordList}
                        keyExtractor={(item) => item.id}
                        renderItem={ ({item, index}) => (
                            this.renderWord(item, index)
                        )}
                        ListFooterComponent={
                            <>
                            <View style={styles.contentPaddingBottom}></View>   
                            <Spinner_bar color={'#68ADED'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                            </>    
                        }
                        numColumns={4}
                    />
                }

                <View style={{display: 'flex', flexDirection: 'row', paddingVertical: normalize(8), justifyContent: 'space-evenly'}}>
                    {
                        this.state.confirmAnswer ?
                        <>
                        {
                            this.state.curIndex > 0 ?
                            <Button style={styles.footerButton} onPress={() => this.chooseSetence(-1)}>
                                <Text style={[fonts.size12, fonts.familyRegular, fonts.colorWhite]}>이전문제</Text>
                            </Button>
                            :
                            <View style={[styles.footerButton, {backgroundColor: 'white'}]}>
                            </View>
                        }
                            <Button style={styles.footerButton} onPress={() => this.again()}>
                                <Text style={[fonts.size12, fonts.familyRegular, fonts.colorWhite]}>다시 풀기</Text>
                            </Button>
                        {
                            this.state.curIndex == this.state.sentenceList.length - 1 ?
                            <Button style={styles.footerButton} onPress={() => this.endStudy()}>
                                <Text style={[fonts.size12, fonts.familyRegular, fonts.colorWhite]}>학습 끝</Text>
                            </Button>
                            :
                            <Button style={styles.footerButton} onPress={() => this.chooseSetence(1)}>
                                <Text style={[fonts.size12, fonts.familyRegular, fonts.colorWhite]}>다음문제</Text>
                            </Button>
                        }
                        </>
                        :
                        <Button style={styles.footerButton} onPress={() => this.confirm()}>
                            <Text style={[fonts.size12, fonts.colorWhite]}>정답확인</Text>
                        </Button>
                    }
                </View>
                
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollView: {
        paddingTop: normalize(6), 
        paddingBottom: normalize(30),
    },
    korStudySen: {
        fontSize: normalize(16),
        lineHeight: normalize(24)
    },
    footerButton: {
        width: normalize(96),
        height: normalize(32),
        borderRadius: normalize(50),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1BA3E5'
    },
    contentPaddingBottom: {
        height: normalize(30)
    },
    word: {
        borderRadius: 8,
        height: ((getSafeAreaViewWidth() - 20 - normalize(140) - 6) / 3 - 10),
        flex: 1,
        marginHorizontal: 10,
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: 10,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(5)
    },
    textInput: {
        fontSize: normalize(12),
        height: normalize(32),
        paddingTop: normalize(3),
        paddingBottom: normalize(6),
        marginHorizontal: 15,
        borderBottomWidth: 1,
        marginTop: 3,
        borderColor: 'rgba(0,0,0,0.5)',
    },
    resultIcon: {
        width: 60,
        height: 60
    },
});