import {StyleSheet, Dimensions} from 'react-native';
import R from '../../res/R';
const screenWidth = Dimensions.get('window').width


const Styles = StyleSheet.create({
    mainView:{
        flex:1
    },
    TopCardView:
    {
        padding:R.fontSize.extraSmall,
        borderRadius:R.fontSize.Size4, 
        height: R.fontSize.Size170,
        marginHorizontal:R.fontSize.large, 
        alignItems:'center', 
        justifyContent:'center'
    },
    currencyNameText:
    {
        fontSize:R.fontSize.medium, 
        color:R.colors.white, 
        fontWeight:'500'
    },
    currencyValueText:
    {
        fontSize:R.fontSize.EXXXLarge, 
        color:R.colors.white, 
        fontWeight:'900'
    },
    selectCurrencyMainView:
    {
        flexWrap:'wrap', 
        flex:1, 
        flexDirection:'row',
        alignItems:'center', 
        justifyContent:'center'
    },
    selectCurrencyTouch :
    {
        borderRadius:R.fontSize.Size4, 
        borderWidth:1,
        height:R.fontSize.Size50, 
        marginHorizontal: R.fontSize.extraSmall, 
        marginVertical: R.fontSize.Size5, 
        width:screenWidth/2.5,
        alignItems:'center', 
        justifyContent:'center'
    },
    selectCurrencyCheckView:
    {
        height:R.fontSize.EXXLarge,
        width:R.fontSize.EXXLarge ,
        position:'absolute',
        right:0, top:0,
        borderBottomLeftRadius:R.fontSize.large,
        alignItems:'center', 
        justifyContent:'center'
    },
    bottomCurrencyNameView:
    {
        borderWidth:1, 
        borderRadius:R.fontSize.Size4,
        height:R.fontSize.Size40,
        width: R.fontSize.Size70, 
        borderColor:R.colors.placeholderTextColor,
        alignItems:'center',
        justifyContent:'center'
    },
    bottomCurrencyValueView:
    {
        marginLeft: R.fontSize.large, 
        flex:1, 
        height: R.fontSize.Size40, 
        borderWidth:1, 
        borderColor:R.colors.placeholderTextColor, 
        borderRadius: R.fontSize.Size4
    }
})

export default Styles;