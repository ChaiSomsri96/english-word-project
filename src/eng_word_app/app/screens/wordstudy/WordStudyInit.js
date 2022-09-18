import React from 'react';
import { Button, Content, Footer, FooterTab, Container } from 'native-base';
import { StyleSheet, View, Text, TextInput, Keyboard, ScrollView, SafeAreaView } from 'react-native';
import { fonts, normalize, getCreateWordPageHeight } from './../../assets/styles';
import { Icon } from 'react-native-elements';
import { CheckBox } from 'react-native-elements'
import UserHeader from './../../components/shared/UserHeader';
import {Actions} from 'react-native-router-flux';
import { performNetwork } from './../../components/shared/global';
import { getWordList } from './../../utils/api';
import { getWordListFromMyWord } from './../../utils/MyWord';
import { getVocabularyData } from './../../utils/MyMakingWords';
import { showToast, shuffleArray, generate } from './../../components/shared/global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { setRecentPage } from './../../utils/RecentPage';
import {getDataDetail} from './../../utils/Category';
let pageTitle = '단어 학습';

export default class WordStudyInit extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            serverRespond: false,
            problemMethod: 'sub',
            studyMethod: 'entoko',
            progressOrder: 'sequence',
            startNumber: '0',
            endNumber: '0',
            arrData: []
        }
    }
    async componentDidMount() {
        await setRecentPage('word_study_init', this.props);
        this.fetchWordList();
    }
    async fetchWordList() {
        if(this.props.params.before == 'detail') { //과제목 단어학습
            performNetwork(this, getWordList(this.props.params.category_id)).then(async (response) => {
                if(response == null) { 
                    let _word_list = await getDataDetail(this.props.params.category_id, 'word_list');
                    this.setState({arrData: _word_list,
                        startNumber: '1',
                        endNumber: _word_list.length.toString()});    
                    return; 
                }
                this.setState({arrData: response,
                                startNumber: '1',
                                endNumber: response.length.toString()});
            });    
        }
        else if(this.props.params.before == 'myword') { // 내단어장
            this.setState({loaded: false});
            let _word_list = await getWordListFromMyWord();
            this.setState({arrData: _word_list, loaded: true,
                            startNumber: '1',
                            endNumber: _word_list.length.toString()});          
        }
        else { // 내가 만드는 단어장
            this.setState({loaded: false});
            let _word_list = await getVocabularyData(this.props.params.dictionary_id);
            this.setState({arrData: _word_list, loaded: true,
                startNumber: '1',
                endNumber: _word_list.length.toString()});          
        }
    }
    //
    shuffle() {

        let _start = this.state.startNumber;
        let _end = this.state.endNumber;
        if(_start == '' || _end == '')
            return false;
        
        _start = parseInt(this.state.startNumber);
        if(_start <= 0)
            return false;

        _end = parseInt(this.state.endNumber);
        if(_end <= 0)
            return false;
        
        if(_start > _end) {
            return false;
        }

        if(_start > this.state.arrData.length || _end > this.state.arrData.length) {
            return false;
        }

        let _array = [];
        for (let i = _start; i <= _end; i ++) 
            _array.push(i);
        
        let _problems = [];
        if(this.state.problemMethod == 'sub') {
            for(let i = 0; i < _array.length; i ++) {
                _problems.push({
                    // 'id': _array[i],
                    'word_id': this.state.arrData[_array[i] - 1].id,
                    'problem': (this.state.studyMethod == 'entoko' ?
                    this.state.arrData[_array[i] - 1].word : this.state.arrData[_array[i] - 1].meaning),
                    'answer': (this.state.studyMethod == 'entoko' ? 
                    this.state.arrData[_array[i] - 1].meaning : this.state.arrData[_array[i] - 1].word)
                });
            }
            if(this.state.progressOrder == 'random') 
                _problems = shuffleArray(_problems);
        }
        else {
            for(let i = 0; i < _array.length; i ++) {
                _problems.push({
                    'word_id': this.state.arrData[_array[i] - 1].id,
                    'problem': (this.state.studyMethod == 'entoko' ?
                        this.state.arrData[_array[i] - 1].word : this.state.arrData[_array[i] - 1].meaning),
                    'correct_index': _array[i], 
                    'correct_answer': (this.state.studyMethod == 'entoko' ? 
                    this.state.arrData[_array[i] - 1].meaning : this.state.arrData[_array[i] - 1].word),
                    'choice': generate(_array[i], this.state.arrData.length).map(x => ( {no: x, problem: (this.state.studyMethod == 'entoko' ? this.state.arrData[x-1].meaning : this.state.arrData[x-1].word)} ) )
                });
            }
            if(this.state.progressOrder == 'random')
                _problems = shuffleArray(_problems);
        }
        return _problems;
    }
    //
    startStudy() {

        if(this.state.arrData.length < 5 && this.state.problemMethod == 'obj') {
            showToast("object_word_study_shortage_problem", "error");
            return;
        }
        //예외처리 추가 필요
        let _problems = this.shuffle();
        if(!_problems)
            {
                showToast("start_end_number_error", "error");
                return;
            }
        if(this.state.problemMethod == 'sub') {
            Actions.push('word_study_subject', {
                params: _problems,
                studyMethod: this.state.studyMethod,
                progressOrder: this.state.progressOrder,
                type: 'sub',
                category: {
                    before: this.props.params.before,
                    category_id: this.props.params.before == 'detail' ? this.props.params.category_id : 
                                    (this.props.params.before == 'myword' ? 0 : this.props.params.dictionary_id)
                }
            });
        }
        else {
            Actions.push('word_study_object', {
                params: _problems,
                studyMethod: this.state.studyMethod,
                progressOrder: this.state.progressOrder,
                type: 'obj',
                category: {
                    before: this.props.params.before,
                    category_id: this.props.params.before == 'detail' ? this.props.params.category_id : 
                                    (this.props.params.before == 'myword' ? 0 : this.props.params.dictionary_id)
                }
            });
        }
    }
    startNumberChange(text) {
        if (text == '' || /^\d+$/.test(text)) {
            this.setState({ startNumber: text });
        }
    }
    endNumberChange(text) {
        if (text == '' || /^\d+$/.test(text)) {
            this.setState({ endNumber: text });
        }
    }
    render()     {
        return (
            <Container>
                <UserHeader title={pageTitle} />
                <Content style={styles.container}>
                        <View style={{paddingHorizontal: normalize(24)}}>
                            <View style={{marginTop: normalize(25)}}>
                                <Text style={[fonts.size16, fonts.familyRegular, {textAlign: 'center'}]}>단어 학습 모드를 설정해주세요</Text>
                            </View>
                            <View style={{marginTop: normalize(30)}}>
                                <View style={styles.methodItem}>
                                    <View style={{flex: 2}}>
                                        <Icon name="pencil" type='evilicon' />
                                    </View>
                                    <View style={{flex: 10}}>
                                        <Text style={[fonts.size16, fonts.familyBold]}>단어 문제 방식</Text>
                                    </View>
                                </View>
                                <View  style={[{ display:'flex', flexDirection:'row', paddingTop: normalize(6)}]}>
                                    <CheckBox
                                        title='객관식'
                                        checked={this.state.problemMethod == 'obj'}
                                        containerStyle={{backgroundColor: '#F4F4F4', borderColor: '#F4F4F4', flex: 1, paddingVertical: 0}}
                                        textStyle={[fonts.size16, fonts.familyRegular, fonts.weightNormal, fonts.colorBlack]}
                                        checkedColor='#6FCF97'
                                        onPress={() => { this.setState({problemMethod: 'obj'}) }}
                                        />
                                    <CheckBox
                                        title='주관식'
                                        checked={this.state.problemMethod == 'sub'}
                                        containerStyle={{backgroundColor: '#F4F4F4', borderColor: '#F4F4F4', flex: 1, paddingVertical: 0}}
                                        textStyle={[fonts.size16, fonts.familyRegular, fonts.weightNormal, fonts.colorBlack]}
                                        checkedColor='#6FCF97'
                                        onPress={() => { this.setState({problemMethod: 'sub'}) }}
                                        />
                                </View>
                            </View>
                            <View style={{marginTop: normalize(20)}}>
                                <View style={styles.methodItem}>
                                    <View style={{flex: 2}}>
                                        <Icon name="eye" type='evilicon' />
                                    </View>
                                    <View style={{flex: 10}}>
                                        <Text style={[fonts.size16, fonts.familyBold]}>단어 학습 방식</Text>
                                    </View>
                                </View>
                                <View  style={[{ display:'flex', paddingTop: normalize(6)}]}>
                                    <CheckBox
                                        title='영어 문제를 한글로 풀기'
                                        checked={this.state.studyMethod == 'entoko'}
                                        containerStyle={{backgroundColor: '#F4F4F4', borderColor: '#F4F4F4', paddingVertical: 0}}
                                        textStyle={[fonts.size16, fonts.weightNormal, fonts.familyRegular, fonts.colorBlack]}
                                        checkedColor='#6FCF97'
                                        onPress={() => { this.setState({studyMethod: 'entoko'}) }}
                                        />
                                    <CheckBox
                                        title='한글 문제를 영어로 풀기'
                                        checked={this.state.studyMethod == 'kotoen'}
                                        containerStyle={{backgroundColor: '#F4F4F4', borderColor: '#F4F4F4', paddingVertical: 0}}
                                        textStyle={[fonts.size16, fonts.weightNormal, fonts.familyRegular, fonts.colorBlack]}
                                        checkedColor='#6FCF97'
                                        onPress={() => { this.setState({studyMethod: 'kotoen'}) }}
                                        />
                                </View>
                            </View>

                            <View style={{marginTop: normalize(20)}}>
                                <View style={styles.methodItem}>
                                    <View style={{flex: 2}}>
                                        <Icon name="refresh" type='evilicon' />
                                    </View>
                                    <View style={{flex: 10}}>
                                        <Text style={[fonts.size16, fonts.familyBold]}>단어 진행 순서</Text>
                                    </View>
                                </View>
                                <View  style={[{ display:'flex' , flexDirection:'row' , alignItems: 'center', paddingTop: normalize(6)}]}>
                                    <CheckBox
                                        title='순서대로'
                                        checked={this.state.progressOrder == 'sequence'}
                                        containerStyle={{backgroundColor: '#F4F4F4', borderColor: '#F4F4F4', flex: 1, paddingVertical: 0}}
                                        textStyle={[fonts.size16, fonts.weightNormal, fonts.familyRegular, fonts.colorBlack]}
                                        checkedColor='#6FCF97'
                                        onPress={() => { this.setState({progressOrder: 'sequence'}) }}
                                        />
                                    <CheckBox
                                        title='임의대로'
                                        checked={this.state.progressOrder == 'random'}
                                        containerStyle={{backgroundColor: '#F4F4F4', borderColor: '#F4F4F4', flex: 1, paddingVertical: 0}}
                                        textStyle={[fonts.size16, fonts.weightNormal, fonts.familyRegular, fonts.colorBlack]}
                                        checkedColor='#6FCF97'
                                        onPress={() => { this.setState({progressOrder: 'random'}) }}
                                        />
                                </View>
                            </View>


                            <View style={{marginTop: normalize(20), paddingBottom: normalize(10)}}>
                                <View style={styles.methodItem}>
                                    <View style={{flex: 2}}>
                                        <Icon name="retweet" type='evilicon' /> 
                                    </View>
                                    <View style={{flex: 10}}>
                                        <Text style={[fonts.size16, fonts.familyBold]}>단어 문제 번호</Text>
                                    </View>
                                </View>
                                <View style={{display: 'flex', flexDirection: 'row', paddingTop: normalize(12)}}>
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1,
                                    justifyContent: 'center'}}>
                                        <Text style={[fonts.size16, fonts.familyRegular]}>
                                            시작번호
                                        </Text>
                                        {
                                            /*
                                            <TextInput
                                                style={styles.textInput}
                                                onChangeText={(text) => {
                                                    this.startNumberChange(text)
                                                }}
                                                onSubmitEditing={Keyboard.dismiss}
                                                value={this.state.startNumber}
                                                keyboardType='numeric'
                                            >
                                            </TextInput> */
                                        }
                                        <TextInput
                                            style={[styles.textInput, fonts.colorBlack]}
                                            onChangeText={(text) => {
                                                this.setState({ startNumber: text });
                                            }}
                                            onSubmitEditing={Keyboard.dismiss}   
                                            value={this.state.startNumber}
                                            keyboardType='numeric'
                                        >
                                        </TextInput>    
                                    </View>
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1,
                                    justifyContent: 'center'}}>
                                        <Text style={[fonts.size16, fonts.familyRegular]}>
                                            끝번호
                                        </Text>
                                        {
                                            /*
                                            <TextInput
                                                style={styles.textInput}
                                                onChangeText={(text) => {
                                                    this.endNumberChange(text)
                                                }}
                                                onSubmitEditing={Keyboard.dismiss}
                                                value={this.state.endNumber}
                                                keyboardType='numeric'
                                            >
                                            </TextInput>
                                            */
                                        }
                                        <TextInput
                                            style={[styles.textInput, fonts.colorBlack]}
                                            onChangeText={(text) => {
                                                this.setState({ endNumber: text });
                                            }}
                                            onSubmitEditing={Keyboard.dismiss}   
                                            value={this.state.endNumber}
                                            keyboardType='numeric'
                                        >
                                        </TextInput>    
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Spinner_bar color={'#68ADED'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                        <View style={styles.footerBar}>
                            <View style={{ alignSelf: 'center' }}>
                                {
                                    <Button style={styles.startButton}
                                onPress={ () => { this.startStudy() } }>
                                        <Text style={[fonts.size22, fonts.familyBold]}>학습 시작 </Text>
                                    </Button>   
                                }
                            </View>          
                        </View>
                </Content>
            </Container>           
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        flexDirection: 'column'
    },
    safeContainer: {
        //height: getCreateWordPageHeight(),
        flex: 1,
        backgroundColor: '#FFF'
    }, 
    scrollView: {
        // height: normalize(500)
    },
    footerBar: {
        backgroundColor: '#F4F4F4',
        paddingVertical: normalize(20),
        height: normalize(104)
    },
    methodItem: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.2)',
        paddingBottom: normalize(6),
        display: 'flex',
        flexDirection: 'row'
    },
    startButton: {
        backgroundColor: 'white',
        width: normalize(272),
        height: normalize(64),
        borderRadius: normalize(16),
        borderColor: '#EB5757',
        borderWidth: 1,
        display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        margin: 'auto'
    },
    textInput: {
        height: normalize(32),
        width: normalize(56),
        paddingTop: normalize(6),
        paddingBottom: normalize(6),
        borderRadius: normalize(4),
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 4,
        textAlign: 'center',
        marginLeft: normalize(8),
        fontFamily: 'Malgun-Gothic-Regular',
        fontSize: normalize(14), lineHeight: normalize(14)
    }
});