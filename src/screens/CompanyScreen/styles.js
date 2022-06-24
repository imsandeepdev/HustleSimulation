import {StyleSheet, Dimensions} from 'react-native';
import R from '../../res/R';

const Style = StyleSheet.create({

    touchView:
    {
        flexDirection:'row', 
        paddingVertical:2, 
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {width: 0,height: 2,},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: R.fontSize.Size5, 
        backgroundColor:'#fff', 
        marginHorizontal:R.fontSize.extraSmall,
        paddingHorizontal: R.fontSize.Size4, 
        marginVertical:R.fontSize.Size5,
        borderWidth:1,
        borderColor:R.colors.placeholderTextColor
    },
    imageView:
    {
        height:R.fontSize.Size42, 
        width:R.fontSize.Size42, 
        borderRadius:R.fontSize.Size4,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1, 
        overflow:'hidden',
        backgroundColor:R.colors.placeholderTextColor,
        borderColor:R.colors.placeholderTextColor
    },
    imageSyntax:
    {
        height:R.fontSize.Size40, 
        width:R.fontSize.Size40, 
        borderRadius:R.fontSize.Size4
    },
    CompanyNameView:
    {
        marginLeft:R.fontSize.Size5,
        marginHorizontal:R.fontSize.Size5, 
        minWidth:R.fontSize.Size40
    },
    companyName:
    {
        fontWeight:'600', 
        color:R.colors.black, 
        fontSize:R.fontSize.medium
    },
    usdText:
    {
        fontSize:R.fontSize.small,
        color:R.colors.placeholderTextColor
    }


})

export default Style