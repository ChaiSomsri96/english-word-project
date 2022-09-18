import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Button, Tab, Tabs, ScrollableTab } from 'native-base';
import UserHeader from './../../components/shared/UserHeader';
import StudyHeader from './../../components/studyresults/StudyHeader';
import StudyResultsDetailTab from './StudyResultsDetailTab';
import { fonts, normalize, tabs } from './../../assets/styles';
import { Actions } from 'react-native-router-flux';
import { addToStudyResults } from './../../utils/StudyResults';
import { showToast, shuffleArray, generate, performNetwork, generateStudyResultId } from './../../components/shared/global';
import { getWordList } from './../../utils/api';
import { getWordListFromMyWord } from './../../utils/MyWord';
import { getVocabularyData } from './../../utils/MyMakingWords';
import { getRecentStudy } from './../../utils/RecentStudy';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { getWordIdListFromMyWord } from './../../utils/MyWord';
import { setRecentPage } from '../../utils/RecentPage';
import { getDataDetail } from './../../utils/Category';

let pageTitle = '학습 결과';
let arrTypes = [
    { id: 0, title: '전체', result: '' }, 
    { id: 1, title: '정답', result: 'correct' }, 
    { id: 2, title: '오답', result: 'wrong' }
];

export default class StudyResultsDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            studyResultTitle: '중1 비상 (홍민표) 3과',
            arrData: [],
            problemList: []
        };
    }
    async componentDidMount() {
        try {
            await setRecentPage('study_results_detail', this.props);
            this.setState({loaded: false});
            if(this.props.params.category.before == 'detail') {     
                let selectedStudy = await getRecentStudy();
                if(selectedStudy) {
                    this.setState({studyResultTitle: selectedStudy.selectedName})
                }
            }
            else if(this.props.params.category.before == 'myword') {
                this.setState({studyResultTitle: '내단어장'});
            }
            else if(this.props.params.category.before == 'mymakingword') {
                this.setState({studyResultTitle: '내가 만드는 단어장'});
            }
            let _arrData = await this.fetchWordList();
            let _word_id_list = await getWordIdListFromMyWord();

            let _problem_list = this.props.params.problemList;
            for(let i = 0; i < _problem_list.length; i ++) {
                for(let j = 0; j < _arrData.length; j ++) {
                    if(_arrData[j]['id'] == _problem_list[i]['word_id']) {
                        _problem_list[i]['word_item'] = _arrData[j];
                        break;
                    }
                }
                _problem_list[i]['is_favorite'] = _word_id_list.indexOf(_problem_list[i]['word_id']) >= 0 ? true : false;
            }
            this.setState({loaded: true, arrData: _arrData, problemList: _problem_list});
        }
        catch(err) {
            console.log("StudyResultsDetail err: ", err);
        }
    }
    async saveAndFinish() {
        this.setState({loaded: false});
        await addToStudyResults({
            "id": generateStudyResultId(),
            "totalProblems": this.props.params.totalProblems, //총문제
            "display_time": this.timeFormat(),
            "time": this.props.params.time, //시간
            "correctProblems": this.props.params.correctProblems, // 정답 
            "wrongProblems": this.props.params.wrongProblems,  // 오답
            "mark": this.props.params.mark,

            "problemList": this.props.params.problemList,

            "end_time": this.props.params.end_time,

            "type": this.props.params.type,
            "studyMethod": this.props.params.studyMethod,
            "progressOrder": this.props.params.progressOrder,
            "category": this.props.params.category,
            "categoryTitle": this.state.studyResultTitle,
        });
        this.setState({loaded: true});
        Actions.replace('study_results_home');
    }
    timeFormat() {
        let ss = this.props.params.time % 60;
        if(ss <= 9) ss = '0' + ss;
        let mm = Math.floor(this.props.params.time / 60);
        if(mm <= 9) mm = '0' + mm;
        return mm + ':' + ss;
    }
    finish() {
        if(this.props.params.fromStudyResultHome) {
            Actions.replace('study_results_home');
        }
        else {
            if(this.props.params.category.before == 'detail') {
              Actions.popTo('detail');
            }
            if(this.props.params.category.before == 'myword') {
              Actions.popTo('my_word_home');
            }
            if(this.props.params.category.before == 'mymakingword') {
              Actions.popTo('my_making_word_detail');
            }
        }
    }
    async fetchWordList() {
       try {
            if(this.props.params.category.before == 'detail') {
                let response = await performNetwork( this, getWordList(this.props.params.category.category_id) );
                if(response == null) {
                    response = await getDataDetail(this.props.params.category.category_id, 'word_list');
                }
                return response;
            }
            else if(this.props.params.category.before == 'myword') {
                this.setState({loaded: false});
                let response = await getWordListFromMyWord();
                this.setState({loaded: true});
                return response;
            }
            else if(this.props.params.category.before == 'mymakingword') {
                this.setState({loaded: false});
                let response = await getVocabularyData(this.props.params.category.category_id);
                this.setState({loaded: true});
                return response;
            }
            return [];
       }
       catch(err) {
           return [];
       }
    }
    async resolveAll() {
        let _problems = [];
        if(this.props.params.type == 'sub') { //주관식
            for(let i = 0; i < this.props.params.problemList.length; i ++) {
                _problems.push({
                    'word_id': this.props.params.problemList[i].word_id,
                    'problem': this.props.params.problemList[i].problem,
                    'answer': this.props.params.problemList[i].answer
                })
            }
            if(this.props.params.progressOrder != 'sequence') { //단어 진행 순서
                _problems = shuffleArray(_problems);
            }
            Actions.push('word_study_subject', {
                params: _problems,
                studyMethod: this.props.params.studyMethod,
                progressOrder: this.props.params.progressOrder,
                type: 'sub',
                category: this.props.params.category,
                fromStudyResultHome: this.props.params.fromStudyResultHome ? true : false
            });
        }
        else { //객관식
            if(this.state.arrData.length < 5) {
                showToast("object_word_study_shortage_problem", "error");
                return;
            }
            for(let i = 0; i < this.props.params.problemList.length; i ++) {
                _problems.push({
                    'word_id': this.props.params.problemList[i].word_id,
                    'problem': this.props.params.problemList[i].problem,
                    'correct_index': this.props.params.problemList[i]['id'],
                    'correct_answer': this.props.params.problemList[i]['answer'],
                    'choice': generate(this.props.params.problemList[i]['id'], this.state.arrData.length).map(x => ( {no: x, problem: (this.props.params.studyMethod == 'entoko' ? this.state.arrData[x-1].meaning : this.state.arrData[x-1].word)} ) )
                });
            }
            if(this.props.params.progressOrder != 'sequence') { //단어 진행 순서
                _problems = shuffleArray(_problems);
            }
            Actions.push('word_study_object', {
                params: _problems,
                studyMethod: this.props.params.studyMethod,
                progressOrder: this.props.params.progressOrder,
                type: 'obj',
                category: this.props.params.category,
                fromStudyResultHome: this.props.params.fromStudyResultHome ? true : false
            });
        }
    }
    async resolveWrongProblems() {
        let _problems = [];
        if(this.props.params.type == 'sub') { //주관식
            for(let i = 0; i < this.props.params.problemList.length; i ++) {
                if(this.props.params.problemList[i].result != 'correct')
                    _problems.push({
                        'word_id': this.props.params.problemList[i].word_id,
                        'problem': this.props.params.problemList[i].problem,
                        'answer': this.props.params.problemList[i].answer
                    })
            }
            if(_problems.length < 1) {
                showToast("no_wrong_problems", "error");
                return;
            }
            if(this.props.params.progressOrder != 'sequence') { //단어 진행 순서
                _problems = shuffleArray(_problems);
            }
            Actions.push('word_study_subject', {
                params: _problems,
                studyMethod: this.props.params.studyMethod,
                progressOrder: this.props.params.progressOrder,
                type: 'sub',
                category: this.props.params.category,
                fromStudyResultHome: this.props.params.fromStudyResultHome ? true : false
            });
        }
        else { //객관식
            let hasWrong = false;
            for(let i = 0; i < this.props.params.problemList.length; i ++) {
                if(this.props.params.problemList[i].result != 'correct') {
                    hasWrong = true;
                    break;
                }
            }
            if(!hasWrong) {
                showToast("no_wrong_problems", "error");
                return;
            }
            if(this.state.arrData.length < 5) {
                showToast("object_word_study_shortage_problem", "error");
                return;
            }

            for(let i = 0; i < this.props.params.problemList.length; i ++) {
                if(this.props.params.problemList[i].result != 'correct') {
                    _problems.push({
                        'word_id': this.props.params.problemList[i].word_id,
                        'problem': this.props.params.problemList[i].problem,
                        'correct_index': this.props.params.problemList[i]['id'],
                        'correct_answer': this.props.params.problemList[i]['answer'],
                        'choice': generate(this.props.params.problemList[i]['id'], this.state.arrData.length).map(x => ( {no: x, problem: (this.props.params.studyMethod == 'entoko' ? this.state.arrData[x-1].meaning : this.state.arrData[x-1].word)} ) )
                    });
                }
            }
            if(this.props.params.progressOrder != 'sequence') { //단어 진행 순서
                _problems = shuffleArray(_problems);
            }
            Actions.push('word_study_object', {
                params: _problems,
                studyMethod: this.props.params.studyMethod,
                progressOrder: this.props.params.progressOrder,
                type: 'obj',
                category: this.props.params.category,
                fromStudyResultHome: this.props.params.fromStudyResultHome ? true : false
            });   
        }
    }
    changeFavorite(_id, favorite) {
        let _pb_list = this.state.problemList;
        for(let i = 0; i < _pb_list.length; i ++) {
            if(_pb_list[i]['word_id'] == _id) {
                _pb_list[i]['is_favorite'] = favorite;
                break;
            }
        }
        this.setState({problemList: _pb_list});
    }
    renderTabs() {
        let arrTab = arrTypes.map((item, index) => (
            <Tab key={ index }
                heading={ item.title }
                tabStyle={ tabs.tab }
                activeTabStyle={ tabs.tabItem }
                textStyle={ tabs.text }
                activeTextStyle={ tabs.activeText } >
                <StudyResultsDetailTab
                    parent={ this }
                    typeData={ item }
                    problemList={ this.state.problemList.filter(item1 => item1.result==item.result || item.result == '') }
                    before={ this.props.params.category.before }
                    changeFavorite={(_id, favorite) => { this.changeFavorite(_id, favorite) }}
                />
            </Tab>
        ));

        return (
            <Tabs tabBarBackgroundColor='#F4F4F4'
            tabBarUnderlineStyle={ tabs.tabBarUnderline } 
            renderTabBar={()=> 
                <ScrollableTab 
                tabsContainerStyle={tabs.scrollTabContainerStyle}
                style={tabs.scrollTabStyle} 
                />}
            >
                { arrTab }
            </Tabs>
        );
    }
    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />
                    <View>
                        <View style={{display: 'flex', flexDirection: 'row', backgroundColor: '#68ADED', padding: normalize(12)}}>
                            <View style={{flex: 1}}>
                                <Text style={[fonts.size14, fonts.familyBold, fonts.colorWhite]}>{this.props.params.end_time}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={[fonts.size14, fonts.familyBold, {textAlign: 'right'}, fonts.colorWhite]}>
                                    {this.state.studyResultTitle}
                                </Text>
                            </View>
                        </View>
                        <StudyHeader
                            totalProblems={this.props.params.totalProblems}
                            correctProblems={this.props.params.correctProblems}
                            wrongProblems={this.props.params.wrongProblems}
                            mark={this.props.params.mark}
                            time={this.timeFormat()}
                        />
                        <View style={{height: normalize(20), backgroundColor: '#F4F4F4'}}>
                        </View>
                    </View>
                    { this.renderTabs() }
                    <Spinner_bar color={'#68ADED'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                    <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly',
                                paddingTop: normalize(16),
                                paddingBottom: normalize(8)}}>
                        <Button style={[styles.footerButton]}
                        onPress={()=> {this.resolveAll()}}>
                            <Text style={[fonts.size15, fonts.colorWhite, fonts.familyBold, {textAlign: 'center'}]}>전체</Text>
                            <Text style={[fonts.size15, fonts.colorWhite, fonts.familyBold, {textAlign: 'center'}]}>다시 풀기</Text>
                        </Button>
                        <Button style={[styles.footerButton]}
                        onPress={()=> {this.resolveWrongProblems()}}>
                            <Text style={[fonts.size15, fonts.colorWhite, fonts.familyBold, {textAlign: 'center'}]}>틀린 문제</Text>
                            <Text style={[fonts.size15, fonts.colorWhite, fonts.familyBold, {textAlign: 'center'}]}>다시 풀기</Text>
                        </Button>
                        <Button style={styles.footerButton}
                            onPress={() => {this.finish()}}>
                            <Text style={[fonts.size15, fonts.colorWhite, fonts.familyBold, {textAlign: 'center'}]}>끝내기</Text>
                        </Button>
                        <Button style={[styles.footerButton]}
                        onPress={() => {this.saveAndFinish()}} disabled={this.props.params.disabledStorage}>
                            <Text style={[fonts.size15, fonts.colorWhite, fonts.familyBold, {textAlign: 'center'}]}>학습 내용</Text>
                            <Text style={[fonts.size15, fonts.colorWhite, fonts.familyBold, {textAlign: 'center'}]}>저장후 끝내기</Text>
                        </Button>
                    </View>
            </Container>    
        );
    }
} 

const styles = StyleSheet.create({
    footerButton: {
        width: normalize(152),
        height: normalize(48),
        borderRadius: normalize(12),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: '#2D9CDB',
        marginBottom: normalize(8)
    }
});