import * as React from 'react';
import {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {Button, CustomTextInput, FullViewStoryScreen} from '../../components';
import R from '../../res/R';
import CommonFunctions from '../../utils/CommonFunctions';

const UpdatePasswordScreen = (props) => {

    const [newPass, setNewPass] = useState('');
    const [conNewPass, setConNewPass] = useState('');



    const isValid = () => {
        return CommonFunctions.isBlank(newPass.trim(), 'Please Enter New Password') &&
        newPassword() &&
        CommonFunctions.isBlank(conNewPass.trim(), 'Please Enter Confirm New Password') &&
        confirmNewPassword() &&
        ComparePassword()
    }

    const newPassword=()=>{
        if(newPass.trim().length < 8){
            CommonFunctions.showToast('Password must have at least 8 Character')
            return false;
        }else{
            return true;
        }
    }
    const confirmNewPassword=()=>{
        if(conNewPass.trim().length < 8){
            CommonFunctions.showToast('Password must have at least 8 Character')
            return false;
        }else{
            return true;
        }
    }

    const ComparePassword=()=>{
        if(newPass.trim()!=conNewPass.trim()){
            CommonFunctions.showToast('New Password and Confirm New Password Does not Match')
            return false;
        } else{
            return true;
        }
    }

    const onSubmitClick = () => {
        if(isValid()){
            if(CommonFunctions.isNetAvail())
            {
                props.navigation.navigate('WelcomeScreen')
              }
              else
              {
                  CommonFunctions.showToast('Please connect Internet')
              }
        }
    }

    return(
        <FullViewStoryScreen statusBarStyle="dark-content" >
            <ScrollView contentContainerStyle={{flexGrow:1, backgroundColor:R.colors.white}}>

            <TouchableWithoutFeedback  onPress={()=>Keyboard.dismiss()}>
            <View style={{flex:1}}>
                
                    <View style={{marginTop:R.fontSize.UltraXLarge,marginHorizontal:R.fontSize.XXLarge}}>
                        <Text style={{color:R.colors.buttonColor, fontWeight:'bold', fontSize:R.fontSize.XLarge}}>Forgot</Text>
                        <Text style={{fontWeight:'bold', fontSize:R.fontSize.UltraXLarge}}>Password</Text>
                    </View>

                <View style={{flex:1, marginHorizontal:R.fontSize.XXLarge, justifyContent:'center'}}>

                    <CustomTextInput
                        Texttitle={newPass.length>0 && 'New Password'}
                        value={newPass}
                        onChangeText={(newpass)=>setNewPass(newpass)}
                        placeholder={'New Password'}
                        secureTextEntry={true}
                    />

                    <CustomTextInput
                        marginTop={R.fontSize.XLarge}
                        Texttitle={conNewPass.length>0 && 'Confirm New Password'}
                        value={conNewPass}
                        onChangeText={(setnewpass)=>setConNewPass(setnewpass)}
                        placeholder={'Confirm New Password'}
                        secureTextEntry={true}
                    />

                    <Button
                        onPress={onSubmitClick}
                        title={'SUBMIT'}
                        height={R.fontSize.Size45}
                        marginTop={R.fontSize.Size40}
                        marginHorizontal={R.fontSize.extraSmall}
                        backgroundColor={R.colors.buttonColor}
                        buttonTextColor={R.colors.buttonTextColor}
                    />

                    <View style={{marginTop:R.fontSize.extraSmall, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                        <Text>Remember Password?</Text>
                        <TouchableOpacity 
                        style={{marginLeft:3,alignItems:'center'}}
                        onPress={()=>props.navigation.replace('LoginScreen')}
                        >
                            <Text style={{color:R.colors.buttonColor, fontWeight:'500'}}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
            </TouchableWithoutFeedback>
            </ScrollView>
        </FullViewStoryScreen>
    )
}

export default UpdatePasswordScreen
