import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Container, Button } from 'native-base';
import UserHeader from '../components/shared/UserHeader';
import ViewHeader from '../components/shared/ViewHeader';
import SentenceViewItem from '../components/shared/SentenceViewItem';
import { fonts, normalize } from '../assets/styles';
import { Icon } from 'react-native-elements';
import { performNetwork } from '../components/shared/global';
import { getSentenceViewList } from '../utils/api';
import { getSentenceListFromMySentenceView, getSentenceIdListFromMySentenceView,
    addListToMySentenceView,  removeListFromMySentenceView,
    addToMySentenceView, removeFromMySentenceView } from '../utils/MySentenceView';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {Actions} from 'react-native-router-flux';
import Orientation from 'react-native-orientation';
import { getRecentStudy } from '../utils/RecentStudy';
import { showToast } from './../components/shared/global';

import { setRecentPage } from './../utils/RecentPage';
import {getDataDetail} from './../utils/Category';

let pageTitle = '문장 보기';

export default class SentenceView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            serverRespond: false,
            arrData: [],
            mysentenceidList: [],
            curIndex: 0,
            selectedSubject: null,
            sentenceShow: true,
            meaningShow: true,
            wordShow: true,
            allSelected: false
        };
    }

    async componentDidMount() {
        try {
            await setRecentPage('sentence_view', this.props);
            Orientation.lockToPortrait();
            let selectedStudy = await getRecentStudy();
            if(selectedStudy) {
                this.setState({selectedSubject: selectedStudy})
            }
            this.fetchSentenceList();
        }
        catch(err) {
            console.log("SentenceView err: ", err);
        }
    }

    async fetchSentenceList() {
        if(this.props.params.before != 'mysentence') {
            performNetwork(this, getSentenceViewList(this.props.params.category_id)).then(async (response) => {
                if(response == null) { 
                    let _sentence_list = await getDataDetail(this.props.params.category_id, 'sentence_view');
                    this.setState({arrData: _sentence_list});
                    return; 
                }
                this.setState({arrData: response});
            });
        }
        else { //내 문장
            this.setState({arrData: []});
        }
    }

    studySetence() {
        let temp = [this.state.arrData[this.state.curIndex]]
        Actions.push("sentence_study", {sentenceList: temp})
    }

    studyAllSetence() {
        Actions.push("sentence_study", {sentenceList: this.state.arrData})
    }

    hideWord() {
        this.setState({wordShow: !this.state.wordShow});
    }

    sentenceHide() {
        if(!(this.state.sentenceShow && !this.state.meaningShow) ) {
            this.setState({sentenceShow: !this.state.sentenceShow});
        }
    }

    hideMeaning() {
        if( !(this.state.meaningShow && !this.state.sentenceShow) ) {
            this.setState({meaningShow: !this.state.meaningShow}); 
        }
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />
                <ViewHeader currentNo={this.state.curIndex + 1} totalCount={this.state.arrData.length} title={this.state.selectedSubject ? this.state.selectedSubject.selectedName : ''} ellipsis={true} sentence />
                
                {
                    <FlatList
                        style={[styles.container, {paddingHorizontal: normalize(0)}]}
                        data={this.state.arrData}
                        keyExtractor={(item) => item.id}
                        renderItem={ ({item, index}) => (
                            <SentenceViewItem currentNo={index + 1} 
                            english={item.sentence}
                            korean={item.meaning}
                            param={item}
                            sentenceShow={this.state.sentenceShow}
                            meaningShow={this.state.meaningShow}
                            wordShow={this.state.wordShow}
                             />
                        )}
                        ListFooterComponent={
                            <>
                            <View style={{ height: normalize(40) }}></View>
                            <Spinner_bar color={'#68ADED'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                            </>    
                        }
                    />
                }

                <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', 
                            justifyContent: 'space-evenly',
                            paddingTop: normalize(12), paddingBottom: normalize(4)}}>
                    <Button style={styles.footerButton}
                    onPress={() => {this.hideWord()}}>
                        <Text style={[fonts.size14, fonts.colorWhite, fonts.familyBold]}>
                            {this.state.wordShow ? "단어가리기" : "단어보기"}
                        </Text>
                    </Button>
                    <Button style={styles.footerButton}
                    onPress={() => {this.sentenceHide()}}>
                        <Text style={[fonts.size14, fonts.colorWhite, fonts.familyBold]}>
                            {this.state.sentenceShow ? "문장가리기" : "문장보기"}
                        </Text>
                    </Button>
                    <Button style={styles.footerButton}
                    onPress={() => {this.hideMeaning()}}>
                        <Text style={[fonts.size14, fonts.colorWhite, fonts.familyBold]}>
                            {this.state.meaningShow ? "해석가리기" : "해석보기"}
                        </Text>
                    </Button>
                </View>
            </Container>
        );
    }   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    footerButton: {
        width: normalize(90),
        height: normalize(44),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#1BA3E5',
        borderRadius: normalize(27),
        marginBottom: normalize(8),
        marginHorizontal: normalize(2)
    },
    sentenceSection: {
        fontSize: normalize(15),
        lineHeight: normalize(30)
    }
})