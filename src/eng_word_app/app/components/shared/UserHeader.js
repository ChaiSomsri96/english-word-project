import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableHighlight, ImageBackground } from 'react-native';
import {Header , View , Text} from 'native-base';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { normalize } from './../../assets/styles';
import Images from './../../assets/Images';
import Orientation from 'react-native-orientation';
export default class UserHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMeaning: true,
            showWord: true
        }
    }

    backButtonPressed() {
        if(this.props.sentenceResultsDetail && !this.props.fromResultHome) {
            Orientation.lockToLandscape();
            Actions.pop();
            setTimeout(() => {
                Actions.refresh();
            }, 300);
        }
        else {
            Actions.pop();
        }
    }

    triggerMeaning() {
        if(!this.state.showWord && this.state.showMeaning)
            return;
        this.props.triggerMeaning(!this.state.showMeaning);
        this.setState({showMeaning: !this.state.showMeaning});
    }

    triggerWord() {
        if(!this.state.showMeaning && this.state.showWord)
            return;
        this.props.triggerWord(!this.state.showWord);
        this.setState({showWord: !this.state.showWord});
    }

    triggerRemove() {
        this.props.triggerRemove();
    }

    render() {
        return (
            <Header style={[styles.header, 
            {backgroundColor: this.props.theme == 'dark' ? 'black' : '#C3A3E8', 
             display:'flex' , flexDirection:'row' , alignItems:'center' , justifyContent: 'center', 
             height: 50}]} androidStatusBarColor='black' iosBarStyle="light-content" >
                <View style={{ position: 'absolute', left: 7}}>
                    <TouchableOpacity onPress={() => this.backButtonPressed()}>
                        <Icon name='chevron-left' type='evilicon' size={42} color='white' /> 
                    </TouchableOpacity>
                </View>
                <View style={{textAlign: 'center'}}>
                   <Text style={styles.userHeaderText}>{this.props.title}</Text>
               </View>

               {
                   this.props.wordList ?
                   <View style={{display: 'flex', flexDirection: 'row',
               position: 'absolute', right: 7}}>
                        <TouchableHighlight activeOpacity={0.8}
                        style={[styles.headerMeaningButton, {marginLeft: (!this.props.favorite ? normalize(6) : normalize(3))}]}
                        onPress={() => { this.triggerMeaning() }}
                        underlayColor='#005475'>
                                <ImageBackground source={Images.headerMeaningButton} style={styles.buttonImage} resizeMode='cover'>
                                </ImageBackground>
                        </TouchableHighlight>

                        <TouchableHighlight activeOpacity={0.8}
                        style={[styles.headerWordButton, {marginLeft: (!this.props.favorite ? normalize(6) : normalize(3))}]}
                        onPress={() => { this.triggerWord() }}>
                                <ImageBackground source={Images.headerWordButton} style={styles.buttonImage} resizeMode='cover'>
                                </ImageBackground>
                        </TouchableHighlight>
                        {
                            this.props.favorite ? 
                            <TouchableHighlight activeOpacity={0.8}
                        style={[styles.headerRemoveButton, {marginLeft: normalize(3)}]}
                        onPress={() => {this.triggerRemove()}}>
                                    <ImageBackground source={Images.headerRemoveButton} style={styles.buttonImage} resizeMode='cover'>
                                        <Icon name='trash' type='fontisto' size={18} color='white' /> 
                                    </ImageBackground>
                            </TouchableHighlight>
                            : null
                        }
                    </View>
                    :
                    
                        this.props.remove ? 
                        <View style={{display: 'flex', flexDirection: 'row', position: 'absolute', right: 10}}>
                            <TouchableHighlight onPress={ () => {this.props.remove()} } underlayColor="white" activeOpacity={0.8}>
                                <Icon name='delete' type='antdesign' color='white' size={23} />
                            </TouchableHighlight>
                        </View>
                        :
                            this.props.sentenceList && this.props.favorite ? 
                                <View style={{display: 'flex', flexDirection: 'row',
                position: 'absolute', right: 7}}>
                                    <TouchableHighlight activeOpacity={0.8}
                                style={[styles.headerRemoveButton, {marginLeft: normalize(3)}]}
                                onPress={() => {this.triggerRemove()}}>
                                            <ImageBackground source={Images.headerRemoveButton} style={styles.buttonImage} resizeMode='cover'>
                                                <Icon name='trash' type='fontisto' size={18} color='white' /> 
                                            </ImageBackground>
                                    </TouchableHighlight>
                                </View>
                            :
                            null
                
               }
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
        fontSize: normalize(18),
        lineHeight: normalize(26),
        fontFamily: 'Malgun-Gothic-Bold'
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
        width: normalize(32), 
        height: normalize(27),
        borderRadius: normalize(3)
    },
    headerRemoveButton: {
        width: normalize(26), 
        height: normalize(27),
        borderRadius: normalize(3)
    }
});
