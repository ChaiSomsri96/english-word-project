import React, { PureComponent } from 'react';
import { StyleSheet, View, TextInput, Keyboard } from 'react-native';
import { fonts, normalize } from './../../assets/styles';

export default class WordComponent extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            answer: ''
        };
    }
    
    checkAnswer() {
        Keyboard.dismiss();   
        if(this.state.answer == '')
            return;
        this.props.checkAnswer(this.state.answer);
    }

    render()    {
        return (
            <View style={{ alignItems: 'center'}}>
                <TextInput
                                    style={[styles.textInput, fonts.colorBlack]}
                                    onChangeText={(text) => {
                                        this.setState({ answer: text });
                                    }}
                                    placeholder="정답을 입력하세요."
                                    onSubmitEditing={() => {this.checkAnswer()}}   
                                    value={this.state.answer}
                                    placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                                    editable={this.props.cur_problem_status == 'ready' ? true : false}
                                    selectTextOnFocus={this.props.cur_problem_status == 'ready' ? true : false}
                                    autoFocus={true}
                                >
                </TextInput>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        fontSize: normalize(18),
        lineHeight: normalize(18),
        height: normalize(32),
        width: normalize(285),
        paddingTop: normalize(6),
        paddingBottom: normalize(6),
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
        fontFamily: 'Malgun-Gothic-Regular'
    },

});