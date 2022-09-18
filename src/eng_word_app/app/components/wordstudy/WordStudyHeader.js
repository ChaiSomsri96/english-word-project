import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { fonts, normalize } from './../../assets/styles';
let interval = null;
export default class WordStudyHeader extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            timer: this.props.timerP
        };
    }
    componentDidMount() {
        interval = setInterval(function() {
            this.props.changeTime(this.state.timer + 1);
            this.setState({ timer: (this.state.timer + 1) });
        }.bind(this), 1000);
    }
    componentWillUnmount() {
        clearInterval(interval);
    }
    timeFormat() {
        let ss = this.state.timer % 60;
        if(ss <= 9) ss = '0' + ss;
        let mm = Math.floor(this.state.timer / 60);
        if(mm <= 9) mm = '0' + mm;
        return mm + ':' + ss;
    }
    render() {
        return (
            <View style={{height: normalize(59)}}>
                <View style={{backgroundColor: '#68ADED', paddingVertical: normalize(8)}}>                
                    <Text style={[fonts.size15, fonts.familyBold, fonts.colorWhite,
                                {textAlign: 'center'}]}>{this.props.title}</Text>
                </View>               
                <View style={{display: 'flex', alignItems: 'center', flexDirection: 'row', padding: normalize(8),
                        backgroundColor: 'white'}}>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1}}>
                        <Text style={[fonts.size14, fonts.colorRed, fonts.familyBold]}>{this.props.currentNo}</Text>
                        <Text style={[fonts.size14, fonts.familyBold]}> / {this.props.totalProblems}</Text>
                        <Icon type='evilicon' name='clock' color="#000" size={30} style={{marginHorizontal: normalize(12)}} />
                        <Text style={[fonts.size14, fonts.familyBold]}>{this.timeFormat()}</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
                        <Text style={[fonts.size14, fonts.familyBold, {color: 'rgba(0, 0, 0, 0.6)'}]}>
                            정답 : { this.props.rightAnswer }
                        </Text>
                        <Text style={[fonts.size14, fonts.familyBold, {color: 'rgba(0, 0, 0, 0.6)', marginLeft: normalize(12)}]}>
                            오답 : { this.props.wrongAnswer }
                        </Text>
                    </View>
                </View>
            </View>
        )   
    }
}