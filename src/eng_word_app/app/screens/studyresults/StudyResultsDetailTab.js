import React from 'react';
import { FlatList } from 'react-native';
import ResultDetailItem from './../../components/studyresults/ResultDetailItem';
import SentenceDetailItem from './../../components/studyresults/SentenceDetailItem';
export default class StudyResultsDetailTab extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            problemList: this.props.problemList
        };
    }
    changeFavorite(_id, favorite) {
        this.props.changeFavorite(_id, favorite);
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({problemList: props.problemList});
    }
    render() {
        return (
                <>
                {
                    this.props.isSentence ? 
                    <FlatList
                        data={this.state.problemList}
                        keyExtractor={(item) => item.id}
                        renderItem={({item, index}) => (
                            <SentenceDetailItem
                            currentNo={ index + 1 }
                            item={ item }
                            before={this.props.before}
                            changeFavorite={(_id, favorite) => { this.changeFavorite(_id, favorite) }}
                            />
                        )}  
                    />
                    :
                    <FlatList
                        data={this.state.problemList}
                        keyExtractor={(item) => item.word_id}
                        renderItem={({item, index}) => (
                            <ResultDetailItem 
                            currentNo={index + 1} 
                            word={item.problem} 
                            meaning={item.user_answer} 
                            correctAnswer={item.answer}
                            correct={item.result == 'correct' ? true : false}
                            wrong={item.result != 'correct' ? true : false}
                            wordId={item.word_id}
                            wordItem={item.word_item}
                            isFavorite={item.is_favorite}
                            before={this.props.before}
                            changeFavorite={(_id, favorite) => { this.changeFavorite(_id, favorite) }} />    
                        )}
                    />
                }
                </>
        );
    }
}