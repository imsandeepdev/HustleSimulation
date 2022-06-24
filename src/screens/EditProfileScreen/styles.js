import {StyleSheet, Dimensions} from 'react-native';
import R from '../../res/R';

const Style = StyleSheet.create({


    profileBlankView:
    {
        height:R.fontSize.Size120, 
        width:R.fontSize.Size120, 
        borderRadius:R.fontSize.Size60, 
        backgroundColor:R.colors.placeholderTextColor, 
        alignItems:'center', 
        justifyContent:'center'
    },
    imageProfile:
    {
        height:R.fontSize.Size120, 
        width:R.fontSize.Size120, 
        borderRadius:R.fontSize.Size60, 
        borderWidth:R.fontSize.Size4, 
        borderColor:R.colors.primaryColor
    },
    textBoxMainView:
    {
        flexDirection:'row', 
        alignItems:'center', 
        marginBottom:R.fontSize.extraSmall
    },
    textBoxIconView:
    {
        width:R.fontSize.Size40,height:R.fontSize.Size40 ,
        borderWidth:1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:R.fontSize.Size4, 
        borderColor:R.colors.placeholderTextColor
    },
    Texticon:
    {
        height:R.fontSize.EXLarge,
        width:R.fontSize.EXLarge
    },
    EditImageIcon:
    {
        borderWidth:3,
        position:'absolute',
        bottom:0,right:0,
        alignItems:'center',
        justifyContent:'center', 
        borderRadius:R.fontSize.UltraXLarge, 
        height:R.fontSize.Size40,
        width:R.fontSize.Size40, 
        backgroundColor:R.colors.white, 
        borderColor:R.colors.placeholderTextColor,
    },
    modalSafe:
    {
        flex:1, 
        backgroundColor:R.colors.modelBackground
    },
    modalMainView:
    {
        flex:1, 
        justifyContent:'flex-end'
    },
    cameraMainView:
    {
        marginHorizontal:R.fontSize.XLarge, 
        backgroundColor:R.colors.white, 
        borderRadius:R.fontSize.Size4,
        marginBottom:R.fontSize.extraSmall,
        maxHeight:R.fontSize.Size300
    },

    bottomModal:
    {
        marginHorizontal:R.fontSize.XLarge, 
        backgroundColor:R.colors.white, 
        borderRadius:R.fontSize.Size4,
        marginBottom:R.fontSize.extraSmall
    },
    cameraTouch:
    {
        height:R.fontSize.Size45,
        width:'100%', 
        justifyContent:'center', 
        alignItems:'center'
    },
    cameraText:
    {
        fontSize:R.fontSize.large, 
        fontWeight:'500'
    },
    modalLine:
    {
        height:1, 
        backgroundColor:R.colors.placeholderTextColor, 
        marginHorizontal:R.fontSize.large
    }


})

export default Style