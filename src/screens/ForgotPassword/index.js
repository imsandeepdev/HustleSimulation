import * as React from 'react';
import {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Button, CustomTextInput, FullViewStoryScreen} from '../../components';
import R from '../../res/R';
import CommonFunctions from '../../utils/CommonFunctions';
import {useDispatch, connect} from 'react-redux';
import {forgotpasswordRequest} from '../../actions/forgotpassword.actions';
import Toast from 'react-native-simple-toast';

const ForgotPassword = (props) => {
    const dispacth = useDispatch();
    const [email, setEmail] = useState('');
    const isValid = () => {
        return CommonFunctions.isBlank(email.trim(), 'Please Enter New Password') &&
        CommonFunctions.isEmailValid(email, 'Please enter valid Email Address')    
    }
    const onSubmitClick = () => {
        if(isValid()){
                    let formData = new FormData();
                    formData.append('email',email);
                    
                    dispacth(
                        forgotpasswordRequest(formData, response => {
                            if(response.status == true){
                                Toast.show(response.message, Toast.SHORT),
                                props.navigation.navigate('LoginScreen');

                            }
                            else{
                                Toast.show(response.message, Toast.SHORT);
                            }
                        })
                    )       
        }
    }

    return(
        <FullViewStoryScreen statusBarStyle={'dark-content'} >
            <View style={{flex:1, justifyContent:'center', paddingHorizontal:22, backgroundColor:R.colors.white}}>
                    <CustomTextInput
                        Texttitle={email.length>0 && 'Email'}
                        value={email}
                        onChangeText={(mail)=>setEmail(mail)}
                        placeholder={'Enter Your Valid Email'}
                    />
                    <Button
                        onPress={onSubmitClick}
                        title={'SUBMIT'}
                        height={R.fontSize.Size45}
                        marginTop={R.fontSize.Size40}
                        backgroundColor={R.colors.buttonColor}
                        buttonTextColor={R.colors.buttonTextColor}
                    />
                    <View style={{marginTop:10, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                        <Text>Remember Password?</Text>
                        <TouchableOpacity 
                        style={{marginLeft:3,alignItems:'center'}}
                        onPress={()=>props.navigation.replace('LoginScreen')}
                        >
                            <Text style={{color:R.colors.buttonColor, fontWeight:'500'}}>Login</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </FullViewStoryScreen>
    )
}
export default ForgotPassword
