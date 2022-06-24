import * as React from 'react';
import {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, Alert, ScrollView, TouchableWithoutFeedback} from 'react-native';
import {Button, FullViewStoryScreen, CustomTextInput} from '../../components';
import R from '../../res/R';
import CommonFunctions from '../../utils/CommonFunctions';
import {useDispatch, connect} from 'react-redux';
import { userRegisterRequest } from '../../actions/register.actions';
import Toast from 'react-native-simple-toast';


const SignupScreen = (props) => {

    const dispatch = useDispatch();

    const nameRef = React.createRef();
    const emailRef = React.createRef();
    const mobRef = React.createRef();
    const passwordRef = React.createRef();
    const conpasswordRef = React.createRef();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mob, setMob] = useState('');
    const [password, setPassword] = useState('');
    const [conpassword, setConPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConPass, setShowConPass] = useState(false);


    const isValid = () => {
        return CommonFunctions.isBlank(name.trim(), 'Please enter Username') &&
        CommonFunctions.isBlank(email.trim(), 'Please Enter Email Id') &&
        CommonFunctions.isEmailValid(email, 'Please enter valid Email Address') &&
        CommonFunctions.isBlank(mob.trim(), 'Please Enter Contact Number') &&
        CommonFunctions.isBlank(password.trim(), 'Please Enter Password') &&
        checkPassword() 
    }

    const checkPassword=()=>{
        if(password.trim().length < 6){
            CommonFunctions.showToast('Password must have at least 6 Character')
            return false;
        }else{
            return true;
        }
    }

    const onRegisterBtnClicked = () => {
        if(isValid()){
             SignupAPI()
        }
    }

    const SignupAPI = ()=>{
        let formData = new FormData();
                
        formData.append('name', name);
        formData.append('email', email);
        formData.append('contact', mob);
        formData.append('password', password);
        dispatch(
            userRegisterRequest(formData, response => {

                if(response.status === true )
                {
                    Toast.show(response.message, Toast.SHORT);
                    props.navigation.replace('LoginScreen') 
                }else {
                    const Error = response.message.email
                    console.log('Signup Error:',Error)
                    Toast.show(Error.toString(), Toast.SHORT);
                }

            } )
        )
    }




    const onShowPass = () => {
        return setShowPass(!showPass)
    }
    const onShowConPass = () => {
        return setShowConPass(!showConPass)
    }

    return(
        <FullViewStoryScreen statusBarStyle= "dark-content">
          <ScrollView contentContainerStyle={{flexGrow:1, backgroundColor:R.colors.white}}> 
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >   

            <View style={{flex:1}}>   
                
                <View style={{marginHorizontal:R.fontSize.XXLarge, marginTop:R.fontSize.UltraXLarge}}>    
                    <Text style={{color:R.colors.buttonColor, fontWeight:'bold', fontSize:R.fontSize.XLarge}}>Create your</Text>
                    <Text style={{fontWeight:'bold', fontSize:R.fontSize.UltraXLarge}}>Account</Text>
                </View>
            

                <View style={{flex:1, backgroundColor:R.colors.white, paddingHorizontal:R.fontSize.XXLarge,justifyContent:'center'}}>
                     
                    <CustomTextInput
                        Texttitle={name.length>0 && 'Name'}
                        ref={nameRef}
                        value={name}
                        onChangeText={(name)=>setName(name)}
                        placeholder={'Name'}
                        maxLength={30}
                        onSubmitEditing={()=>emailRef.current?.focus()}
                        returnKeyType={'next'}
                        autoFocus={true}
                    />
                    <CustomTextInput
                        ref={emailRef}
                        Texttitle={email.length>0 && 'Email'}
                        value={email}
                        onChangeText={(mail)=>setEmail(mail)}
                        placeholder={'Email'}
                        maxLength={40}
                        onSubmitEditing={()=>mobRef.current?.focus()}
                        returnKeyType={'next'}
                    />
                    <CustomTextInput
                        ref={mobRef}
                        Texttitle={mob.length>0 && 'Contact Number'}
                        value={mob}
                        onChangeText={(mob)=>setMob(mob)}
                        placeholder={'Contact Number'}
                        keyboardType={'phone-pad'}
                        maxLength={10}
                        onSubmitEditing={()=>passwordRef.current?.focus()}
                        returnKeyType={'next'}
                    />
                    <CustomTextInput
                        ref={passwordRef}
                        Texttitle={password.length>0 && 'Password'}
                        value={password}
                        onChangeText={(pass)=>setPassword(pass)}
                        placeholder={'Password'}
                        secureTextEntry={!showPass}
                        rightSource={showPass ? R.images.invisible_eye : R.images.visible_eye}
                        rightonPress={onShowPass}
                        returnKeyType={'done'}

                    />
                    {/* <CustomTextInput
                        ref={conpasswordRef}
                        Texttitle={conpassword.length>0 && 'Confirm Password'}
                        value={conpassword}
                        onChangeText={(conpass)=>setConPassword(conpass)}
                        placeholder={'Confirm Password'}
                        secureTextEntry={!showConPass}
                        rightSource={showConPass ? R.images.invisible_eye : R.images.visible_eye}
                        rightonPress={onShowConPass}    
                    /> */}

                    <Button
                        onPress={onRegisterBtnClicked}
                        title={'REGISTER'}
                        height={R.fontSize.Size45}
                        marginTop={R.fontSize.Size40}
                        marginHorizontal={R.fontSize.extraSmall}
                        backgroundColor={R.colors.buttonColor}
                        buttonTextColor={R.colors.buttonTextColor}
                    />

                    <View style={{marginTop:R.fontSize.extraSmall, alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                        <Text>Already a member?</Text>
                        <TouchableOpacity 
                        style={{marginLeft:3,alignItems:'center'}}
                        onPress={()=> props.navigation.replace('LoginScreen')}
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

const mapStateToProps = (state, props) => ({
    loading: state.register.loading,
})

export default connect(mapStateToProps)(SignupScreen);