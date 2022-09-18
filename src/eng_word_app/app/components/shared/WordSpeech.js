import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { normalize } from './../../assets/styles';
import { Icon } from 'react-native-elements';
import { speakWord } from './../../utils/tts';
export default class WordSpeech extends React.Component {
    constructor(props){
        super(props);
    }
    triggerSound() {  
        speakWord(this.props.word);
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={0.6} style={[styles.wordPronunciationSound, { backgroundColor: this.props.wordView?'white':'#F4F4F4' }]}
            onPress={()=> {this.triggerSound()}}>
                <Icon name='volume-medium' type='ionicon' color='rgba(0,0,0,0.6)' />
            </TouchableOpacity>           
        );
    }
}

const styles = StyleSheet.create({
    wordPronunciationSound: {
        width: normalize(32),
        height: normalize(32),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 32          
    }
});