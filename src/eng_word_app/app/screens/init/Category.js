import React from 'react';
import { StyleSheet, View, Text, ScrollView, ImageBackground, TouchableHighlight} from 'react-native';
import { Container, Content } from 'native-base';
import Images from './../../assets/Images';
import { fonts, calcButtonListMarginTop } from './../../assets/styles';
export default class Category extends React.Component {
    constructor(props){
        super(props);
    }

    buttonClick() {
    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={styles.container}>
                    <ImageBackground source={Images.backImg} style={styles.image} resizeMode='cover'>
                        <ScrollView>
                            <View style={{display : 'flex', alignItems: 'center', marginTop: calcButtonListMarginTop(4, 48)}}>
                                <TouchableHighlight style={styles.button} activeOpacity={0.8} onPress={ () => { this.buttonClick() } } underlayColor='#FF9636'>
                                    <ImageBackground source={ Images.buttons[1][0] } style={styles.buttonImage} resizeMode='cover'>
                                        <Text numberOfLines={1} style={[fonts.size16, fonts.weightBold, fonts.colorWhite, styles.buttonLabel]}>Day 01 provide, deeply understand meaning</Text>
                                    </ImageBackground>
                                </TouchableHighlight>
                            </View>
                            <View style={{display : 'flex', alignItems: 'center'}}>
                                <TouchableHighlight style={styles.button} activeOpacity={0.8} onPress={ () => { this.buttonClick() } } underlayColor='#68ADED'>
                                    <ImageBackground source={ Images.buttons[1][1] } style={styles.buttonImage} resizeMode='cover'>
                                        <Text numberOfLines={1} style={[fonts.size16, fonts.weightBold, fonts.colorWhite, styles.buttonLabel]}>Day 02 emotion, amazing understand meaning</Text>
                                    </ImageBackground>
                                </TouchableHighlight>
                            </View>
                            <View style={{display : 'flex', alignItems: 'center'}}>
                                <TouchableHighlight style={styles.button} activeOpacity={0.8} onPress={ () => { this.buttonClick() } } underlayColor='#44D24A'>
                                    <ImageBackground source={ Images.buttons[1][2] } style={styles.buttonImage} resizeMode='cover'>
                                        <Text numberOfLines={1} style={[fonts.size16, fonts.weightBold, fonts.colorWhite, styles.buttonLabel]}>Day 03 happy, moment take meaning</Text>
                                    </ImageBackground>
                                </TouchableHighlight>
                            </View>
                            <View style={{display : 'flex', alignItems: 'center'}}>
                                <TouchableHighlight style={styles.button} activeOpacity={0.8} onPress={ () => { this.buttonClick() } } underlayColor='#A49E9E'>
                                    <ImageBackground source={ Images.buttons[1][3] } style={styles.buttonImage} resizeMode='cover'>
                                        <Text numberOfLines={1} style={[fonts.size16, fonts.weightBold, fonts.colorWhite, styles.buttonLabel]}>Day 04 engineer avocation</Text>
                                    </ImageBackground>
                                </TouchableHighlight>
                            </View>
                        </ScrollView>
                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    image: {
        flex: 1
    },
    button: {
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
    buttonImage: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 14
    },
    buttonLabel: {
        letterSpacing: 1,
        textAlign: 'center'
    }
});