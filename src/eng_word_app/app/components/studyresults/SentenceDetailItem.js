import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { fonts, normalize } from './../../assets/styles';
import { Icon } from 'react-native-elements';
import Images from './../../assets/Images';
import { showToast } from './../shared/global';
import { addToMySentence, removeFromMySentence } from './../../utils/MySentence';

export default class SentenceDetailItem extends React.Component {
    constructor(props){
        super(props);       
        this.state = {
            isFavorite: this.props.item.isFavorite
        };
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({isFavorite: props.item.isFavorite});
    }
    renderCorrectAnswer() {
        if(!this.props.item.correct) {
            return (
                <View style={{marginTop: normalize(4)}}>
                    <Text numberOfLines={1} style={[fonts.size14, fonts.familyRegular, fonts.colorRed]}>
                        정답 : { this.props.item.sentence }
                    </Text>
                </View>
            );
        }
        else {
            return null;
        }
    }
    async addToFavorite() {
        let _isFavorite = this.state.isFavorite;
        this.setState({isFavorite: !this.state.isFavorite});
        if(!_isFavorite) {
            if( await addToMySentence({...this.props.item, checked: false}) ) {
                showToast("add_to_mysentence", "success");
            }
        }
        else {
            if( await removeFromMySentence({...this.props.item, checked: false}) ) {
                showToast("remove_from_mysentence", "success");
            }
        }
        this.props.changeFavorite(this.props.item.id, !_isFavorite);
    }
    render() {
        return (
            <View style={styles.resultDetailItem}> 
                {
                    this.props.before == 'mysentence' ? 
                    <View style={{paddingRight: normalize(6)}}>
                    </View>
                    :
                    <View style={{paddingRight: normalize(6)}}>
                        <TouchableOpacity activeOpacity={0.6} onPress={ () => { this.addToFavorite() } }>
                            <Icon name='star' type='antdesign' size={22} color={this.state.isFavorite ? '#F2C94C' : 'rgba(0,0,0,0.2)'} />
                        </TouchableOpacity>
                    </View>                           
                }
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center',
                                    flexShrink: 1}}>
                    <View style={{flex: 22}}>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={[fonts.size14, fonts.familyBold]}>
                                {this.props.currentNo}.
                            </Text>
                            <Text numberOfLines={1} style={[fonts.size14, fonts.familyBold, {marginLeft: normalize(6)}]}>
                                {this.props.item.sentence}
                            </Text>
                        </View>
                        <View style={{marginTop: normalize(4)}}>
                            <Text numberOfLines={1} style={[fonts.size14, fonts.familyRegular, {textDecorationLine: (this.props.item.correct ? 'none' : 'line-through')}]}>
                                {this.props.item.input_answer}
                            </Text>
                        </View>
                        { this.renderCorrectAnswer() }
                    </View>
                    <View style={{flex: 2, alignItems: 'flex-end'}}>
                        <Image source={this.props.item.correct ? Images.correct16 : Images.wrong16} style={styles.resultIcon} resizeMode='cover' />
                    </View>
                </View>
            </View>            
        );
    }
}

const styles = StyleSheet.create({
    resultDetailItem: {
        borderBottomWidth: 1, 
        borderColor: 'rgba(0, 0, 0, 0.5)',
        paddingLeft: normalize(12),
        paddingRight: normalize(20),
        paddingTop: normalize(8), 
        paddingBottom: normalize(8),
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'flex-start'
    },
    resultIcon: {
        width: 16,
        height: 16
    }
});