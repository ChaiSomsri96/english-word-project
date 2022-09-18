import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';
import { fonts, normalize } from './../../assets/styles';
import CheckBox from 'react-native-check-box';
import { Icon } from 'react-native-elements';
import TextTicker from 'react-native-text-ticker';
import WordSpeech from './../../components/shared/WordSpeech';
import rnTextSize, { TSFontSpecs } from 'react-native-text-size'

export default class MyWordListItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isChecked: this.props.checked,
            marqueeWordDisable: true,
            marqueeMeaningDisable: true,
            engWordFontSize: { fontSize: normalize(18), lineHeight: normalize(19) }
        }       
    }
    UNSAFE_componentWillReceiveProps(props)    {
        this.setState({isChecked: props.checked})       
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
    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <CheckBox
                                onClick={()=>{
                                    let isChecked = this.state.isChecked;
                                    this.setState({
                                        isChecked:!this.state.isChecked
                                    })
                                    this.props.onClick(!isChecked)
                                }}
                                isChecked={this.state.isChecked}
                                style={styles.checkBoxItem}
                    />
                </View>
                <View style={{flex: 4, position: 'relative', justifyContent: 'center', height: normalize(64)}}>
                    <View style={{position: 'absolute', left: normalize(4), top: normalize(8)}}>
                        <Text style={[fonts.size10, fonts.familyBold]}>{this.props.currentNo} / {this.props.numberOfWords}</Text>
                    </View>
                    {
                        this.props.wordShow ?
                            <TouchableOpacity activeOpacity={0.6} style={{paddingLeft: normalize(4), paddingRight: normalize(4) }}
                        onPress={ () => { this.setState({marqueeWordDisable: !this.state.marqueeWordDisable}) } }>
                                <Text style={[this.state.engWordFontSize, fonts.familyBold]}>{this.props.word}</Text>
                            </TouchableOpacity>
                        : <></>   
                    }
                </View>
                <View style={{flex: 4}}>
                    {
                        this.props.meaningShow ? 
                            <TouchableOpacity activeOpacity={0.6} 
                            style={{ paddingLeft: normalize(4), paddingRight: normalize(4) }}
                            onPress={ () => { this.setState({marqueeMeaningDisable: !this.state.marqueeMeaningDisable}) } } >
                                <Text 
                                numberOfLines={3}
                                style={[fonts.size13, fonts.familyBold, {lineHeight: 15}]}>{this.props.meaning}</Text>
                            </TouchableOpacity>
                            :
                            <View style={{ paddingLeft: normalize(4), paddingRight: normalize(4) }}></View>
                    }
                </View>
                <View style={{flex: 1}}>
                    <WordSpeech word={this.props.word} />  
                </View>
                {
                    /*
                    <View style={{position: 'absolute', top: normalize(4), left: normalize(12)}}>
                        <Text style={[fonts.size11]}>{this.props.currentNo}/{this.props.numberOfWords}</Text>
                    </View>
                    <View style={[styles.flexRowAlign]}>
                        <View style={[styles.flexRowAlign, {flex: 6}]}>
                            <CheckBox
                                onClick={()=>{
                                    let isChecked = this.state.isChecked;
                                    this.setState({
                                        isChecked:!this.state.isChecked
                                    })
                                    this.props.onClick(!isChecked)
                                }}
                                isChecked={this.state.isChecked}
                                style={styles.checkBoxItem}
                            />
                            <View style={{flexShrink: 1}}>
                            {
                                this.props.wordShow ?
                                    <TouchableOpacity
                                onPress={ () => { this.setState({marqueeWordDisable: !this.state.marqueeWordDisable}) } } activeOpacity={0.6}>
                                        <TextTicker disabled={this.state.marqueeWordDisable}
                                        isInteraction={false} duration={3000} loop
                                        repeatSpacer={50} marqueeDelay={1000} style={[fonts.size16, fonts.familyBold, {marginLeft: normalize(10)}]}>
                                            {this.props.word}
                                        </TextTicker>
                                    </TouchableOpacity>
                                : <></>
                            }
                            </View>
                        </View>
                        {
                            this.props.meaningShow ? 
                            <TouchableOpacity style={{ flex:6, display: 'flex', flexDirection: 'row', paddingLeft: normalize(4) }}
                            activeOpacity={0.6}
                            onPress={ () => { this.setState({marqueeMeaningDisable: !this.state.marqueeMeaningDisable}) } } >
                                <TextTicker disabled={this.state.marqueeMeaningDisable}
                                    isInteraction={false} duration={3000} loop
                                    repeatSpacer={50} marqueeDelay={1000} style={[fonts.size14, fonts.familyBold]}>{this.props.meaning}</TextTicker>
                            </TouchableOpacity>
                            :
                            <View style={{ flex:6, display: 'flex', flexDirection: 'row', paddingLeft: normalize(4) }}></View>
                        }
                    </View>   
                    */
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        /*paddingRight: normalize(12), paddingLeft: normalize(12),
        height: normalize(64),
        borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', flexDirection: 'row',
        position: 'relative'*/

        paddingRight: normalize(12),
        height: normalize(64),
        borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', flexDirection: 'row',
        display: 'flex',
    },
    swapIcon: {
        transform: [{ rotate: '90deg'}]
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
    },
    flexRowAlign: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
});