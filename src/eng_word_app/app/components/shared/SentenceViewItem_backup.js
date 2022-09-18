import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableHighlightBase } from 'react-native';
import { normalize, fonts, getScreenWidth } from '../../assets/styles';
import { Icon } from 'react-native-elements';
import rnTextSize, { TSFontSpecs } from 'react-native-text-size'

const fontSpecs = {
    fontFamily: 'Malgun-Gothic-Regular',
    fontSize: normalize(10),
    lineHeight: normalize(11),
}

const specialChars = /[!@#$%^&*()~_+\-=\[\]{};':"\\|,.<>\/?]/gi;

export default class SentenceViewItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isFavorite: this.props.star,
            word_parts: this.props.param.word_parts
        }
    }

    async componentDidMount() {
        let word_parts = this.state.word_parts;
        for(let i = 0; i < word_parts.length; i ++) {
            if(word_parts[i]['ko'] != "") {
                let allFoundCharacters = word_parts[i]['ko'].match(specialChars);
                word_parts[i]['width'] = 
                (await rnTextSize.measure({
                    text: word_parts[i]['ko'],             // text to measure, can include symbols
                    width: getScreenWidth(),            // max-width of the "virtual" container
                    ...fontSpecs,     // RN font specification
                }) )['width'] + (!allFoundCharacters ? 0 : allFoundCharacters.length);
            }
        }
        this.setState({word_parts: word_parts});
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({isFavorite: props.star})
    }

    async addToFavorite() {
        let _isFavorite = this.state.isFavorite;
        this.setState({isFavorite: !this.state.isFavorite});
        this.props.triggerFavorite(this.props.currentNo, !_isFavorite, this.props.param);
    }

    renderComment() {
        return (
            <>
            <View>
                {
                    this.props.starShow ?
                        <Text  style={[styles.sentenceSection, fonts.familyRegular]}>
                                {"      " }
                        </Text>
                    :
                        <Text  style={[styles.sentenceSection, fonts.familyRegular]}>
                                {"" }
                        </Text>
                }
            </View>
            {
                this.state.word_parts.map((item, index) => {
                    if(item.ko != "" && this.props.wordShow) {
                        return <View key={index} style={{display: 'flex', flexDirection: 'row'}}>
                                    <View style={{position: 'relative', alignItems: 'center'}}>
                                        <Text style={[styles.sentenceSection, fonts.familyRegular, styles.underline]}>{ item.en }</Text>

                                        <View style={[{width: !item['width'] ? 0 : item['width'], 
                                    position: 'absolute', top: normalize(21), zIndex: 10001}]}>
                                            <Text style={[fonts.familyBold, styles.commentSection]} >{item.ko}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={[styles.sentenceSection, fonts.familyRegular]}>{ item.partial + " " }</Text>
                                    </View>
                                    {
                                        /*
                                        <Text style={{marginBottom: normalize(-10), top: normalize(-5)}}>
                                            <Text style={[fonts.familyBold, styles.commentSection]} >{item.ko}</Text>
                                        </Text>
                                        */
                                    }
                                </View>
                                ;
                    }
                    else if(item.ko != "" && !this.props.wordShow) {
                        return <View key={index} style={{position: 'relative', display: 'flex'}}>
                                    <Text  style={[styles.sentenceSection, fonts.familyRegular]}>
                                        <Text>{ item.en }</Text>
                                        <Text>{ item.partial }</Text>
                                        <Text>{" "}</Text>
                                    </Text>
                                </View>
                                ;
                    }
                    else {
                        return <View key={index}>
                            <Text  style={[styles.sentenceSection, fonts.familyRegular]}>
                                { item.en + " " }
                            </Text>
                            </View>
                            ;
                    }
                })
            }
            </> 
        );
    }
    renderSentence() {
        return (
            <View style={{display: 'flex', flexDirection: 'row', position: 'relative', flexWrap: 'wrap', opacity: this.props.sentenceShow ? 1 : 0}}>
                {
                        this.state.word_parts && this.state.word_parts.length > 0 ? 
                        this.renderComment()
                        :
                        (
                            this.props.starShow ?
                            <Text style={[styles.sentenceSection, fonts.familyRegular]}>
                            {"      " + this.props.param.sentence}
                            </Text>
                            :
                            <Text style={[styles.sentenceSection, fonts.familyRegular]}>
                            {this.props.param.sentence}
                            </Text>
                        )
                }
            </View>
        )
    }
    render() {
        return (
            <View style={{paddingHorizontal: normalize(16), position: 'relative'}}>
                {
                    this.props.starShow ?
                        <TouchableOpacity activeOpacity={0.6} style={{left: normalize(16), position: 'absolute', paddingTop: normalize(6),
                        zIndex: 10000}}
                                onPress={ () => { this.addToFavorite() } }>

                                        <Icon name='star' size={17} type='antdesign' color={this.state.isFavorite ? '#F2C94C' : 'rgba(0,0,0,0.2)'} />
                                        
                        </TouchableOpacity>
                        :
                        null
                }

                { this.renderSentence() }
                {
                    <View>
                        {
                            <Text style={[styles.sentenceSectionKor, fonts.familyRegular, {opacity: this.props.meaningShow ? 1 : 0}]}>
                            {this.props.param.meaning}
                            </Text>
                        }
                    </View>
                }
                
            </View>    
        );    
    }
}

const styles = StyleSheet.create({
    sentenceSection: {
        fontSize: normalize(14),
        lineHeight: normalize(26),
    },
    sentenceSectionKor: {
        fontSize: normalize(14),
        lineHeight: normalize(26)
    },
    underline: {textDecorationLine: 'underline', textDecorationColor : 'red'},
    commentSection: {
        color: '#1BA3E5',
        fontSize: normalize(10), lineHeight: normalize(11)

    }
});