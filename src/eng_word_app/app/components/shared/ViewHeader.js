import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { fonts, normalize } from './../../assets/styles';
import { addToMyWord, removeFromMyWord } from './../../utils/MyWord';
import { _e } from '../../utils/lang';
export default class ViewHeader extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isFavorite: this.props.star,
            prevProps: {},
            visibleRegister: false,
            visibleRegisterText: ''
        }
    }
    async addToFavorite() {   
        if(this.props.currentItem == null)
            return;
        let _isFavorite = this.state.isFavorite;
        this.setState({isFavorite: !this.state.isFavorite});
        this.setState({visibleRegister: true})
        if(!_isFavorite) {
            this.setState({visibleRegisterText: _e.add_to_myword})
            if( await addToMyWord(this.props.currentItem) ) {
                
            }
        }
        else {
            this.setState({visibleRegisterText: _e.remove_from_myword})
            if( await removeFromMyWord(this.props.currentItem) ) {
            }
        }
        this.props.favoriteChange({id: this.props.currentId, favorite: !_isFavorite});
        setTimeout(() => {
            this.setState({visibleRegister: false})
            this.setState({visibleRegisterText: ''})
        }, 2500);
    }
    static getDerivedStateFromProps(props, state) {
        const prevProps = state.prevProps || {};
        const isFavorite =
        prevProps.star !== props.star
      ? props.star
      : state.isFavorite;

      return {
            // Store the previous props in state
            prevProps: props,
            isFavorite,
      };
      /*
        if(props.star !== state.isFavorite){
            //Change in props
            return{
                isFavorite: props.star
            };
        }
        return null; // No change to state */
    }
    render()    {
        return (
            <>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: normalize(8), 
            paddingVertical: normalize(4), 
            backgroundColor: this.props.sentence ? 'white' : '#F4F4F4'}}>
                <View style={{display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                    {
                        !this.props.sentence && !this.props.myword ?
                        <TouchableOpacity activeOpacity={0.6}
                        onPress={ () => {this.addToFavorite()} }>
                            <Icon name='star' type='antdesign' color={this.state.isFavorite ? '#F2C94C' : 'rgba(0,0,0,0.2)'} />
                        </TouchableOpacity>
                        : null
                    }           
                    {
                        this.props.sentence ?
                        <>
                            <Text style={[fonts.size14, fonts.familyBold, {marginLeft: normalize(4)}]}>{""}</Text>
                        </>
                        :    
                        <>
                            <Text style={[fonts.colorRed, fonts.size14, fonts.familyBold, {marginLeft: normalize(4)}]}>{this.props.currentNo}</Text>
                            <Text style={[fonts.size14, fonts.familyBold]}> / {this.props.totalCount}</Text>
                        </>
                    }
                </View>           
                <View style={this.props.ellipsis ? {paddingLeft: 20} : {flex: 1}}>
                    <Text numberOfLines={1} style={[fonts.size14, fonts.familyBold, {textAlign: 'right'}]}>
                        {this.props.title}
                    </Text>
                </View>
                
            </View>
            {
                this.state.visibleRegister ?
                <View style={{backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 5, paddingVertical: 3, borderRadius: 8, position: 'absolute', top: 90, left: 10, zIndex: 9999999}}>
                    <Text style={[fonts.size14, fonts.colorWhite, fonts.familyRegular]}>
                        {this.state.visibleRegisterText}
                    </Text>
                </View>
                :
                null
            }
            </>
        );
    }
}