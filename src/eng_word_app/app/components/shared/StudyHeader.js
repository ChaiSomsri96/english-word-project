import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableHighlight, ImageBackground } from 'react-native';
import {Header , View , Text} from 'native-base';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { normalize } from './../../assets/styles';
import Orientation from 'react-native-orientation';
export default class StudyHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMeaning: true,
            showWord: true
        }
    }

    backButtonPressed() {
        Orientation.lockToPortrait();
        Actions.pop();
        setTimeout(() => {
            Actions.refresh();
        }, 300);
    }

    triggerMeaning() {
        this.props.triggerMeaning(!this.state.showMeaning);
        this.setState({showMeaning: !this.state.showMeaning});
    }

    triggerWord() {
        this.props.triggerWord(!this.state.showWord);
        this.setState({showWord: !this.state.showWord});
    }

    render() {
        return (
            <Header style={[styles.header, 
            {backgroundColor: '#FCE29D', display:'flex' , flexDirection:'row' , alignItems:'center' , justifyContent: 'center',  height: 20}]} androidStatusBarColor='black' iosBarStyle="light-content" >
                <View style={{ position: 'absolute', left: 7}}>
                    <TouchableOpacity onPress={() => this.backButtonPressed()}>
                        <Icon name='chevron-left' type='evilicon' size={30} color='white' /> 
                    </TouchableOpacity>
                </View>
                <View style={{textAlign: 'center'}}>
                   <Text style={styles.userHeaderText}>{this.props.title}</Text>
               </View>
            </Header>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 0,
        elevation: 0,
        padding: 0,
        zIndex:10000,
        position: 'relative',
    },
    userHeaderText: {
        color: 'white',
        fontSize: normalize(14),
        lineHeight: normalize(17),
        fontWeight: 'bold',
        paddingTop: normalize(3)
    },
    buttonImage: {
        flex: 1,
        justifyContent: 'center',
    },
    headerMeaningButton: {
        width: normalize(32), 
        height: normalize(27),
        borderRadius: normalize(3)
    },
    headerWordButton: {
        width: normalize(48), 
        height: normalize(27),
        borderRadius: normalize(3)
    },
    headerRemoveButton: {
        width: normalize(26), 
        height: normalize(27),
        borderRadius: normalize(3)
    }
});
