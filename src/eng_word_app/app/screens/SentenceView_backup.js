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
import { showToast } from '../components/shared/global';

import { setRecentPage } from '../utils/RecentPage';

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
                if(response == null) { return; }
                let _id_list = await getSentenceIdListFromMySentenceView(), flag = true;
                for(let i = 0; i < response.length; i ++) {
                    if(_id_list.indexOf(response[i]['id']) >= 0) {
                        response[i]['is_favorite'] = true;
                    }
                    else {
                        response[i]['is_favorite'] = false;
                        flag = false;
                    }
                }
                if(flag) {
                    this.setState({allSelected: true});
                }
                this.setState({arrData: response});
            });
        }
        else { //내 문장
            this.setState({loaded: false});
            let _sen_list = await getSentenceListFromMySentenceView();
            this.setState({arrData: _sen_list, loaded: true});
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

    async addAllToFavorite() {
        try {
            let _arrData = this.state.arrData;
            let _allSelected = this.state.allSelected;
            this.setState({allSelected: !this.state.allSelected, loaded: false});

            if(!_allSelected) { // true
                await addListToMySentenceView(_arrData);
                showToast("add_to_mysentence", "success");
            }
            else { // false
                await removeListFromMySentenceView(_arrData);
                showToast("remove_from_mysentence", "success");
                
            }
            for(let i = 0; i < _arrData.length; i ++)
                    _arrData[i]['is_favorite'] = !_allSelected;
            this.setState({loaded: true, arrData: _arrData});
        }
        catch(err) {
            console.log("allAddToFavorite => ", err);
        }
    }

    async setItemFavorite(index, flag, item) {
        if(flag) {
            if( await addToMySentenceView(item) ) {
                showToast("add_to_mysentence", "success");
            }
        }
        else {
            if( await removeFromMySentenceView(item) ) {
                showToast("remove_from_mysentence", "success");
            }
        }
        let _arrData = this.state.arrData;
        _arrData[index - 1]['is_favorite'] = flag;
        this.setState({arrData: _arrData});

        let selectedAll = true;
        for(let i = 0; i < _arrData.length; i ++) {
            if(!_arrData[i]['is_favorite']) {
                selectedAll = false;
                break;
            }
        }
        this.setState({allSelected: selectedAll});
    }

    render() {
        return (
            <Container>
                <UserHeader title={pageTitle} />
                <ViewHeader currentNo={this.state.curIndex + 1} totalCount={this.state.arrData.length} title={this.state.selectedSubject ? this.state.selectedSubject.selectedName : ''} ellipsis={true} sentence />
                <View style={{paddingHorizontal: normalize(16), paddingTop: normalize(12), paddingBottom: normalize(12)}}>
                {
                    this.props.params.before=='detail' ?
                    <View style={{display: 'flex', flexDirection: 'row', position: 'relative'}}>
                        <TouchableOpacity activeOpacity={0.6} style={{position: 'absolute', paddingTop: normalize(6),
                        zIndex: 10000}}
                        onPress={ () => { this.addAllToFavorite() } }>
                            <Icon name='star' type='antdesign' 
                            color={this.state.allSelected ? "#F2C94C" : 'rgba(0,0,0,0.2)'} />
                        </TouchableOpacity>

                        <Text style={[styles.sentenceSection, fonts.familyRegular]}>
                                    {"      전체 별표"}
                        </Text> 
                    </View>
                    : 
                    null
                }
                </View>
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
                            star={item.is_favorite}
                            starShow={this.props.params.before=='detail'?true:false}
                            sentenceShow={this.state.sentenceShow}
                            meaningShow={this.state.meaningShow}
                            wordShow={this.state.wordShow}
                            triggerFavorite={(index, flag, item) => { this.setItemFavorite(index, flag, item) }}
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