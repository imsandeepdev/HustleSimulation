import {StyleSheet, Dimensions} from 'react-native';
import R from '../../res/R'

const Style = StyleSheet.create({

    mainView:
    {
        flex:1
    },
    myopenPositionMainCardView:
    {
        marginHorizontal:R.fontSize.extraSmall,
        alignItems:'center',
        flex:1, 
        justifyContent:'center'
    },
    myOpenpositionTitleText:
    {
        color:R.colors.placeholderTextColor, 
        fontSize:R.fontSize.medium, 
        bottom:2
    },
    myopenPositionSymbolView:
    {
        alignItems:'center', 
        height:R.fontSize.XXXLarge,
        width:R.fontSize.XXXLarge, 
        justifyContent:'center', 
        borderWidth:1, 
        borderRadius:R.fontSize.large,
        overflow:'hidden'
    }

})

export default Style;