import * as React from 'react';
import {StyleSheet} from 'react-native';
import R from '../../res/R';

const Styles = StyleSheet.create({

    mainView:{
        flex:1, 
        paddingHorizontal:R.fontSize.XLarge, 
        justifyContent:'center', 
        backgroundColor:R.colors.white
    },
    topTextView:{
        position:'absolute',
        top:R.fontSize.XXLarge,
        marginHorizontal:R.fontSize.XXLarge,
    },
    chooseText:{
        color:R.colors.buttonColor, 
        fontWeight:'bold', 
        fontSize: R.fontSize.XLarge
    },
    currencyTypeText:{
        fontWeight:'bold', 
        fontSize:R.fontSize.UltraXLarge
    },
    belowView:{
        marginHorizontal:R.fontSize.UltraXLarge, 
        marginTop:R.fontSize.large
    },
    belowText1:{
        fontSize:R.fontSize.medium, 
        textAlign:'center'
    },
    belowText2:{
        fontWeight:'700', 
        color:R.colors.primaryColor,
        fontSize:R.fontSize.medium
    }

})

export default Styles;