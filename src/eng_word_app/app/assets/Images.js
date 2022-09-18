const Images = {
    //main background
    backImg: require('./img/Image1x.png'),
    //tab
    homeTab: require('./img/home_2x.png'),
    myWordTab: require('./img/myword_2x.png'),
    mySentenceTab: require('./img/mysen_2x.png'),
    myMakingWordTab: require('./img/mymakingword_2x.png'),
    studyResults: require('./img/study_result_2x.png'),
    //category detail
    wordView: require('./img/word_view_2x.png'),
    wordListView: require('./img/wordlistView_2x.png'),
    wordStudy: require('./img/word_study_2x.png'),

    sen_view: require('./img/sen_view_2x.png'),
    sen_study: require('./img/sen_study_2x.png'),
    //button
    buttons: [
        [   // depth 1 -> root
            require('./img/_buttons/brown.png'),
            require('./img/_buttons/blue.png'),
            require('./img/_buttons/green.png'),
            require('./img/_buttons/light_gray.png'),
            require('./img/_buttons/deep_gray.png')
        ],
        [   // depth more than 1
            require('./img/_buttons/brown_48.png'),
            require('./img/_buttons/blue_48.png'),
            require('./img/_buttons/green_48.png'),
            require('./img/_buttons/light_gray_48.png')
        ],
        [   // 내가 만드는 단어장
            require('./img/_buttons/brown_205.png'),
            require('./img/_buttons/blue_205.png'),
            require('./img/_buttons/green_205.png'),
            require('./img/_buttons/light_gray_205.png')
        ],
        [
            require('./img/_buttons/brown_172.png'),
            require('./img/_buttons/blue_172.png'),
            require('./img/_buttons/green_172.png'),
            require('./img/_buttons/light_gray_172.png')
        ],
        [
            require('./img/_buttons/brown_74.png'),
            require('./img/_buttons/blue_74.png')
        ]
    ],
    correct: require('./img/Correct.png'),
    wrong: require('./img/Wrong.png'),
    correct2x: require('./img/Correct2x.png'),
    wrong2x: require('./img/Wrong2x.png'),
    correct16: require('./img/16Correct.png'),
    wrong16: require('./img/16Wrong.png'),

    headerMeaningButton: require('./img/_buttons/pqqqq_1.png'),
    headerWordButton: require('./img/_buttons/pqqqq_2.png'),
    headerRemoveButton: require('./img/_buttons/ButtonWithStroke_2.png')
}
export default Images;