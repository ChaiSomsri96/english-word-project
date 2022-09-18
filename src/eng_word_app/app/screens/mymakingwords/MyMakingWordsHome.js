import React from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableHighlight, FlatList, Alert} from 'react-native';
import { Container, Content } from 'native-base';
import Images from './../../assets/Images';
import { fonts, normalize } from './../../assets/styles';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import {Actions} from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import CheckBox from 'react-native-check-box';
import { getVocabularyList, saveVocabulary } from '../../utils/MyMakingWords';
import { setRecentPage } from './../../utils/RecentPage';

export default class MyMakingWordsHome extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            serverRespond: false,
            arrData: [],
            edit: false,
            checkAll: false
        };
    }
    async componentDidMount() {
        try {
            await setRecentPage('my_making_words_home', this.props);
            this.refresh();
        }
        catch(err) {
            console.log("MyMakingWordsHome err: ", err);
        }
    }
    async refresh() {
        let list = await getVocabularyList();
        if(list && list.length > 0) {
            list.map((item, index) => {
                list[index]['checked'] = false;
            })
            this.setState({arrData: list})
        } else {
            this.setState({arrData: []})
            this.setState({edit: false})
        }
    }
    UNSAFE_componentWillReceiveProps() {
        this.refresh();
    }
    new_trash() {
        if(this.state.edit) {
            let temp = this.state.arrData;
            if(temp && temp.length > 0) {
                let selected = false
                temp.map((item, index) => {
                    if(item.checked) {
                        selected = true
                    }
                })
                if(selected) {
                    let confirm_msg = this.state.checkAll ? '선택한 단어장을 전체 삭제하시겠습니까?' : '선택한 단어장을 삭제하시겠습니까?';
                    Alert.alert(confirm_msg, "", 
                        [
                            {
                                text: "취소",
                                style: "cancel"
                            },
                            { text: "삭제", onPress: () => this.removeAll() }
                        ],
                        { cancelable: false }
                    )
                    
                } else {
                    Alert.alert("선택해주세요.")
                }
            }
        } else {
            Actions.push("create_word", {editable: false, id: 0})
            this.setState({edit: false})
        }
    }

    editWord() {
        this.setState({edit: !this.state.edit})
    }

    setChecked(index) {
        let temp = this.state.arrData;
        temp[index]['checked'] = !temp[index]['checked'];

        let _checkedAll = true;
        for(let i = 0; i < temp.length; i ++) {
            if(!temp[i]['checked']) {
                _checkedAll = false;
                break;
            }
        }
        this.setState({arrData: temp, checkAll: _checkedAll});
    }

    setCheckAll() {
        let temp = this.state.arrData;
        if(temp && temp.length > 0) {
            temp.map((item, index) => {
                if(this.state.checkAll) {
                    temp[index]['checked'] = false
                } else {
                    temp[index]['checked'] = true
                }
            })
            this.setState({arrData: temp})
        }
        
        this.setState({checkAll: !this.state.checkAll})
    }

    editMyWord(word, index) {
        Actions.push("create_word", {id: word.id, editable: true, wordName: word.name})
        this.setState({edit: false})
    }

    detailMyWord(item, index) {
        Actions.push("my_making_word_detail", {id: item.id})
        this.setState({edit: false})
    }

    async removeMyWord(id, index, name) {
        Alert.alert("\"" + name + "\" 단어장을 삭제 하시겠습니까?", "", 
                        [
                            {
                                text: "취소",
                                style: "cancel"
                            },
                            { text: "삭제", onPress: () => this.removeOne(index) }
                        ],
                        { cancelable: false }
        )
        
    }

    async removeOne(index) {
        this.setState({loaded: false});
        let temp = this.state.arrData;
        temp.splice(index, 1);
        await saveVocabulary(this.state.arrData, temp);
        this.setState({loaded: true});
        this.refresh();
    }

    async removeAll() {
        this.setState({loaded: false});
        let temp = this.state.arrData;
        for(let i = 0; i < temp.length;) {
            if(temp[i]['checked']) {
                temp.splice(i, 1);
            }
            else {
                i ++;
            }
        }
        await saveVocabulary(this.state.arrData, temp);
        this.setState({loaded: true});
        this.refresh();
    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={styles.container}>
                    <ImageBackground source={Images.backImg} style={styles.image} resizeMode='cover'>
                        <View style={{display : 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 21, paddingTop: 20}}>
                            <TouchableHighlight style={[styles.button, {width: 59, height: 74}]} activeOpacity={0.8} onPress={ () => { this.new_trash() } } underlayColor='#4E4E4E'>
                                <ImageBackground source={ Images.buttons[4][0] } imageStyle={{borderRadius: 8}} style={[styles.buttonImage]} resizeMode="cover">
                                    {
                                        this.state.edit ?
                                        <View>
                                            <Icon name='trash-outline' type='ionicon' color={'white'} size={30} />
                                            <Text style={[fonts.size11, fonts.familyBold, fonts.colorWhite, {marginTop: 7}]}>삭제</Text>
                                        </View>
                                        :
                                        <View>
                                            <Icon name='pluscircle' type='antdesign' color={'white'} size={30} />
                                            <Text style={[fonts.size11, fonts.familyBold, fonts.colorWhite, {marginTop: 7}]}>새단어장</Text>
                                        </View>
                                    }
                                    
                                </ImageBackground>
                            </TouchableHighlight>

                            <TouchableHighlight style={[styles.button, {width: 59, height: 74, marginLeft: 10}]} activeOpacity={0.8} onPress={ () => { this.editWord() } } underlayColor='#4E4E4E'>
                                <ImageBackground source={ Images.buttons[4][1] } imageStyle={{borderRadius: 8}} style={styles.buttonImage} resizeMode="cover">
                                    {
                                        this.state.edit ?
                                        <View>
                                            <Icon name='exit-outline' type='ionicon' color={'white'} size={30} />
                                            <Text style={[fonts.size11, fonts.familyBold, fonts.colorWhite, {marginTop: 10}]}>편집종료</Text>
                                        </View>
                                        :
                                        <View>
                                            <Icon name='pencil' type='octicon' color={'white'} size={30} />
                                            <Text style={[fonts.size11, fonts.familyBold, fonts.colorWhite, {marginTop: 10}]}>편집하기</Text>
                                        </View>
                                    }
                                </ImageBackground>
                            </TouchableHighlight>
                        </View> 
                        {
                            this.state.edit ? 
                            <View style={{paddingHorizontal: normalize(10)}}>
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center',
                                marginBottom: 0,
                                justifyContent: 'center'}}>
                                    <View style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                                        <CheckBox
                                            isChecked={this.state.checkAll}
                                            onClick={()=>{
                                                this.setCheckAll()
                                            }}   
                                            unCheckedImage={<Image source={require('../../assets/img/Unchekced.png')} style={{width: 25, height: 25}}/>}
                                            checkedImage={<Image source={require('../../assets/img/CheckBox.png')} style={{width: 25, height: 25}}/>}
                                            style={{marginRight: 8}}
                                        />
                                        <View style={{width: 173, marginBottom: normalize(4)}}>
                                            <TouchableHighlight activeOpacity={0.6} underlayColor='white'
                                            onPress={ () => { this.setCheckAll() } }>
                                                <Text style={[fonts.size14, fonts.familyBold, fonts.colorWhite]}>전체선택</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', opacity: 0}}>
                                        <TouchableHighlight style={styles.editProp}>
                                            <Icon name='pencil' type='octicon' color={'black'} size={20} />
                                        </TouchableHighlight>
                                        <TouchableHighlight style={styles.editProp}>
                                            <Icon name='trash-outline' type='ionicon' color={'black'} size={20} />
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                            :
                            null
                        }
                        <FlatList
                            style={[styles.container, {paddingHorizontal: normalize(10)}]}
                            contentContainerStyle={{justifyContent: 'center'}}
                            data={this.state.arrData}
                            keyExtractor={(item) => item.id}
                            renderItem={ ({item, index}) => (
                                <View style={this.state.edit ? {
                                    display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center'} : {alignItems: 'center'}}>
                                    {
                                        this.state.edit ?
                                            <CheckBox
                                                style={{padding: 0, marginBottom: 19, marginRight: 8}}
                                                isChecked={item.checked}
                                                onClick={() => this.setChecked(index)}   
                                                unCheckedImage={<Image source={require('../../assets/img/Unchekced.png')} style={{width: 25, height: 25}}/>}
                                                checkedImage={<Image source={require('../../assets/img/CheckBox.png')} style={{width: 25, height: 25}}/>}
                                            />
                                        :
                                        null
                                    }
                                    <TouchableHighlight style={this.state.edit ? styles.button : [styles.button, {width: 206, height: 48}]} activeOpacity={0.8} onPress={ () => { this.detailMyWord(item, index) } } underlayColor='#4E4E4E'>
                                        <ImageBackground source={ this.state.edit ? Images.buttons[3][index % 4] : Images.buttons[2][index % 4] } style={styles.buttonImage} resizeMode='cover'>
                                            <View>
                                                <Text numberOfLines={2} style={[fonts.size16, fonts.familyBold, fonts.colorWhite, styles.buttonLabel]}>{item.name}</Text>
                                            </View>
                                        </ImageBackground>
                                    </TouchableHighlight>
                                    {
                                        this.state.edit ?
                                        <View style={{flexDirection: 'row'}}>
                                            <TouchableHighlight style={styles.editProp} onPress={() => this.editMyWord(item, index)} activeOpacity={0.8} underlayColor="rgb(200, 200, 200)">
                                                <Icon name='pencil' type='octicon' color={'black'} size={20} />
                                            </TouchableHighlight>
                                            <TouchableHighlight style={styles.editProp} onPress={() => this.removeMyWord(item.id, index, item.name)} activeOpacity={0.8} underlayColor="rgb(200, 200, 200)">
                                                <Icon name='trash-outline' type='ionicon' color={'black'} size={20} />
                                            </TouchableHighlight>
                                        </View>
                                        :
                                        null
                                    }
                                    
                                </View> 
                            )}
                            ListFooterComponent={
                                <>
                                <View style={{ height: normalize(40) }}></View>
                                <Spinner_bar color={'#68ADED'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  />
                                </>    
                            }
                            />
                            
                        
                    </ImageBackground>
                    {/* <Spinner_bar color={'#68ADED'} visible={!this.state.loaded} textContent={""}  overlayColor={"rgba(0, 0, 0, 0.5)"}  /> */}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    image: {
        flex: 1
    },
    button: {
        width: 173,
        height: 48,
        borderRadius: 8,
        marginBottom: 19,

        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        
        elevation: 10,
    },
    buttonImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonLabel: {
        
    },

    button48: {
        width: 230,
        height: 48,
        borderRadius: 8,
        marginBottom: 32,

        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        
        elevation: 10,
    },
    buttonImage48: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 14
    }, 
    buttonLabel48: {
        letterSpacing: 1,
        textAlign: 'center'
    },
    editProp: {
        width: 32,
        height: 32,
        borderRadius: 4,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1.25,
        shadowRadius: 4.84,
        elevation: 8,
        marginBottom: 19,
        marginLeft: 8
    },
    swapIcon: {
        transform: [{ rotate: '90deg'}]
    }, 
});