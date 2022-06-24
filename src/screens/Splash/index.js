import * as React from 'react';
import {useEffect} from 'react';
import {View,Image,Text, Dimensions} from 'react-native';
import {hideNavigationBar} from 'react-native-navigation-bar-color';
import { FullViewStoryScreen } from '../../components';
import R from '../../res/R';

const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("window").height;

const Splash = (props) => {

    useEffect(()=>{
        hideNavigationBar()
        setTimeout(()=>{
            props?.navigation?.replace('WelcomeScreen')
        },7000)
    },[])

    return(   
        <FullViewStoryScreen >
                <Image source={R.images.Splash_Bg} resizeMode={'cover'} style={{height:Height,width:Width}}  />      
        </FullViewStoryScreen>
    )
};

export default Splash;