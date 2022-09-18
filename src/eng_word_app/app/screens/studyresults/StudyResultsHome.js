import React from 'react';
import { StyleSheet, View, FlatList} from 'react-native';
import { Container } from 'native-base';
import { normalize } from './../../assets/styles';
import StudyResultHistoryDetail from './../../components/studyresults/StudyResultHistoryDetail';
import StudyHeader from './../../components/studyresults/StudyHeader';
import {getStudyResults, removeFromStudyResults} from './../../utils/StudyResults';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { setRecentPage } from './../../utils/RecentPage';
  
export default class StudyResultsHome extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            arrData: [],
            loaded: true
        }
    }
    async fetchData() {
        this.setState({loaded: false});
        let _list = await getStudyResults();
        this.setState({arrData: _list, loaded: true});
    }
    async componentDidMount() {
        try {
            await setRecentPage('study_results_home', this.props);
            await this.fetchData();
        }
        catch(err) {
            console.log("StudyResultsHome err: ", err);
        }
    }
    async UNSAFE_componentWillReceiveProps(props) {
        await this.fetchData();
    }
    async removeHistory(index) {
        this.setState({loaded: false});
        let arrData = this.state.arrData;
        arrData.splice(index - 1, 1);
        this.setState({ arrData });
        await removeFromStudyResults(index);
        this.setState({loaded: true});
    }
    render() {
        return (
            <Container>
                <StudyHeader
                totalProblems={this.state.arrData.length > 0 ? this.state.arrData[0]['totalProblems'] : ''}
                correctProblems={this.state.arrData.length > 0 ? this.state.arrData[0]['correctProblems'] : ''}
                wrongProblems={this.state.arrData.length > 0 ? (this.state.arrData[0]['totalProblems'] - this.state.arrData[0]['correctProblems']) : ''}
                mark={this.state.arrData.length > 0 ? this.state.arrData[0]['mark'] : ''}
                time={this.state.arrData.length > 0? this.state.arrData[0]['display_time']: ''}
                 />
                <FlatList
                    style={[styles.container]}
                    data={this.state.arrData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <StudyResultHistoryDetail id={index + 1} 
                        params = {item}
                        removeHistory={(_index)=>{this.removeHistory(_index)}} />
                    )}
                    ListHeaderComponent={
                        <View style={{height: 10}}></View>    
                    }
                    ListFooterComponent={
                        <View style={{height: 40}}></View>
                    }
                /> 
                <Spinner_bar color={'#68ADED'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />          
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    totalProblems: {
        backgroundColor: '#006DFF',
        paddingVertical: normalize(7),  
        paddingHorizontal: normalize(21),
        borderTopRightRadius: normalize(50),
        borderBottomRightRadius: normalize(50)
    },
    resultIcon: {
        width: 20,
        height: 20
    },
    studyTextColor: {
        color: 'rgba(0, 0, 0, 0.6)'
    },
    boxShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    boxBadge: {
        height: 26,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute', backgroundColor: 'black', top: normalize(-13),
        paddingHorizontal: normalize(4),
        borderRadius: normalize(4)
    },
    historyScrollViewTopMargin: {
        height: normalize(10)
    },
    historyScrollViewBottomMargin: {
        height: normalize(40)
    }
});