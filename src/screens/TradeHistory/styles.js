import * as React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import R from '../../res/R';

const Styles = StyleSheet.create ({
    mainView:
    {
        flex:1,
        backgroundColor:R.colors.white,
        paddingTop:10
    },
    cardTouchMain:
    {
        marginHorizontal:R.fontSize.Size8,
        borderRadius:R.fontSize.Size4, 
        padding:R.fontSize.Size8,
        shadowColor: "#000",shadowOffset: {width: 0,height: 4},
        shadowOpacity: 0.30,shadowRadius: 4.65,
        elevation: R.fontSize.Size8, 
        backgroundColor:R.colors.white, 
        marginVertical:R.fontSize.Size4
    },
    cardFirstView:
    {
        flexDirection:'row', 
        justifyContent:'space-between'
    },
    firstView:
    {
        flexDirection:'row', 
        alignItems:'center'
    },
    firstImage: 
    {
        height:R.fontSize.medium, 
        width:R.fontSize.medium
    },
    firstText:
    {
        fontSize:R.fontSize.small, 
        color:R.colors.secondaryTextColor,
        marginHorizontal:R.fontSize.Size5
    },
    tradeidText: 
    {
        fontSize:R.fontSize.small,
        fontWeight:'500', 
        color:R.colors.secondaryTextColor
    },
    secondMainView: 
    {
        flexDirection:'row', 
        alignItems:'center',
        marginVertical:R.fontSize.Size5, 
        justifyContent:'space-between'
    },
    secondImageView:
    {
        height:R.fontSize.XXLarge,
        width:R.fontSize.XXLarge,
        borderRadius:R.fontSize.small,
        backgroundColor:R.colors.placeholderTextColor, 
        alignItems:'center', 
        justifyContent:'center',
        overflow:'hidden',
        borderWidth:1, 
        borderColor:R.colors.placeholderTextColor
    },
    secondImage:
    {
        height:R.fontSize.XXLarge,
        width:R.fontSize.XXLarge
    },
    companyNameText:
    {
        marginLeft:R.fontSize.Size5, 
        fontSize:R.fontSize.small
    },
    ThirdMainView:
    {
        flexDirection:'row',
        justifyContent:'space-between',
        paddingVertical:R.fontSize.Size5
    },
    ThirdText:
    {
        fontSize:R.fontSize.small, 
        fontWeight:'600', 
        color:R.colors.secondaryTextColor
    }


})

export default Styles;