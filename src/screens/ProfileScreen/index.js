import * as React from 'react';
import {useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, StatusBar, Platform, ActivityIndicator} from 'react-native'
import { StoryScreen, Button, GradientButton, Header } from '../../components';
import R from '../../res/R'
import { useDispatch, connect } from 'react-redux';
import { userProfileRequest } from '../../actions/userProfile.actions';
import { store } from '../../store';
import EditProfileScreen from '../EditProfileScreen';
import { Config } from '../../config';

const Profile = (props) => {

    const dispatch = useDispatch();
    const [profileData, setProfileData] = useState();
    const [loading, setLoading] = useState(false);

    const onProfileData = (item) => {
        setProfileData(item)
    }


    // React.useEffect(() => {
    //     const unsubscribe = props.navigation.addListener('focus', () => {
    //         screenFocus();
    //     });
    //     return unsubscribe;
    // }, [props.navigation]);

    // const screenFocus = () => {
    //     Platform.OS === 'android' &&
    //     StatusBar.setBackgroundColor(R.colors.white, true);
    //     StatusBar.setBarStyle('dark-content', true);
    //     dispatch(userProfileRequest(response=>{
    //         console.log('Profile Data', response),
    //         onProfileData(responseJson.profile)


    //     }))
    // }

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
                setLoading(true)
                onProfileData(responseJson.profile),
                console.log('Profile Data', responseJson.profile)
                
            })
            .catch((error)=>{
                console.log('Catch Error Message in API Services',error.message);      
            })  
            
        });
        return unsubscribe;  
    },[props.navigation])

    return(
        <StoryScreen statusBarStyle= 'dark-content' loading={props.loading}>
            <Header
            leftSource={R.images.backButton}
            backAction={() => { props.navigation.goBack() }}
            title={'Profile'}
            rightSource={R.images.edit_Icon}
            rightContent = {
             <Image  source={R.images.edit_Icon} resizeMode={'contain'} style={{height:R.fontSize.EXLarge, width:R.fontSize.EXLarge}}/> 
            }
            rightAction={()=>props.navigation.navigate('EditProfileScreen')}
            />

        <ScrollView contentContainerStyle={{flexGrow:1}}>
        {
        loading ?
        <View style={{flex: 1}}>
            <View style={{marginHorizontal:R.fontSize.XLarge, marginTop:R.fontSize.extraSmall}}>
               <View style={{ alignItems:'center'}}>
                    <View>

                    {
                        profileData?.profile_image != '' && profileData?.profile_image != null ? (
                            <Image
                            source={{uri:profileData?.profile_image}}
                            style={{height:R.fontSize.Size120, width:R.fontSize.Size120, borderRadius:R.fontSize.Size60, borderWidth:4, borderColor:R.colors.primaryColor}}
                            resizeMode={'cover'}
                            />
                        ):
                        (
                            <View style={{height:R.fontSize.Size120, width:R.fontSize.Size120, borderRadius:R.fontSize.Size60, backgroundColor:R.colors.placeholderTextColor, alignItems:'center', justifyContent:'center'}}>
                                <Text style={{fontWeight:'900', fontSize:R.fontSize.Size40, textAlign:'center', color:R.colors.white}}>
                                    {
                                        ((profileData?.name[0] ?? '#')+ ''). toUpperCase()
                                    }
                                </Text>
                            </View>
                        )
                        }

                    </View>
                    <View style={{marginTop:10}}>
                        <Text style={{padding:2,fontSize:R.fontSize.XXXLarge, fontWeight:'800',textAlign:'center'}}>{profileData?.name}</Text>
                        {/* <Text style={{padding:2,fontSize:R.fontSize.large, fontWeight:'400', textAlign:'center'}}>AugursTechno@gmail.com</Text> */}
                    </View>
                </View>

                <View style={{marginTop:R.fontSize.EXLarge}}>             
                    <View style={{flexDirection:'row', alignItems:'center', marginBottom:R.fontSize.extraSmall}}>
                        <View style={{width:R.fontSize.Size45,height:R.fontSize.Size45 ,borderWidth:1,alignItems:'center',justifyContent:'center',borderRadius:4, borderColor:R.colors.placeholderTextColor}}>
                            <Image source={R.images.user_Icon} resizeMode={'contain'} style={{height:R.fontSize.EXLarge, width:R.fontSize.EXLarge}}/>
                        </View>
                        <View style={{flex:1, paddingLeft:5, marginLeft:R.fontSize.extraSmall, borderWidth:1,borderRadius:4, borderColor:R.colors.placeholderTextColor, height:R.fontSize.Size45,justifyContent:'center'}}>
                            <Text style={{color:R.colors.placeholderTextColor, fontSize:R.fontSize.medium}}>Name</Text>
                            <Text style={{color:R.colors.secondaryTextColor, fontSize:R.fontSize.large, fontWeight:'500'}}>{profileData?.name}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:'row', alignItems:'center', marginBottom:R.fontSize.extraSmall}}>
                        <View style={{width:R.fontSize.Size45,height:R.fontSize.Size45 ,borderWidth:1,alignItems:'center',justifyContent:'center',borderRadius:4, borderColor:R.colors.placeholderTextColor}}>
                            <Image source={R.images.phone_Icon} resizeMode={'contain'} style={{height:R.fontSize.EXLarge, width:R.fontSize.EXLarge}}/>
                        </View>
                        <View style={{flex:1, paddingLeft:5, marginLeft:R.fontSize.extraSmall, borderWidth:1,borderRadius:4, borderColor:R.colors.placeholderTextColor, height:R.fontSize.Size45,justifyContent:'center'}}>
                            <Text style={{color:R.colors.placeholderTextColor, fontSize:R.fontSize.medium}}>Contact No</Text>
                            <Text style={{color:R.colors.secondaryTextColor, fontSize:R.fontSize.large, fontWeight:'500'}}>{`+91- ${profileData?.contact}`}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:'row', alignItems:'center', marginBottom:R.fontSize.extraSmall}}>
                        <View style={{width:R.fontSize.Size45,height:R.fontSize.Size45 ,borderWidth:1,alignItems:'center',justifyContent:'center',borderRadius:4, borderColor:R.colors.placeholderTextColor}}>
                            <Image source={R.images.email_Icon} resizeMode={'contain'} style={{height:R.fontSize.EXLarge, width:R.fontSize.EXLarge}}/>
                        </View>
                        <View style={{flex:1, paddingLeft:5, marginLeft:R.fontSize.extraSmall, borderWidth:1,borderRadius:4, borderColor:R.colors.placeholderTextColor, height:44,justifyContent:'center'}}>
                            <Text style={{color:R.colors.placeholderTextColor, fontSize:R.fontSize.medium}}>Email Id</Text>
                            <Text style={{color:R.colors.secondaryTextColor, fontSize:R.fontSize.large, fontWeight:'500'}} numberOfLines={1}>{profileData?.email}</Text>
                        </View>
                    </View>


                </View>
            </View> 
        </View>
        :
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <ActivityIndicator  size="large" color={R.colors.buttonColor}/>
        </View>    
        }
        </ScrollView>
        </StoryScreen>

    )
}

export default Profile;