import React from 'react';
import { StyleSheet, FlatList, Alert } from 'react-native';
import { Container } from 'native-base';
import { normalize } from './../../assets/styles';
import UserHeader from './../../components/shared/UserHeader';
import SubHeader from './../../components/shared/SubHeader';
import MyWordListItem from './../../components/myword/MyWordListItem';
import { getWordListFromMyWord, removeIdListFromMyWord, exchange } from './../../utils/MyWord';
import { setRecentPage } from './../../utils/RecentPage';
import Spinner_bar from 'react-native-loading-spinner-overlay';

let pageTitle = '단어목록보기';

export default class MyWordListView extends React.Component {
    constructor(props){       
        super(props);
        this.state = {
            loaded: true,
            arrData: [],
            allChecked: false,
            wordShow: true,
            meaningShow: true,
        }
    }
    async componentDidMount()    {
        try {
            await setRecentPage('my_word_list_view', this.props);
            this.setState({loaded: false});
            let _word_list = await getWordListFromMyWord();
            this.setState({arrData: _word_list, loaded: true});      
        }
        catch(err) {
            console.log("MyWordListView err: ", err);
        }
    }
    onChangeMeaning(e)  {
        this.setState({meaningShow: e});
    }
    onChangeWord(e) {
        this.setState({wordShow: e});
    }
    removeMethod() {
        let checkedIdList = [];
        for(let i = 0; i < this.state.arrData.length; i ++)
            if(this.state.arrData[i]['checked'])
                checkedIdList.push(this.state.arrData[i]['id']);
        if(checkedIdList.length == 0)
            return;
        Alert.alert("선택한 단어들을 삭제하시겠습니까?", "", 
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                { text: "삭제", onPress: () => this.removeProcess(checkedIdList) }
            ],
            { cancelable: false }
        )
    }
    async removeProcess(checkedIdList) {
        this.setState({loaded: false});
        await removeIdListFromMyWord(checkedIdList);
        let _word_list = await getWordListFromMyWord();
        this.setState({arrData: _word_list, loaded: true});
    } 
    clickAllChecked(e) {
        let temp = this.state.arrData;
        if(temp && temp.length > 0) {
            temp.map((item, index) => {
                if(e)
                    temp[index]['checked'] = true;
                else
                    temp[index]['checked'] = false;
            });
            this.setState({arrData: temp, allChecked: e});
        }
    }
    async doSwap(index) {
        this.setState({loaded: false});
        if(index < this.state.arrData.length - 1) {
            let _arrData = this.state.arrData;
            let _temp = _arrData[index + 1];
            _arrData[index + 1] = _arrData[index];
            _arrData[index] = _temp;
            this.setState({arrData: _arrData});      
        }
        else {
            let _arrData = this.state.arrData;
            let _temp = _arrData[index - 1];
            _arrData[index - 1] = _arrData[index];
            _arrData[index] = _temp;
            this.setState({arrData: _arrData});
        }
        await exchange(index);
        this.setState({loaded: true});
    }
    changeCheckList(status, index) {
        let temp = this.state.arrData;
        temp[index]['checked'] = status;
        this.setState({arrData: temp});
        let allChecked = true;
        temp.map((item, index) => {
            if(!item.checked)
                allChecked = false
        });
        this.setState({allChecked: allChecked})
    }
    render()    {
        return (
            <Container>
                <UserHeader
                    title={pageTitle} wordList favorite
                    triggerMeaning={(e) => { this.onChangeMeaning(e) }}
                    triggerWord={(e) => { this.onChangeWord(e) }}
                    triggerRemove={() => { this.removeMethod() }}            
                />
                <SubHeader title="" favorite 
                onPress={(e) => { this.clickAllChecked(e) }}
                allChecked={this.state.allChecked} />
                <FlatList
                    data={this.state.arrData}
                    keyExtractor={(item) => item.id}
                    renderItem={
                        ({item, index}) => (
                            <MyWordListItem
                                numberOfWords={this.state.arrData.length}
                                currentNo={index + 1}
                                word={item.word}
                                meaning={item.meaning}
                                wordShow={this.state.wordShow}
                                meaningShow={this.state.meaningShow}
                                checked={item.checked ? true : false}
                                onClick={(e) => { this.changeCheckList(e, index) }}     
                            />
                        )
                    }
                />
                <Spinner_bar color={'#68ADED'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
            </Container>     
        );
    }
}

const styles = StyleSheet.create({
    swapIcon: {
        transform: [{ rotate: '90deg' }]
    },
    swapIconContainer: {
        width: normalize(24), height: normalize(24),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: normalize(24),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 4
    }
});