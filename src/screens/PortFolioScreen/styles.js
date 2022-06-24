import {StyleSheet, Dimensions} from 'react-native';
import R from '../../res/R';
const screenWidth = Dimensions.get('window').width; 


const Styles = StyleSheet.create({

    mainView:
    {
        flex:1
    },
    myPortofolioText:
    {
        marginHorizontal:R.fontSize.XXXLarge, 
        paddingVertical:R.fontSize.Size8, 
        fontSize:R.fontSize.large, 
        fontWeight:'600',
        color: R.colors.white
    },
    TopMainView:
    {
        flexWrap:'wrap',
        flexDirection:'row', 
        alignItems:'center', 
        marginHorizontal:R.fontSize.extraSmall,
        justifyContent:'center'
    },
    portfolioCardView:
    {
        borderRadius: R.fontSize.Size5, 
        shadowColor: "#000",
        shadowOffset: {width: 0,height: 4},
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: R.fontSize.Size8, 
        padding:R.fontSize.extraSmall, 
        backgroundColor:'#fff', 
        marginTop:R.fontSize.extraSmall, 
        marginHorizontal:R.fontSize.extraSmall, 
        width:screenWidth/2.4,
        paddingVertical:R.fontSize.small,
        borderWidth:0.5,
        borderColor: R.colors.placeholderTextColor
    },
    portfolioGreenView:
    {
        height:R.fontSize.XXLarge, 
        width:R.fontSize.XXLarge, 
        borderRadius:R.fontSize.small, 
        backgroundColor:R.colors.buttonColor
    },
    portfolioValueText: 
    {
        fontWeight:'600', 
        fontSize:R.fontSize.XLarge,
        textAlign:'center'
    },
    myopenPositionText:
    {
        marginHorizontal:R.fontSize.XXXLarge, 
        paddingVertical: R.fontSize.Size8, 
        fontSize:R.fontSize.large, 
        fontWeight:'600',
        color: R.colors.white
    },
    myopenPositionMainCardView:
    {
        marginHorizontal:R.fontSize.Size5,
        alignItems:'center',
        flex:1, 
        justifyContent:'center'
    },
    myOpenpositionTitleText:
    {
        color:R.colors.placeholderTextColor, 
        fontSize:R.fontSize.small, 
        bottom:2
    },
    myopenPositionSymbolView:
    {
        alignItems:'center', 
        height:R.fontSize.XLarge,
        width:R.fontSize.XLarge, 
        justifyContent:'center', 
        borderWidth:0.5, 
        borderRadius:R.fontSize.large,
        overflow:'hidden'
    },
    openPositionTextValue:
    {
        fontSize: R.fontSize.medium, 
        color: R.colors.secondaryTextColor,
        textAlign: 'center'
    }


})

export default Styles;