import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { fonts, normalize } from './../../assets/styles';
import CheckBox from 'react-native-check-box';
export default class SentenceStudyItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: this.props.checked,
            favorite: this.props.isFavorite
        }
    }
    componentDidMount() {
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({isChecked: props.checked})
    }
    render() {
        return (
            <View style={styles.studyItem}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{width: normalize(32)}}>
                    </View>
                    <View style={{flex: 11, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[fonts.size11, fonts.familyRegular, {marginLeft: normalize(4)}]}>{this.props.currentNo} / {this.props.totalProblems}</Text>
                    </View>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', marginTop: normalize(4)}}>
                    <View style={{width: normalize(32)}}>
                        <CheckBox
                            onClick={()=>{
                                let isChecked = this.state.isChecked;
                                this.setState({
                                    isChecked:!this.state.isChecked
                                })
                                this.props.checkClick(!isChecked)
                            }}
                            isChecked={this.state.isChecked}
                            style={styles.checkBoxItem}
                        />
                    </View>
                    <View style={{flexShrink: 1}}>
                        <Text numberOfLines={1} style={[styles.engStudySen, fonts.familyRegular]}>{this.props.engSentence}</Text>
                        <Text numberOfLines={1} style={[styles.korStudySen, fonts.familyRegular]}>{this.props.korSentence}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    studyItem: {
        paddingLeft: normalize(12),
        paddingTop: normalize(10),
        paddingBottom: normalize(8),
        paddingRight: normalize(40),
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.5)'
    },
    engStudySen: {
        fontSize: normalize(14),
        lineHeight: normalize(19)
    },
    korStudySen: {
        fontSize: normalize(16),
        lineHeight: normalize(24)
    },
    checkBoxItem: {
    }
});