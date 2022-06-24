import * as React from 'react';
import {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Text,ScrollView, ActivityIndicator } from 'react-native';
import {Header, StoryScreen} from '../../components'
import R from '../../res/R'
import { store } from '../../store';
import { Config } from '../../config';

const AboutUs = (props) => {

    const [aboutData, setAboutData] = useState([])
    const [loading, setLoading ] = useState(false)

    useEffect(()=>{
        setLoading(false)
        const {
            auth:{authToken} 
        } = store.getState();
        const headerForAuth = {
            'Accept': "application/json",
            'Authorization': `Bearer ${authToken}`,
          };
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/showAboutUs`,{
            method:'GET',
            headers: headerForAuth
        })
        .then(res => res.json())
        .then(respnse => {
            setLoading(true)
            console.log('About Us Page', respnse)
            setAboutData(respnse?.data)
        })

    },[props.navigation])

    return(
        <StoryScreen statusBarStyle= 'dark-content'>
            <Header
             leftSource={R.images.backButton}
             backAction={() => { props.navigation.goBack() }}
             title={`HustleSimulation Stock Trading`}
            />
            
            {
            loading
            ?
             
            <View style={{flex:1, backgroundColor:R.colors.lightgreen,paddingHorizontal:R.fontSize.extraSmall,alignItems:'center', paddingTop:R.fontSize.extraSmall}}>
            
            <View style={{padding:R.fontSize.XLarge,alignItems:'center',justifyContent:'center'}}>
                {/* <Image source={R.images.appLogo_icon} resizeMode={'contain'} style={{height:R.fontSize.Size70,width:R.fontSize.Size70, borderRadius:R.fontSize.Size4}}/> */}
                
                <Image source={R.images.appLogo} resizeMode={'contain'} style={{height:R.fontSize.Size50,width:R.fontSize.Size100, borderRadius:R.fontSize.Size4}}/>
            </View>
            {
                aboutData.map((item,index)=>{
                    return(
                        <Text 
                        key={index}
                        style={{fontSize:R.fontSize.medium, color:R.colors.black}}>
                        {item?.Text}
                    </Text>
                    )
                })
            }

            </View>
            :   
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
             <ActivityIndicator size={'large'} color={R.colors.buttonColor} />
            </View>
    }
            
        </StoryScreen>
    )
}

export default AboutUs



