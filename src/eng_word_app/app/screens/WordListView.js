import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Container } from 'native-base';
import UserHeader from './../components/shared/UserHeader';
import SubHeader from './../components/shared/SubHeader';
import WordListItem from './../components/shared/WordListItem';
import { normalize } from './../assets/styles';
import { getWordList } from './../utils/api';
import { performNetwork } from './../components/shared/global';
import { getWordIdListFromMyWord } from './../utils/MyWord';
import { getRecentStudy } from './../utils/RecentStudy';
import { getVocabularyData } from './../utils/MyMakingWords';

import { setRecentPage } from './../utils/RecentPage';

import Spinner_bar from 'react-native-loading-spinner-overlay';
import {getDataDetail} from './../utils/Category';

let pageTitle = '단어목록보기';

export default class WordListView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            serverRespond: false,
            arrData: [],
            wordShow: true,
            meaningShow: true,
            mywordidList: [],
            selectedSubject: null
        };        
    }
    async componentDidMount() {
        try {
            await setRecentPage('word_list_view', this.props);
            let selectedStudy = await getRecentStudy();
            if(selectedStudy) {
                this.setState({selectedSubject: selectedStudy})
            }
            this.fetchWordList();
        }
        catch(err) {
            console.log("WordListView err: ", err);
        }
    }

    async fetchWordList() {
        if(this.props.params.before == 'detail') { //디테일 페이지에서 접속하는 경우
            performNetwork(this, getWordList(this.props.params.category_id)).then(async (response) => {
                if(response == null) { 
                    let _word_list = await getDataDetail(this.props.params.category_id, 'word_list');
                    this.setState({arrData: _word_list});    
                    return; 
                }
                this.setState({arrData: response});
            });
            let _word_id_list = await getWordIdListFromMyWord();
            this.setState({mywordidList: _word_id_list});
        }
        else if(this.props.params.before == 'mymakingword') { //내가 만드는 단어장
            this.setState({loaded: false});
            let _word_list = await getVocabularyData(this.props.params.dictionary_id);
            let _word_id_list = await getWordIdListFromMyWord();
            this.setState({arrData: _word_list, loaded: true, mywordidList: _word_id_list}); 
        }
    }

    onChangeMeaning(e)  {
        this.setState({meaningShow: e});
    }

    onChangeWord(e) {
        this.setState({wordShow: e});
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} wordList
                triggerMeaning={(e) => { this.onChangeMeaning(e) }}
                triggerWord={(e) => { this.onChangeWord(e) }} />
                <SubHeader ellipsis={true} title={this.state.selectedSubject ? this.state.selectedSubject.selectedName : ''} />
                <FlatList
                    style={styles.container}
                    data={this.state.arrData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <WordListItem 
                        currentNo={index + 1} 
                        totalCount={this.state.arrData.length}
                        word={item.word}
                        meaning={item.meaning}
                        wordShow={this.state.wordShow}
                        meaningShow={this.state.meaningShow}
                        param={item}
                        star={this.state.mywordidList.indexOf(item.id) >= 0 ? true : false} />            
                )}
                    ListFooterComponent={
                        <>
                        <View style={{height: normalize(120)}}></View>
                        <Spinner_bar color={'#68ADED'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                        </>
                    }
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});