import * as React from 'react';
import {useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, Pressable, Modal, SafeAreaView, TouchableWithoutFeedback, Alert, Platform, ActivityIndicator} from 'react-native'
import { StoryScreen, Button, GradientButton, Header, CustomTextInput } from '../../components';
import R from '../../res/R';
import ImagePicker from 'react-native-image-crop-picker';
import { store } from '../../store';
import {useDispatch, connect} from 'react-redux';
import Toast from 'react-native-simple-toast';
import { Config } from '../../config';
import Style from './styles';

const EditProfileScreen = (props) => {

const dispatch = useDispatch();
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [pickerModal ,setPickerModal] = useState(false);
const [profilePic, setProfilePic] = useState([]);
const [loading, setLoading] = useState(false)

const updateProfileAPI = `${Config.BASE_URL}HustelAppApi/public/api/user/updateProfile`;
const {auth:{authToken} } = store.getState();
const headerForUpdateProfile = {
    'Accept': "application/json",
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${authToken}`,
  };


const profileAPI = `${Config.BASE_URL}HustelAppApi/public/api/user/profile`
const headerForProfile = {
    'Accept': "application/json",
    'Authorization': `Bearer ${authToken}`,
};

const onUpdateProfile = () => {
    let formData = new FormData()
    formData.append('name', name),
    formData.append('contact', phone),
    formData.append('profile_photo',
    profilePic.path == null || profilePic?.path == null
    ? ''
    : {
        uri:
        Platform.OS === 'android'
        ? profilePic.path
        : profilePic.path?.replace('file://', ''),
        type: profilePic.mime,
        name: profilePic.filename ?? 'image.jpg',  
    },
    )

        fetch(updateProfileAPI, {
            method: 'POST',
            headers: headerForUpdateProfile,
            body: formData
        })
        .then(response => response.json())
        .then( responseJson => {
            if(responseJson.status === true)
            {    
                    setLoading(true),
                    Toast.show(responseJson.message, Toast.SHORT)
                    console.log('Updated Profile Value', responseJson)
                    console.log('Updated Profile Value fromdata', formData)
                    onCallProfile()
            }
        })
}

const onCallProfile = () => {
    props.navigation.navigate('ProfileScreen')
}

React.useEffect(() => {
    fetch(profileAPI,{
        method:'GET',
        headers: headerForProfile
    })
    .then(response => response.json())
    .then(responseJson => {
        setLoading(true)
        console.log('Edit Profile Data', responseJson.profile),
        setName(responseJson.profile?.name),
        setEmail(responseJson.profile?.email),
        setPhone(responseJson.profile?.contact),
        setProfilePic({
            path:responseJson.profile?.profile_image,
            mime: 'profile/jpeg',
            filename: 'profile.jpeg',
        });
    })
    .catch((error)=>{
        console.log('Catch Error Message in API Services',error.message);   
    })   
},[props.navigation])


const onSelectPicker = params => {
    if(params == 'Camera') {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
        }). then(image => {
            setProfilePic(image);
            setPickerModal(false)
        })
    } else if (params == 'Gallary') {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
        }). then(image => {

            console.log('Profile Picture Path', image)
            setProfilePic(image);
            setPickerModal(false)
        })
    }
}


    return(
        <StoryScreen statusBarStyle= 'dark-content'>
            <Header
            leftSource={R.images.backButton}
            backAction={() => {props.navigation.navigate('ProfileScreen')}}
            title={'Edit Profile'}
            />
        <ScrollView contentContainerStyle={{flexGrow:1}}>
        {
        loading ?      
        <View style={{flex: 1}}>
            <View style={{marginHorizontal:R.fontSize.XLarge, marginTop:R.fontSize.extraSmall}}>
               <View style={{ alignItems:'center'}}>
                    <View>
                        {
                        profilePic.path != null && profilePic.path != '' ? (
                            <Image
                            source={{uri:profilePic.path}}
                            style={Style.imageProfile}
                            resizeMode={'cover'}
                            />
                        ):
                        (
                            <View 
                            style={Style.profileBlankView}>
                                <Text style={{fontWeight:'900', fontSize:R.fontSize.Size40, textAlign:'center', color:R.colors.white}}>
                                {
                                        ((name[0] ?? '#')+ ''). toUpperCase()
                                }
                                </Text>
                            </View>
                        )
                        }  
                        <Pressable 
                        onPress={()=> setPickerModal(true)}
                        style={({pressed})=>[Style.EditImageIcon,{
                        opacity: pressed ? 0.5 :1
                        }]}>
                            <Image  source={R.images.edit_Profile} 
                            resizeMode={'contain'} 
                            style={Style.Texticon}/>
                        </Pressable>
                    </View>
                </View>        
                <View style={{marginTop:R.fontSize.EXLarge}}>
                    <View style={Style.textBoxMainView}>
                        <View style={Style.textBoxIconView}>
                            <Image source={R.images.user_Icon} resizeMode={'contain'} style={Style.Texticon}/>
                        </View>
                        <View style={{flex:1,marginLeft:R.fontSize.Size5}}>
                            <CustomTextInput
                            Texttitle={name.length>0 && 'Name'}
                            value={name}
                            onChangeText={(name)=>setName(name)}
                            placeholder={'Name'}
                            maxLength={30}
                            />
                        </View>
                    </View>
                    <View style={Style.textBoxMainView}>
                        <View style={Style.textBoxIconView}>
                            <Image source={R.images.phone_Icon} resizeMode={'contain'} style={Style.Texticon}/>
                        </View>
                        <View style={{flex:1,marginLeft:R.fontSize.Size5}}>
                            <CustomTextInput
                            Texttitle={phone.length>0 && 'Phone No'}
                            value={phone}
                            onChangeText={(phone)=>setPhone(phone)}
                            placeholder={'Phone No'}
                            maxLength={10}
                            keyboardType={'number-pad'}
                            />
                        </View>
                    </View>

                    <View style={Style.textBoxMainView}>
                        <View style={Style.textBoxIconView}>
                            <Image source={R.images.email_Icon} resizeMode={'contain'} style={Style.Texticon}/>
                        </View>
                        <View style={{flex:1,marginLeft:R.fontSize.Size5}}>
                            <CustomTextInput
                            Texttitle={email.length>0 && 'Email'}
                            placeholder={email}
                            maxLength={30}
                            editable={false}
                            />
                        </View>
                    </View>
                    <Button
                        onPress={onUpdateProfile}
                        marginTop={R.fontSize.XLarge}
                        title={'Update'}
                        height={R.fontSize.Size45}
                        backgroundColor={R.colors.primaryColor}
                        buttonTextColor={R.colors.white}
                    />
                </View>
            </View> 
        </View>
        :
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <ActivityIndicator  size="large" color={R.colors.buttonColor}/>
        </View>    
        }
        </ScrollView>
        
        <Modal
            visible={pickerModal}
            animationType={'fade'}
            transparent={true}
            onRequestClose={() => setPickerModal(false)}
        >
        <SafeAreaView style={Style.modalSafe}>
            <TouchableWithoutFeedback
            onPress = {()=> setPickerModal(false)}
            >
            <View style={Style.modalMainView}>
                <View style={Style.cameraMainView}>
                    <TouchableOpacity 
                    onPress={()=>onSelectPicker('Camera')}
                    style={Style.cameraTouch}>
                        <Text style={Style.cameraText}>Camera</Text>
                    </TouchableOpacity> 
                    <View  style={Style.modalLine} />

                    <TouchableOpacity 
                    onPress={()=>onSelectPicker('Gallary')}
                    style={Style.cameraTouch}>
                        <Text style={Style.cameraText}>Gallary</Text>
                    </TouchableOpacity> 
                </View>

                <View style={Style.bottomModal}>
                    <TouchableOpacity 
                    onPress={()=> setPickerModal(false)}
                    style={Style.cameraTouch}>
                        <Text style={Style.cameraText}>Cancel</Text>
                    </TouchableOpacity> 
                </View>

            </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
        </Modal>
        </StoryScreen>

    )
}

export default EditProfileScreen