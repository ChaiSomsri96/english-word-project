import { Toast } from 'native-base';
import { _e } from './../../utils/lang';

export function showToast(text = '', type = 'danger', position = 'bottom') {
    Toast.show({
        text: (text == '') ? _e.connectionError : _e[text],
        type: type,
        textStyle: {fontFamily: 'Malgun-Gothic-Bold', textAlign: 'center'},
        position: position,
        duration: 2500,
    });
}

export function performNetwork(comp, promise) {
    comp.setState({loaded: false});
    return promise.then(response => {
        comp.setState({loaded: true, serverRespond: true});
        if (response.errorCode != 0) {
            showToast(response.errorMsg);
            return;
        }
        return response.data;
    }).catch(err => {
        comp.setState({loaded: true, serverRespond: true});
        //showToast();
        return;
    });
}

function getWeekDay(_wkday) {
    let _day = '일';
    switch(_wkday) {
        case 0:
            _day = '일';
            break;
        case 1:
            _day = '월';
            break;
        case 2:
            _day = '화';
            break;
        case 3:
            _day = '수';
            break;
        case 4:
            _day = '목';
            break;
        case 5:
            _day = '금';
            break;
        case 6:
            _day = '토';
            break;
    }
    return _day;
}

export function getCurrentDate() {
    var d = new Date();
    let hour = d.getHours();
    return (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + getWeekDay(d.getDay()) + ') ' + (hour >= 12 ? '오후' : '오전') + (hour <= 12 ? hour : hour - 12) + ':' + d.getMinutes();
}

export function generateMyMakingWordId () {
    let result           = '';
    let length           = 8;
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}

export function generateStudyResultId () {
    let result          = '';
    let length          = 5;
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function shuffleArray(_array)  {
    let currentIndex = _array.length,  randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [_array[currentIndex], _array[randomIndex]] = [_array[randomIndex], _array[currentIndex]];
    }
    return _array;
}

export function generate(problemNo, problemCount) {
    let _others = [];
    while(1)   {
        let _pbno = Math.floor(problemCount * Math.random()) + 1;       
        if( _pbno != problemNo && _others.indexOf(_pbno) < 0 )
                _others.push(_pbno);   
        if(_others.length == 4)
            break;   
    }
    _others.splice(Math.floor(Math.random() * 5), 0, problemNo);
    return _others;
}

