import React from 'react';
import { StyleSheet, View, Text, TextInput, Keyboard, TouchableHighlight } from 'react-native';
import { fonts, normalize } from './../../assets/styles';
import CheckBox from 'react-native-check-box';
export default class CreateWordItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            word: this.props.word,
            meaning: this.props.meaning,
            isChecked: this.props.isChecked
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({isChecked: props.isChecked})
        this.setState({word: props.word})
        this.setState({meaning: props.meaning})
    }
    render() {
        return (
            <View style={{ paddingHorizontal: normalize(16),
                borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{display: 'flex', flexDirection:'row', paddingVertical: normalize(12), alignItems: 'flex-end'}}>        
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <CheckBox
                            onClick={()=>{
                                this.setState({
                                    isChecked:!this.state.isChecked
                                })
                                this.props.checkedWord()
                            }}
                            isChecked={this.state.isChecked}
                        />
                        <View style={{marginLeft: normalize(6)}}>
                            <Text style={[fonts.familyBold, fonts.size14, fonts.colorRed]}>
                                {this.props.currentNo + 1}.
                            </Text>
                        </View>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', flexShrink: 1, paddingLeft: normalize(6)}}>
                        <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flexShrink: 1}}>
                                <View style={{borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.2)'}}>
                                    <Text style={[styles.itemLineText, {textAlign: 'center'}]}>단어·문법</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <TextInput
                                        style={[styles.wordInput, fonts.weightBold, fonts.colorBlack, 
                                        { width: '100%' }]}
                                        onChangeText={(text) => {
                                            this.setState({ word: text });
                                            this.props.changeWord(text)
                                        }}
                                        onSubmitEditing={Keyboard.dismiss}   
                                        value={this.state.word}
                                        placeholder="입력하세요..."
                                        placeholderTextColor = 'rgba(0, 0, 0, 0.1)'
                                    >
                                    </TextInput>
                                </View>
                            </View>
                        </View>
                        <View style={{width: normalize(16)}}></View>
                        <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flexShrink: 1}}>
                                <View style={{borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.2)'}}>
                                    <Text style={[styles.itemLineText, {textAlign: 'center'}]}>뜻·문법 설명</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <TextInput
                                        style={[styles.wordInput, fonts.weightBold, fonts.colorBlack, 
                                        { width: '100%' }]}
                                        onChangeText={(text) => {
                                            this.setState({ meaning: text });
                                            this.props.changeMeaning(text)
                                        }}
                                        onSubmitEditing={Keyboard.dismiss}   
                                        value={this.state.meaning}
                                        placeholder="입력하세요..."
                                        placeholderTextColor = 'rgba(0, 0, 0, 0.1)'
                                    >
                                    </TextInput>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wordInput: {
        fontSize: normalize(14),
        fontWeight: 'bold',
        height: normalize(22),
        paddingTop: normalize(3),
        paddingBottom: normalize(3),
        textAlign: 'left'
    },
    itemLineText: {
        fontSize: normalize(14),
        lineHeight: normalize(19),
        color: 'rgba(0, 0, 0, 0.55)',
        fontFamily: 'Malgun-Gothic-Bold'
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
    swapIcon: {
        transform: [{ rotate: '90deg'}]
    },    
});