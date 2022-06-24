import * as React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Button, FullViewStoryScreen} from '../../components';
import R from '../../res/R';

const WelcomeScreen = (props) => {

    return(
        <FullViewStoryScreen statusBarStyle="dark-content">
            <View style={{flex:1, justifyContent:'center', paddingHorizontal:R.fontSize.XXLarge}}>
                <View style={{marginHorizontal:R.fontSize.XLarge}}>
                <View style={{ alignItems:'center', marginBottom:R.fontSize.Size50}}>
                    <Image source={R.images.appLogo} style={{height:R.fontSize.Size150, width:R.fontSize.Size150}} resizeMode={'contain'} />
                </View>
                <Button
                    onPress={()=>props.navigation.navigate('SignupScreen')}
                    title={'REGISTER NOW'}
                    height={R.fontSize.Size45}
                    marginTop={R.fontSize.extraSmall}
                    backgroundColor={R.colors.buttonColor}
                    buttonTextColor={R.colors.buttonTextColor}
                />
                <Button
                    onPress={()=>props.navigation.replace('LoginScreen')}
                    title={'GUEST USER'}
                    height={R.fontSize.Size45}
                    marginTop={R.fontSize.extraSmall}
                    buttonTextColor={R.colors.textinputTextColor}
                />
                </View>
            </View>
        </FullViewStoryScreen>
    )
}
export default WelcomeScreen;