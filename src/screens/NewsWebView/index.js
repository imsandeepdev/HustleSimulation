import * as React from 'react';
import {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Text,ScrollView, ActivityIndicator } from 'react-native';
import {Header, StoryScreen} from '../../components'
import R from '../../res/R'
import WebView from 'react-native-webview';


const NewsWebView = (props) => {

    const [loading, setLoading] = useState(false)

    useEffect(()=>{
      
    },[props.navigation])
 
const onLoadStart = (data) => {
    console.log('Onload Start',data)
}

const onNavigationStateChange = (data) =>{
    console.log('onNavigationStateChange',data)

}

const onLoadEnd = (data) => {
    console.log('On Load End',data)

}

    return(
        <StoryScreen statusBarStyle= 'dark-content'>
            <Header
             leftSource={R.images.backButton}
             backAction={() => { props.navigation.goBack() }}
             title={`Published By ${props.route.params?.publisherName}`}
            />
            
            <View style={{flex:1, backgroundColor:R.colors.backgroundColor}}>
            <WebView
                    style={{flex:1}}
                    source={{uri: props.route.params?.newsUrl}}
                    onNavigationStateChange={onNavigationStateChange}          
                    onLoadStart={onLoadStart}
                    onLoadEnd={onLoadEnd}
                    startInLoadingState={true}
                   
            />
            
            
            </View>
            
        </StoryScreen>
    )
}

export default NewsWebView



