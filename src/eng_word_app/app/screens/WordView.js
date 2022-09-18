import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Container, Button } from 'native-base';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { getRecentStudy } from './../utils/RecentStudy';
import { getWordIdListFromMyWord, getWordListFromMyWord } from './../utils/MyWord';
import { getVocabularyData } from './../utils/MyMakingWords';
import { performNetwork } from './../components/shared/global';
import { getWordList } from './../utils/api';
import { fonts, normalize, getScreenWidth } from './../assets/styles';
import UserHeader from './../components/shared/UserHeader';
import ViewHeader from './../components/shared/ViewHeader';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import WordPanel from './../components/shared/WordPanel';
import { setRecentPage } from './../utils/RecentPage';
import {getDataDetail} from './../utils/Category';

let pageTitle = '단어 보기';

export default class WordView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            arrData: [],
            mywordidList: [],
            curPage: 0,
            hideMeaning: false,
            hideExample: false,
            selectedSubject: null,
        };               
    }

    async componentDidMount() {
        try {
            await setRecentPage('word_view', this.props);
            let selectedStudy = await getRecentStudy();
            if(selectedStudy) {
                this.setState({selectedSubject: selectedStudy})           
            }
            this.fetchWordList();    
        }
        catch(err) {
            console.log("WordView err: ", err);
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
        else if(this.props.params.before == 'myword') { //내단어장
            this.setState({loaded: false});
            let _word_list = await getWordListFromMyWord();
            this.setState({arrData: _word_list, loaded: true}); 
        }
        else if(this.props.params.before == 'mymakingword') { //내가 만드는 단어장
            this.setState({loaded: false});
            let _word_list = await getVocabularyData(this.props.params.dictionary_id);
            let _word_id_list = await getWordIdListFromMyWord();
            this.setState({arrData: _word_list, loaded: true, mywordidList: _word_id_list}); 
        }
    }
    changeScreen(e) {
        this.setState({curPage: e});
    }
    favoriteChange(e) {
        if(e.favorite) {
            if(this.state.mywordidList.indexOf(e.id) < 0) {
                let mywordidList = [...this.state.mywordidList];
                mywordidList.push(e.id);
                this.setState({mywordidList});
            }
        }
        else {
            let _index = this.state.mywordidList.indexOf(e.id);
            if(_index >= 0) {
                let mywordidList = [...this.state.mywordidList];
                mywordidList.splice(_index, 1);
                this.setState({mywordidList});
            }
        }
    }
    render() {
        return (
            <Container style={{flex: 1}}>
                <UserHeader title={pageTitle} />
                {
                    <ViewHeader 
                        myword={this.props.params.before=='myword' ? true : false}
                        currentNo={this.state.curPage + 1} 
                        currentId={this.state.arrData.length > 0 ? this.state.arrData[this.state.curPage].id : 0}
                        totalCount={this.state.arrData ? this.state.arrData.length : 0} title={this.state.selectedSubject ? this.state.selectedSubject.selectedName : ''}
                        currentItem={this.state.arrData && this.state.arrData.length > 0 ? this.state.arrData[this.state.curPage] : null}
                        ellipsis={true}
                        star={
                            this.state.arrData.length == 0 ? false
                            :
                            (this.state.mywordidList.indexOf(this.state.arrData[this.state.curPage].id) >= 0 ? true : false)
                        }
                        favoriteChange={(e) => {
                            this.favoriteChange(e);
                        }}
                    />
                }
                <View style={[styles.container]}>
                {   
                    <SwiperFlatList
                        disableVirtualization={false}
                        onChangeIndex={(e)=>{
                                this.changeScreen(e.index)
                        }}
                        data={this.state.arrData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <WordPanel
                            params = {item}
                            hideMeaning = {this.state.hideMeaning}
                            hideExample = {this.state.hideExample}
                            changeHideMeaning={(e) => { this.setState({hideMeaning: e}) }}
                            changeHideExample={(e) => { this.setState({hideExample: e}) }}
                            disableGesture={true}
                            />
                        )}  
                        removeClippedSubviews={true}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                    />
                }
                    <Spinner_bar color={'#68ADED'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                </View>

                {
                    this.state.arrData != null && this.state.arrData.length > 0 ?
                    <View style={{backgroundColor: '#E4E4E4', paddingVertical: normalize(12)}}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: normalize(16) }}>
                            <Button style={styles.footerButton}
                            onPress={() => this.setState({hideMeaning: !this.state.hideMeaning})}>
                                <Text style={[fonts.size14, fonts.familyRegular]}>
                                    {
                                        this.state.hideMeaning ? '단어 뜻 보기' : '단어 뜻 가리기'
                                    }
                                    
                                </Text>
                            </Button>
                            <Button style={styles.footerButton} disabled={this.props.params.before == 'mymakingword'}
                            onPress={() => this.setState({hideExample: !this.state.hideExample})}>
                                <Text style={[fonts.size14, fonts.familyRegular]}>
                                    {
                                        this.state.hideExample ? '예문 해석 보기 ' : '예문 해석 가리기 '
                                    }
                                </Text>
                            </Button>
                        </View>
                    </View>   
                    : null
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E4E4E4',
    },
    footerButton: {
        width: (getScreenWidth() - normalize(48)) / 2,
        height: normalize(44),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: normalize(12),
        borderColor: '#EB5757',
        borderWidth: 1,     
    }
});