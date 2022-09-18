import React from 'react';
import { Dimensions, StyleSheet, View, Text, ImageBackground, TouchableHighlight, ScrollView} from 'react-native';
import { Container, Content } from 'native-base';
import Images from './../../assets/Images';
import { fonts } from '../../assets/styles';
import { Icon } from 'react-native-elements';
import UserHeader from './../../components/shared/UserHeader';
import { performNetwork } from './../../components/shared/global';
import { getVideoList } from './../../utils/api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {YouTubeStandaloneAndroid} from 'react-native-youtube';
import {Actions} from 'react-native-router-flux';
import { setRecentPage } from './../../utils/RecentPage';
import {getDataDetail} from './../../utils/Category';

export default class Detail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            serverRespond: false,
            arrData: [],
            viewWidth: 0
        };
    }
    buttonClick() {
    }
    videoPlay(video_id) {
        YouTubeStandaloneAndroid.playVideo({
            apiKey: 'AIzaSyDkhRxknAjR8E5Z6ap8meduQCj1Tgzcgus', // Your YouTube Developer API Key
            videoId: video_id, // YouTube video ID
            autoplay: true, // Autoplay the video
            startTime: 0, // Starting point of video (in seconds)
          })
        .then(() => console.log('Standalone Player Exited'))
        .catch(errorMessage => console.error(errorMessage));
    }
    async componentDidMount() {
        try {
            await setRecentPage('detail', this.props);
            this.setState({ viewWidth: Math.round(Dimensions.get('window').width) });
            this.fetchVideoList();
        }
        catch(err) {
            console.log("Detail mounted err: ", err);
        }
    }
    fetchVideoList() {
        performNetwork(this, getVideoList(this.props.params.category_id)).then(async (response) => {
            if (response == null) { 
                let _video_list = await getDataDetail(this.props.params.category_id, 'video_list');
                this.setState({arrData: _video_list});
                return; 
            }
            this.setState({arrData: response});
        });
    }
    viewWordList() { // 단어목록보기
        Actions.push('word_list_view', 
            { params: {   category_id: this.props.params.category_id, 
                            before: 'detail'}});
    }

    viewWord() { // 단어보기
        Actions.push('word_view',
        { params: {   category_id: this.props.params.category_id, 
                        before: 'detail'}});
    } 
    
    viewSentenceStudy() { // 문장학습 init 이행
        Actions.push('sentence_study_init', 
            { params: {   category_id: this.props.params.category_id, 
                            before: 'detail'}});
    }
    viewSentenceList() { // 문장 보기 기능
        Actions.push('sentence_view',
            { params: {   category_id: this.props.params.category_id, 
                            before: 'detail'}});
    }
    wordStudyView() { // 단어학습
        Actions.push('word_study_init', 
        { params: {   category_id: this.props.params.category_id, 
            before: 'detail'}});
    }
    renderVideos() {
        return (
            <View>
            {
                this.state.arrData == null || this.state.arrData.length == 0 ? null :
                    this.state.arrData.map((item, index) => (
                        <TouchableHighlight
                        onPress={ () => { this.videoPlay(item.video_id) } }
                        key={index}
                        style={{marginHorizontal: 24, height: 48, 
                            marginTop: (index == 0 ? 29 : 10), borderRadius: 4, }}>
                            <View style={{
                                borderRadius: 4,
                                height: 48, 
                                backgroundColor: 'white', 
                                flexDirection: 'row', alignItems: 'center', display: 'flex', paddingRight: 12}}>
                                    <View style={{flex: 2}}>
                                        <Icon color='#EB5757' name='sc-youtube' type='evilicon' size={36} iconStyle={{margin: 0}} />
                                    </View>
                                    <View style={{flex: 10, paddingRight: 9}}>
                                        <Text numberOfLines={1} style={[fonts.size13, fonts.familyBold]}>{item.name}</Text>
                                    </View>
                            </View>
                        </TouchableHighlight>
                    ))
            }
            <Spinner_bar color={'#68ADED'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
            </View>
        )
    }
    render() {
        return (
            <Container>
                <UserHeader title={this.props.params.title} theme="dark" />
                <Content contentContainerStyle={styles.container}>
                    <ImageBackground source={Images.backImg} style={styles.backImg} resizeMode='cover'>
                        <ScrollView>
                            <View style={{paddingVertical: 34}}>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: "wrap"}}>
                                    <TouchableHighlight style={[styles.item, {marginRight: 11}]} onPress={ () => { this.viewWord() } } activeOpacity={0.6}>
                                        <ImageBackground source={Images.wordView} resizeMode='cover' style={{flex: 1}}
                                            imageStyle={styles.itemImg}>
                                            <View style={{flex: 1, position: 'relative'}}>
                                                <View style={styles.labelContainer}>
                                                    <Text style={[fonts.size13, fonts.familyBold, fonts.colorWhite]}>단어보기</Text>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </TouchableHighlight>

                                    <TouchableHighlight style={[styles.item, {marginRight: 11}]} onPress={ () => { this.viewWordList() } } activeOpacity={0.6}>
                                        <ImageBackground source={Images.wordListView} resizeMode='cover' style={{flex: 1}}
                                            imageStyle={styles.itemImg}>
                                            <View style={{flex: 1, position: 'relative'}}>
                                                <View style={styles.labelContainer}>
                                                    <Text style={[fonts.size13, fonts.familyBold, fonts.colorWhite]}>단어목록보기</Text>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </TouchableHighlight>

                                    <TouchableHighlight style={styles.item} onPress={ () => { this.buttonClick() } } activeOpacity={0.6}
                                                                                                onPress={ () => { this.wordStudyView() } }>
                                        <ImageBackground source={Images.wordStudy} resizeMode='cover' style={{flex: 1}}
                                            imageStyle={styles.itemImg}>
                                            <View style={{flex: 1, position: 'relative'}}>
                                                <View style={styles.labelContainer}>
                                                    <Text style={[fonts.size13, fonts.familyBold, fonts.colorWhite]}>단어학습</Text>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </TouchableHighlight>
                                </View>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: "wrap", marginTop: 23}}>
                                    <TouchableHighlight style={[styles.item, {marginRight: 16}]} onPress={ () => { this.viewSentenceList() } } activeOpacity={0.6}>
                                        <ImageBackground source={Images.sen_view} resizeMode='cover' style={{flex: 1}}
                                            imageStyle={styles.itemImg}>
                                            <View style={{flex: 1, position: 'relative'}}>
                                                <View style={styles.labelContainer}>
                                                    <Text style={[fonts.size13, fonts.familyBold, fonts.colorWhite]}>문장보기</Text>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </TouchableHighlight>

                                    <TouchableHighlight style={[styles.item]} onPress={ () => { this.viewSentenceStudy() } } activeOpacity={0.6}>
                                        <ImageBackground source={Images.sen_study} resizeMode='cover' style={{flex: 1}}
                                            imageStyle={styles.itemImg}>
                                            <View style={{flex: 1, position: 'relative'}}>
                                                <View style={styles.labelContainer}>
                                                    <Text style={[fonts.size13, fonts.familyBold, fonts.colorWhite]}>문장학습</Text>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </TouchableHighlight>    
                                </View>
                                {this.renderVideos()}
                            </View>
                        </ScrollView>
                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    backImg: {
        flex: 1
    },
    itemImg: {
        borderRadius: 8
    },
    item: {
        height: 152,
        width: 102,
        borderRadius: 8
    },
    labelContainer: {
        backgroundColor: 'rgba(0,0,0, 0.6)',
        position: 'absolute',
        width: '100%',
        height: 43,
        bottom: 0,
        alignItems: 'center', justifyContent:'center',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    editItem: {
        backgroundColor: 'white',
        shadowColor: 'rgba(0,0,0,0.15)',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        
        elevation: 10,
        borderRadius: 4,

        width: 24,
        height: 24,
        alignItems: 'center', justifyContent: 'center'
    }
});