import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { fonts, normalize } from './../../assets/styles';
import { Icon } from 'react-native-elements';
import { addToMyWord, removeFromMyWord } from './../../utils/MyWord';
import WordSpeech from './../../components/shared/WordSpeech';
import { showToast } from './../shared/global';
import rnTextSize, { TSFontSpecs } from 'react-native-text-size'

export default class WordListItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            marqueeWordDisable: true,
            marqueeMeaningDisable: true,
            isFavorite: this.props.star,
            engWordFontSize: { fontSize: normalize(18), lineHeight: normalize(19) }
        }
    }

    async componentDidMount() {
        let width = (Dimensions.get('window').width - normalize(12)) * 0.4 - normalize(8);
        let fontSpecs = {
            fontFamily: 'Malgun-Gothic-Bold',
            fontSize : normalize(22)
        };
        let size = await rnTextSize.measure({
            text: this.props.word,
            width: width,
            ...fontSpecs
        });

        if(size['lineCount'] == 2) {
            this.setState({engWordFontSize: { fontSize: normalize(15), lineHeight: normalize(16) }});
        }
        if(size['lineCount'] == 3) {
            this.setState({engWordFontSize: { fontSize: normalize(10), lineHeight: normalize(11) }});
        }
    }

    async addToFavorite() {
        let _isFavorite = this.state.isFavorite;
        this.setState({isFavorite: !this.state.isFavorite});
        if(!_isFavorite) {
            if( await addToMyWord(this.props.param) ) {
                showToast("add_to_myword", "success");
            }
        }
        else {
            if( await removeFromMyWord(this.props.param) ) {
                showToast("remove_from_myword", "success");
            }
        }
    }
    render() {
        return (
            <View style={styles.wordListItem}>
                <View style={{flex: 1}}>
                    <TouchableOpacity activeOpacity={0.6} style={{alignItems: 'center'}}
                    onPress={ () => { this.addToFavorite() } }>
                        <Icon name='star' size={20} type='antdesign' color={this.state.isFavorite ? '#F2C94C' : 'rgba(0,0,0,0.2)'} />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 4, position: 'relative', justifyContent: 'center', height: normalize(64)}}>
                    <View style={{position: 'absolute', left: normalize(4), top: normalize(8)}}>
                        <Text style={[fonts.size10, fonts.familyBold]}>{this.props.currentNo} / {this.props.totalCount}</Text>
                    </View>
                    {
                        this.props.wordShow ? 
                            <TouchableOpacity activeOpacity={0.6} style={{paddingLeft: normalize(4), paddingRight: normalize(4) }}
                        onPress={ () => { this.setState({marqueeWordDisable: !this.state.marqueeWordDisable}) }}>
                                <Text style={[this.state.engWordFontSize, fonts.familyBold]}>{this.props.word}</Text>
                            </TouchableOpacity>
                        :
                        <View style={{paddingLeft: normalize(4), paddingRight: normalize(4) }}>
                        </View>
                    }
                </View>
                <View style={{flex: 4}}>
                    {
                        this.props.meaningShow ? 
                            <TouchableOpacity activeOpacity={0.6} style={{paddingRight: normalize(4), paddingLeft: normalize(4)}}
                        onPress={ () => { this.setState({marqueeMeaningDisable: !this.state.marqueeMeaningDisable}) }}>
                                <Text 
                                numberOfLines={3}
                                style={[fonts.size13, fonts.familyBold, {lineHeight: 15}]}>{this.props.meaning}</Text>
                            </TouchableOpacity>
                        :
                            <View style={{paddingRight: normalize(4), paddingLeft: normalize(4)}}></View> 
                    }
                </View>
                <View style={{flex: 1}}>
                    <WordSpeech word={this.props.word} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wordListItem: {
        paddingRight: normalize(12),
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'row',
        alignItems:  'center',
        height: normalize(64)
    }
});