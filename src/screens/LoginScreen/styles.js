import * as React from 'react';
import {StyleSheet} from 'react-native';
import R from '../../res/R';

const Styles = StyleSheet.create({

    mainView:{
        flex:1,
        backgroundColor:R.colors.white,
    },
    loginView:{
        marginHorizontal:R.fontSize.XXLarge, marginTop:R.fontSize.UltraXLarge
    },
    loginText:{
        fontWeight:'bold', fontSize:R.fontSize.UltraXLarge,
    },
    customTextView:{
        flex:1, 
        paddingHorizontal:R.fontSize.XXLarge, 
        justifyContent:'center', 
        backgroundColor:R.colors.white
    },
    forgotMainView:{
        marginTop:40, 
        flexDirection:'row', 
        alignItems:'center',
    },
    keepMeView:{
        flexDirection:'row', 
        alignItems:'center',flex:1
    },
    keepMeText:{
        color:R.colors.secondaryTextColor, 
        marginLeft:5, 
        fontSize:13
    },
    forgetText:{
        color: R.colors.secondaryTextColor, 
        fontSize:13
    },
    SignUpView:{
        marginTop:10, 
        alignItems:'center', 
        justifyContent:'center', 
        flexDirection:'row'
    },
    SignUpText:{
        color:R.colors.buttonColor, 
        fontWeight:'500'
    }

})

export default Styles;