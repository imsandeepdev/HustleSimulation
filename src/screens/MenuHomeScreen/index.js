
import * as React from 'react'
import {View, Text, ScrollView, TouchableOpacity, Image, Alert} from 'react-native' ;
import { useState } from 'react';
import { StoryScreen } from '../../components'
import R from '../../res/R';
import { userLogoutRequest } from '../../actions/logout.actions';
import { userSignOutRequest } from '../../actions/auth.actions';
import {useDispatch, Connect} from 'react-redux';
import Toast from 'react-native-simple-toast';
import { store } from '../../store';
import { Config } from '../../config';
import Style from './styles';
import Share from 'react-native-share';
import files from '../../res/fileBase64';

const MenuHomeScreen=(props)=>{

    const dispatch = useDispatch()
    const [selectAbout, setSelectAbout]=useState(false)
    const [profileData, setProfileData] = useState()
    const toggleSelectAbout=()=>{
        setSelectAbout(!selectAbout)
    }
    const onProfileData = (item) => {
        setProfileData(item)
    }

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus',()=>{
            const {
                auth:{authToken} 
            } = store.getState();
            const headerForAuth = {
                'Accept': "application/json",
                'Authorization': `Bearer ${authToken}`,
              };
            const APIURL = `${Config.BASE_URL}HustelAppApi/public/api/user/profile`;   
            fetch(APIURL,{
                method:'GET',
                headers: headerForAuth
            })
            .then(response => response.json())
            .then(responseJson => {
                onProfileData(responseJson.profile),
                console.log('Profile Data', responseJson.profile)
    
            })
            .catch((error)=>{
                console.log('Catch Error Message in API Services',error.message);          
            }) 
        });
        return unsubscribe;
           
    },[props.navigation])

    const onLogout = () => {

        Alert.alert(
            'Logout!',
            'Are you sure want to logout?',
            [
                {
                    text:'LOGOUT',
                    onPress: ()=> logoutUser()
                },
                {
                    text: 'CANCEL',
                    onPress: ()=> props.navigation.toggleDrawer(),
                },
            ],
            {
                cancelable: true
            }
        )
    }

    const logoutUser=()=>{
        let formData = new FormData();
        formData.append();
        dispatch(
            userSignOutRequest(           
                    props.navigation.navigate('WelcomeScreen'),
                    Toast.show('Logout Successfully Completed', Toast.SHORT)  
        ))
    }

    const myCustomShare = async() => {
        const shareOptions = {
          message: `Hey, have you tried Hustle Simulation Trading App?\nI am learning Stock Trading with them i thought you love it too!\n\nNow Install Hustle Simulation
AppLink :https://play.google.com/store/apps/details?id=com.hustleapp&hl=en`, 
          url: `https://play.google.com/store/apps/details?id=com.hustleapp&hl=en`,
          url: files.appShareImage
        }

        try {
          const ShareResponse = await Share.open(shareOptions);
          console.log(JSON.stringify(ShareResponse));
        } catch(error) {
          console.log('Error => ', error);
        }
      };

    return(
        <StoryScreen statusBarStyle='dark-content'>
            <View style={Style.mainView}>
                <View style={Style.otherMainView}>
                    <View style={Style.TopView}>
                    {
                        profileData?.profile_image != '' && profileData?.profile_image != null ? (
                            <Image
                            source={{uri:profileData?.profile_image}}
                            style={Style.profileImage}
                            resizeMode={'cover'}
                            />
                        ):
                        (
                            <View style={Style.blankProfileView}>
                                <Text style={Style.profileText}>
                                    {
                                        ((profileData?.name[0] ?? '#')+ ''). toUpperCase()
                                    }
                                </Text>
                            </View>
                        )
                    }
                    </View>
                    <View style={{ justifyContent:'center', marginLeft:10, flex:1}}>
                        <Text style={{fontSize:R.fontSize.medium, color:R.colors.primaryColor, fontWeight:'600'}}>Hello!</Text>
                        <Text style={{fontSize:R.fontSize.XXXLarge, fontWeight:'bold', color: R.colors.secondaryTextColor}} numberOfLines={1}>{profileData?.name}</Text>
                    </View>
                </View>

                <View style={{borderWidth:1.5, width:'100%', borderColor:'#999',borderRadius:10}}/>

                <ScrollView style={{marginTop: R.fontSize.large}}>
                    <TouchableOpacity
                    onPress={()=>props.navigation.navigate('ProfileScreen')}
                    style={Style.touchLink}
                    >
                        <Image source={R.images.user_Icon} resizeMode={'contain'} style={Style.touchIcon}/>
                        <Text style={Style.touchText} numberOfLines={1}>My Profile</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                    onPress={()=>props.navigation.navigate('CurrencyTypeScreen')}
                    style={Style.touchLink}
                    >
                        <Image source={R.images.chooseCurrency_icon} resizeMode={'contain'} style={Style.touchIcon}/>
                        <Text style={Style.touchText} numberOfLines={1}>Choose Currency</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity
                    onPress={()=>props.navigation.navigate('Portfolio',{
                        from:'MenuHomeScreen'
                    })}
                    style={Style.touchLink}
                    >
                        <Image source={R.images.Inactive_Portfolio} resizeMode={'contain'} style={Style.touchIcon}/>
                        <Text style={Style.touchText} numberOfLines={1}>My Portfolio</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                    onPress={()=>props.navigation.navigate('MyWallet')}
                    style={Style.touchLink}
                    >
                        <Image source={R.images.wallet_icon} resizeMode={'contain'} style={Style.touchIcon}/>
                        <Text style={Style.touchText} numberOfLines={1}>My Wallet</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={()=>props.navigation.navigate('MyWatchList')}
                    style={Style.touchLink}
                    >
                        <Image source={R.images.eye_icon} resizeMode={'contain'} style={Style.touchIcon}/>
                        <Text style={Style.touchText} numberOfLines={1}>My WatchList</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>props.navigation.navigate('PendingPosition')}
                    style={Style.touchLink}
                    >
                        <Image source={R.images.pending_icon} resizeMode={'contain'} style={Style.touchIcon}/>
                        <Text style={Style.touchText} numberOfLines={1}>My Pending Position</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={()=>props.navigation.navigate('MyAchievements')}
                    style={Style.touchLink}
                    >
                        <Image source={R.images.madel_icon} resizeMode={'contain'} style={Style.touchIcon}/>
                        <Text style={Style.touchText} numberOfLines={1}>My Achievements</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={()=>props.navigation.navigate('MarketStatusScreen')}
                    style={Style.touchLink}
                    >
                        <Image source={R.images.Status_icon} resizeMode={'contain'} style={Style.touchIcon}/>
                        <Text style={Style.touchText} numberOfLines={1}>Market Status</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={()=>props.navigation.navigate('AboutUs')}
                    style={Style.touchLink}
                    >
                        <Image source={R.images.aboutus_icon} resizeMode={'contain'} style={Style.touchIcon}/>
                        <Text style={Style.touchText} numberOfLines={1}>About The App</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={()=>myCustomShare()}
                    style={Style.touchLink}
                    >
                        <Image source={R.images.share_plane_icon} resizeMode={'contain'} style={Style.touchIcon}/>
                        <Text style={Style.touchText} numberOfLines={1}>Share App</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>

            <View style={{marginHorizontal:20,justifyContent:'center'}}>

                     <TouchableOpacity
                     onPress={()=>onLogout()}
                    style={Style.touchLink}
                    >
                        <Image source={R.images.logout_icon} resizeMode={'contain'} style={{height:R.fontSize.Size40, width:R.fontSize.Size40, transform:[{rotate:'180deg'}]}}/>
                        <Text style={{fontSize:R.fontSize.XLarge, fontWeight:'600', marginLeft:R.fontSize.extraSmall, color:R.colors.primaryColor}}>Logout</Text>
                    </TouchableOpacity>

            </View>
        </StoryScreen>
    )
}

export default MenuHomeScreen