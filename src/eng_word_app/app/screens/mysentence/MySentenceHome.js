import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableHighlight} from 'react-native';
import { Container, Content } from 'native-base';
import Images from './../../assets/Images';
import { fonts } from '../../assets/styles';
import {Actions} from 'react-native-router-flux';
import { setRecentPage } from './../../utils/RecentPage';

export default class MySentenceHome extends React.Component {
    constructor(props){
        super(props);
    }
    buttonClick() {
    }
    async componentDidMount() {
        try {
            await setRecentPage('my_sentence_home', this.props);
        }
        catch(err) {
            console.log("MySentenceHome componentDidMount err: ", err);
        }
    }
    sentenceView() {
        Actions.push('sentence_view',
            { params: {   category_id: 0, 
                            before: 'mysentence'}});
    }
    viewSentenceStudy() {
        Actions.push('sentence_study_init', 
            { params: {   category_id: 0, 
                            before: 'mysentence'}});
    }
    render() {
        return (
            <Container>
                <Content contentContainerStyle={styles.container}>
                    <ImageBackground source={Images.backImg} style={styles.backImg} resizeMode='cover'>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: "wrap"}}>
                            {
                                /*
                                <TouchableHighlight style={[styles.item, {marginRight: 16}]} onPress={ () => { this.sentenceView() } } activeOpacity={0.6}>
                                    <ImageBackground source={Images.sen_view} resizeMode='cover' style={{flex: 1}}
                                        imageStyle={styles.itemImg}>
                                        <View style={{flex: 1, position: 'relative'}}>
                                            <View style={styles.labelContainer}>
                                                <Text style={[fonts.size13, fonts.familyBold, fonts.colorWhite]}>문장보기</Text>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </TouchableHighlight>
                                */
                            }
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
        flex: 1,
        justifyContent: 'center'
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
    }
});