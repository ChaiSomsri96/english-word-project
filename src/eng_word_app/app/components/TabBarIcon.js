import * as React from 'react';
import { StyleSheet , View , ImageBackground, Text, Platform, TouchableHighlight } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Images from './../assets/Images';
import { fonts, getScreenWidth } from './../assets/styles/index';
import { setRecentPage } from './../utils/RecentPage';

const tabRouterChange = async (routerName) => {
  if(routerName != Actions.currentScene) {
    if(routerName == 'home') {
      await setRecentPage(null, null);
      Actions.reset(routerName, {notrefresh: true});
    }
    else {
      Actions.reset(routerName);
    }
  }
};
//Actions.reset(props.reset)
//onPress={() => { tabRouterChange.bind(null, props.reset) } }
export default function TabBarIcon(props) {
    return (
        <TouchableHighlight style={styles.tabItem} 
        onPress={() => { tabRouterChange(props.reset) } }
        activeOpacity={0.6}>
            <ImageBackground
              source={props.name == 'home' ? Images.homeTab : (
                props.name == 'my_word_home' ? Images.myWordTab : (
                props.name == 'my_sentence_home' ? Images.mySentenceTab : (
                props.name == 'my_making_words_home' ? Images.myMakingWordTab : Images.studyResults
              )))} 
              style={{
                height: 95,
                width: (parseInt(getScreenWidth() / 5) + getScreenWidth() % 5)
              }}
              resizeMode='cover'
            >
              <View style={styles.tabItemContainer}>
                  <View style={styles.labelContainer}>
                    <Text style={[props.focused ? fonts.colorWhite : fonts.colorWhite,
                                  fonts.size12,
                                  fonts.familyBold, {textAlign: 'center'}]}>{props.title}</Text>
                  </View>
              </View>
            </ImageBackground>
        </TouchableHighlight>
      );
}
//study_results
const styles = StyleSheet.create({
  tabItem: {
    height: Platform.OS == 'ios' ? 95 : 95,
    width: '100%'
  },
  tabImage: {
      height: 95,
      width: '100%',
  },
  tabItemContainer: {
    flex: 1,
    position: 'relative'
  },
  labelContainer: {
    backgroundColor: 'rgba(0,0,0, 0.5)',
    position: 'absolute',
    width: '100%',
    height: 36,
    bottom: 0,
    alignItems: 'center', justifyContent:'center'
  }
});