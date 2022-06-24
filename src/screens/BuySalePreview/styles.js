import * as React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import R from '../../res/R';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Style = StyleSheet.create({
    mainView:{
        flex:1, 
        backgroundColor: R.colors.white, 
        paddingTop:10
    },
    GraphMainView:{
        // backgroundColor:R.colors.white,
        // shadowColor: "#000",
        // shadowOffset: {width: 0,height: 2},
        // shadowOpacity: 0.25,shadowRadius: 3.84,
        // elevation: 5,
        paddingVertical:5
        
    },
    LineChartView:{
        marginHorizontal:15, 
        borderWidth:1,
        alignItems:'center',
        borderColor:'#f1f1f1',
        borderTopWidth:0,
        height:screenHeight/3,
        justifyContent:'center'
    },
    titleMainView:
    {
        width:screenWidth/4.5,
        marginVertical:R.fontSize.Size4,
        padding:R.fontSize.Size4,
        alignItems:'center',
        justifyContent:'center',
        // borderWidth:0.5,
        // borderColor:R.colors.lightwhite
    },
    titleText:
    {
        color:R.colors.black, 
        textAlign:'center',
        fontSize:R.fontSize.small
    },
    titleValue:
    {
        fontWeight:'500',
        textAlign:'center',
        fontSize:R.fontSize.small,
        color:R.colors.lightwhite,
        paddingTop:R.fontSize.Size4
    },
    bottomView:
    {
        alignItems:'center', 
        backgroundColor:R.colors.white, 
        justifyContent:'center', 
        paddingVertical:R.fontSize.extraSmall, 
        paddingHorizontal: R.fontSize.XXLarge, 
        borderTopWidth:0.2
    },
    bottomTouch:
    {
        height:R.fontSize.Size45, 
        borderRadius:R.fontSize.Size4, 
        alignItems:'center',
        justifyContent:'center', 
        width:'100%', 
        marginHorizontal:R.fontSize.XXLarge
    }

})

export default Style