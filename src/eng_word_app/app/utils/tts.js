import Tts from 'react-native-tts';
Tts.setDefaultLanguage('en-US');
Tts.addEventListener('tts-start', event => console.log('start', event));
Tts.addEventListener('tts-finish', event => console.log('finish', event));
Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
Tts.setDefaultRate(0.45);
export const speakWord = (word) => {
    Tts.getInitStatus().then(() => {
        Tts.stop();
        Tts.speak(word);
        // ...
      }, (err) => {
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
    });    
}