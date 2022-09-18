import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { fonts, normalize } from './../../assets/styles';
import CheckBox from 'react-native-check-box';
export default class SubHeader extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            allChecked: this.props.allChecked
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({allChecked: props.allChecked})
    }
    clickAllChecked() {
        let allChecked = this.state.allChecked;
        this.setState({allChecked: !this.state.allChecked});
        this.props.onPress(!allChecked);
    }
    render() {
        return (
            <View style={styles.subHeader}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    {
                        this.props.favorite ? 
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <CheckBox
                                    onClick={()=>{
                                        this.clickAllChecked();
                                    }}
                                    isChecked={this.state.allChecked}
                            />
                        </View>
                        : null
                    }
                </View>
                {
                 this.props.favorite ? 
                    <View style={{flex: 4}}>
                        <TouchableHighlight activeOpacity={0.6} underlayColor='white'
                            onPress={ () => { this.clickAllChecked(); } }>
                                    <Text style={[fonts.size14, fonts.familyBold, {marginLeft: normalize(8)}]}>전체선택</Text>
                        </TouchableHighlight>
                    </View>
                    : null
                }
                <View style={this.props.ellipsis ? {} : {flex: 4}}>
                    <Text style={[fonts.size14, fonts.familyBold, {textAlign: 'right'}]}>{ this.props.title }</Text>    
                </View>
                {
                    this.props.favorite ? 
                    <View style={{flex: 1}}>
                    </View>
                    : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    subHeader: {
        paddingLeft: normalize(0),
        paddingRight: normalize(8),
        paddingTop: normalize(8),
        paddingBottom: normalize(8),
        borderBottomWidth: 1,
        borderColor: 'black',
        display: 'flex', flexDirection: 'row',
        alignItems: 'center'
    }    
});