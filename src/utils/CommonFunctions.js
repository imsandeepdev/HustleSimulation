import * as React from 'react';
import {Linking, Alert, Platform} from 'react-native';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';

const CommonFunctions = {

    showToast: (msg) => {
        return Toast.show(msg, Toast.SHORT)
    },

    isBlank: (value, msg) => {
        
        if(value==''){
            CommonFunctions.showToast(msg)
            return false;
        }
        return true;
    },
    isEmailValid: (value, msg) => {
        let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
        if(reg.test(value) === false){
            CommonFunctions.showToast(msg)
            return false;
        } else
            return true;
    },
    isMobileValid: (value, msg) => {
        if(value.length.toString()<8){
            CommonFunctions.showToast(msg)
            return false;
        }
        else
            return true;
    },
    isNetAvail(){
        return NetInfo.fetch()
    },

    getDeviceType: () => {
        if(Platform.OS === 'ios'){
            return 'iOS'
        }else{
            return 'android'
        }
    },

}

export default CommonFunctions;