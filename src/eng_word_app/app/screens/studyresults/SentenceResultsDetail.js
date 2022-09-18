import React from 'react';
import { StyleSheet, View, Text, BackHandler } from 'react-native';
import { Container, Button, Tab, Tabs, ScrollableTab } from 'native-base';
import UserHeader from './../../components/shared/UserHeader';
import StudyHeader from './../../components/studyresults/StudyHeader';
import StudyResultsDetailTab from './StudyResultsDetailTab';
import { fonts, normalize, tabs } from './../../assets/styles';
import { Actions } from 'react-native-router-flux';
import { getRecentStudy } from './../../utils/RecentStudy';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { shuffleArray, showToast, generateStudyResultId } from './../../components/shared/global';
import { addToStudyResults } from './../../utils/StudyResults';
import Orientation from 'react-native-orientation';
import { setRecentPage } from './../../utils/RecentPage';

let pageTitle = '학습 결과';
let arrTypes = [
    { id: 0, title: '전체', result: '' }, 
    { id: 1, title: '정답', result: true }, 
    { id: 2, title: '오답', result: false }      
];

export default class SentenceResultsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            studyResultTitle: '중1 비상 (홍민표) 3과',
            page: 'SentenceResultsDetail',
            problemList: this.props.params.problemList
        }
    }
    async componentDidMount() {
        try {
            await setRecentPage('sentence_results_detail', this.props);
            if(this.props.params.category.before == 'detail') {
                let selectedStudy = await getRecentStudy();
                if(selectedStudy) {
                    this.setState({studyResultTitle: selectedStudy.selectedName})
                }
            }
            else if(this.props.params.category.before == 'mysentence') {
                this.setState({studyResultTitle: '내문장'});       
            }
            BackHandler.addEventListener("hardwareBackPress", this.backHardwareAction);        
        }
        catch(err) {
            console.log("SentenceResultsDetail err: ", err);
        }
    }
    UNSAFE_componentWillReceiveProps() {
        BackHandler.addEventListener("hardwareBackPress", this.backHardwareAction);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backHardwareAction);
    }
    backHardwareAction = () => {
        if(!this.props.params.disabledStorage 
            && this.state.page
            && this.state.page == 'SentenceResultsDetail' ) {
            Orientation.lockToLandscape();
            setTimeout(() => {
                Actions.refresh();
            }, 300);
        }
    };
    async saveAndFinish() {
        this.setState({loaded: false});
        await addToStudyResults({
            "id": generateStudyResultId(),
            "totalProblems": this.props.params.totalProblems, //총문제
            "correctProblems": this.props.params.correctProblems, //정답 
            "wrongProblems": this.props.params.wrongProblems, //오답
            "mark": this.props.params.mark,
            "problemList": this.state.problemList,
            "end_time": this.props.params.end_time,

            "random": this.props.params.random,
            "category": this.props.params.category,
            "categoryTitle": this.state.studyResultTitle,
            "classify": "sentence"
        });
        this.setState({loaded: true});
        Actions.replace('study_results_home');
    }
    finish() {
        if(this.props.params.fromStudyResultHome) {
            Actions.replace('study_results_home');
        }
        else {
            if(this.props.params.category.before == 'detail') {
                Actions.popTo('detail');
            }
            if(this.props.params.category.before == 'mysentence') {
                Actions.popTo('my_sentence_home');
            }
        }
    }
    resolveAll() {
        if(this.props.params.random) {

            BackHandler.removeEventListener("hardwareBackPress", this.backHardwareAction);

            Actions.push("sentence_study", {
                sentenceList: shuffleArray(this.state.problemList),
                category: this.props.params.category,
                random: true,
                fromStudyResultHome: this.props.params.fromStudyResultHome ? true : false
            })
        }
        else {

            BackHandler.removeEventListener("hardwareBackPress", this.backHardwareAction);

            Actions.push("sentence_study", {
                sentenceList: this.state.problemList,
                category: this.props.params.category,
                random: false,
                fromStudyResultHome: this.props.params.fromStudyResultHome ? true : false
            })
        }
    }
    resolveWrongProblems() {
        let _problem_list = this.state.problemList.filter(item1 => item1.correct==false);
        if(_problem_list.length < 1) {
            showToast("no_wrong_problems", "error");
            return;
        }
        if(this.props.params.random) {

            BackHandler.removeEventListener("hardwareBackPress", this.backHardwareAction);

            Actions.push("sentence_study", {
                sentenceList: shuffleArray(_problem_list),
                category: this.props.params.category,
                random: true,
                fromStudyResultHome: this.props.params.fromStudyResultHome ? true : false
            })
        }
        else {

            BackHandler.removeEventListener("hardwareBackPress", this.backHardwareAction);

            Actions.push("sentence_study", {
                sentenceList: _problem_list,
                category: this.props.params.category,
                random: false,
                fromStudyResultHome: this.props.params.fromStudyResultHome ? true : false           
            })
        }
    }
    changeFavorite(_id, favorite) {
        let _pb_list = this.state.problemList;
        for(let i = 0; i < _pb_list.length; i ++) {
            if(_pb_list[i]['id'] == _id) {
                _pb_list[i]['isFavorite'] = favorite;

                console.log("changeFavorite===>", _pb_list[i]);

                break;
            }
        }
        this.setState({problemList: _pb_list});
    }
    renderTabs() {
        let arrTab = arrTypes.map((item, index) => (
            <Tab key = {index}
                heading={ item.title }
                tabStyle={ tabs.tab }           
                activeTabStyle={ tabs.tabItem }
                textStyle={ tabs.text }
                activeTextStyle={ tabs.activeText } >
                <StudyResultsDetailTab
                    problemList={ this.state.problemList.filter(item1 => item1.correct==item.result || item.result === '') }
                    before={ this.props.params.category.before }
                    isSentence
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
                <UserHeader 
                    title={pageTitle} 
                    fromResultHome={this.props.params.disabledStorage ? true : false}
                    sentenceResultsDetail  />
                <View>
                    <View style={{display: 'flex', flexDirection: 'row', backgroundColor: '#68ADED', padding: normalize(12)}}>
                        <View style={{flex: 1}}>
                            <Text style={[fonts.size14, fonts.familyBold, fonts.colorWhite]}>
                                { this.props.params.end_time }
                            </Text>
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
                        time=""
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
        )
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



