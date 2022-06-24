import {StyleSheet, Dimensions} from 'react-native';
import R from '../../res/R';
const screenWidth = Dimensions.get('screen').width

const Style = StyleSheet.create({

    mainView:
    {
        flex:1, 
        marginHorizontal:R.fontSize.XLarge,
        marginTop:R.fontSize.UltraXLarge,
        width:screenWidth/1.5
    },
    otherMainView:
    {
        marginVertical:R.fontSize.extraSmall, 
        flexDirection:'row'
    },
    TopView:
    {
        height:R.fontSize.Size70, 
        width:R.fontSize.Size70, 
        borderRadius:R.fontSize.Size40, 
        backgroundColor:R.colors.primaryColor,
        alignItems:'center',
        justifyContent:'center'
    },
    profileImage:
    {
        height:R.fontSize.Size70, 
        width:R.fontSize.Size70, 
        borderRadius:R.fontSize.Size40, 
        alignSelf:'center', 
        borderWidth:2, 
        borderColor:R.colors.buttonColor
    },
    blankProfileView:
    {
        height:R.fontSize.Size70, 
        width:R.fontSize.Size70, 
        borderRadius:R.fontSize.Size40, 
        backgroundColor:R.colors.placeholderTextColor, 
        alignItems:'center', 
        justifyContent:'center',
        alignSelf:'center'
    },
    profileText:
    {
        fontWeight:'900', 
        fontSize:R.fontSize.Size40, 
        textAlign:'center', 
        color:R.colors.white
    },
    touchLink:
    {
        flexDirection:'row',
        marginVertical:R.fontSize.extraSmall,
        alignItems:'center'
    },
    touchIcon:
    {
        height:R.fontSize.UltraXLarge, 
        width:R.fontSize.UltraXLarge
    },
    touchText:
    {
        fontSize:R.fontSize.large, 
        fontWeight:'500', 
        marginLeft:R.fontSize.extraSmall, 
        color:R.colors.placeholderTextColor
    }

})

export default Style