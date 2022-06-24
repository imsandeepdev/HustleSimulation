import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image,TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
import {Button, FullViewStoryScreen, CustomTextInput} from '../../components';
import R from '../../res/R';
import CommonFunctions from '../../utils/CommonFunctions';
import { userSignInRequest } from '../../actions/auth.actions';
import {useDispatch, connect} from 'react-redux';
import Toast from 'react-native-simple-toast';
import Styles from './styles';

const LoginScreen = (props) => {



    const dispacth = useDispatch();

    const nameRef = React.createRef();
    const emailRef = React.createRef();
    const passRef = React.createRef();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [keepMeLogIn, setKeepMeLogIn] = useState();

    useEffect(()=>{

    },[nameRef])
    
    const isValid = () => {
        return CommonFunctions.isBlank(name.trim(), 'Please enter Username') &&
        CommonFunctions.isBlank(email.trim(), 'Please Enter Email Id') &&
        CommonFunctions.isEmailValid(email, 'Please enter valid Email Address') &&
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
    
    const onLoginBtnClicked = () => {
        if(isValid()){            
             LoginApi()
        } 
    }
    
    const onShowPass = () => {
        return setShowPass(!showPass)
    }

    const onLoggedIn = () => {
        setLoggedIn(!loggedIn)
    }

    const LoginApi=()=>{
                                     
              let formData = new FormData();
              formData.append('keep_me_logged_in', loggedIn ? 0 : 1 );
              formData.append('name', name);
              formData.append('email',email);
              formData.append('password', password);
                
              dispacth(
                  userSignInRequest(formData, response => {
                    if(response.status === true)
                    {
                        console.log('New Signin', response)
                        Toast.show(response.message, Toast.SHORT);
                        props.navigation.navigate('HomeScreen')
                    }
                    else
                    {
                        console.log('Error login', response),
                        Toast.show(response.message, Toast.SHORT);
                    }
                  })
              )
    }

    return(
        <FullViewStoryScreen statusBarStyle= "dark-content">
            <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:R.colors.white}} >
                
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} > 
            <View style={Styles.mainView}>
                <View style={Styles.loginView}>    
                    <Text style={Styles.loginText}>Login</Text>
                </View>
            <View style={Styles.customTextView}>
                    
                    <CustomTextInput
                        Texttitle={name.length>0 && 'Name'}
                        ref={nameRef}
                        value={name}
                        onChangeText={(name)=>setName(name)}
                        placeholder={'Name'}
                        place
                        maxLength={30}
                        onSubmitEditing={()=>emailRef.current?.focus()}
                        returnKeyType={'next'}
                        autoFocus={true}
                    />
                    <CustomTextInput
                        Texttitle={email.length>0 && 'Email'}
                        ref={emailRef}
                        value={email}
                        onChangeText={(mail)=>setEmail(mail)}
                        placeholder={'Email'}
                        onSubmitEditing={()=>passRef.current?.focus()}
                        returnKeyType={'next'}
                        
                    />
                    <CustomTextInput
                        Texttitle={password.length>0 && 'Password'}
                        ref={passRef}
                        value={password}
                        onChangeText={(pass)=>setPassword(pass)}
                        placeholder={'Password'}
                        secureTextEntry={!showPass}
                        rightSource={showPass ? R.images.invisible_eye : R.images.visible_eye}
                        rightonPress={onShowPass}
                        returnKeyType={'done'}

                    />

                    <View style={Styles.forgotMainView}>
                        <View style={Styles.keepMeView}>
                            <TouchableOpacity onPress={()=> onLoggedIn()}>
                                <Image source={loggedIn  ? R.images.checked_radio : R.images.unchecked_radio} resizeMode={'contain'} style={{height:R.fontSize.XXLarge,width:R.fontSize.XXLarge}}/>
                            </TouchableOpacity>
                            <Text style={Styles.keepMeText}>Keep me logged in</Text>
                        </View>
                        <TouchableOpacity
                        onPress={()=>props.navigation.replace('ForgotPassword')}
                        style={{alignItems:'center'}}
                        >
                            <Text style={Styles.forgetText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <Button
                        onPress={onLoginBtnClicked}
                        // onPress={()=> props.navigation.navigate('TradingScreen')}
                        title={'LOGIN'}
                        height={R.fontSize.Size45}
                        marginTop={R.fontSize.Size40}
                        marginHorizontal={R.fontSize.extraSmall}
                        backgroundColor={R.colors.buttonColor}
                        buttonTextColor={R.colors.buttonTextColor}
                    />

                    <View style={Styles.SignUpView}>
                        <Text>Don't have an Account?</Text>
                        <TouchableOpacity 
                        style={{marginLeft:3,alignItems:'center'}}
                        onPress={()=>props.navigation.replace('SignupScreen')}
                        >
                            <Text style={Styles.SignUpText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
            </View>
            </View>
            </TouchableWithoutFeedback>
            </ScrollView>
        </FullViewStoryScreen>
    )
}


export default LoginScreen