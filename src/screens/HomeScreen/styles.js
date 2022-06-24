import * as React from 'react';
import { StyleSheet} from 'react-native';
import R from '../../res/R';

const Styles = StyleSheet.create({
    mainView:{
        flex:1, 
        backgroundColor:R.colors.backgroundColor
    },
    dashboardText:{
        fontWeight:'700', 
        fontSize:R.fontSize.medium,
        marginVertical:R.fontSize.Size4
    },
    TopCardTouch:
    {
        flex:1,
        // borderRadius:R.fontSize.Size4,
        // shadowColor: "#000",
        // shadowOffset: {width: 0,height: 4},
        // shadowOpacity: 0.30,
        // shadowRadius: 4.65,
        // elevation: R.fontSize.Size8,
        paddingVertical:R.fontSize.extraSmall, 
        paddingHorizontal: R.fontSize.large, 
        // backgroundColor:R.colors.buttonColor, 
        // marginHorizontal:R.fontSize.Size8, 
        // marginVertical: R.fontSize.Size5,
        // borderWidth:1,
        height:R.fontSize.Size90,
        // borderColor:R.colors.placeholderTextColor,
        justifyContent:'center',
        borderWidth:1,
        borderColor:R.colors.white,
        borderRadius:R.fontSize.Size4
        
    },
    TopCardTitle:
    {
        fontSize:R.fontSize.large, 
        fontWeight:'700', 
        textAlign:'center',
        color:R.colors.black
    },
    TopCardBottomView: 
    {
        flexDirection:'row', 
        alignItems:'center', 
        height:R.fontSize.UltraXLarge, 
        justifyContent:'space-between',
        flex:1
    },
    upDownImage:
    {
        height:R.fontSize.medium, 
        width:R.fontSize.medium,
        marginTop:2
    },
    marketTopView:
    {
        flex:1
    },
    marketCardView:
    {
        flex:1,
        borderRadius:R.fontSize.Size4,
        shadowColor: "#000",
        shadowOffset: {width: 0,height: 4},
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: R.fontSize.Size8, 
        padding:R.fontSize.Size8, 
        backgroundColor:'#ddffdd'
    },
    marketGrowthImage: 
    {
        height:R.fontSize.extraSmall, 
        width:R.fontSize.extraSmall, 
        marginLeft:R.fontSize.Size5
    },
    marketUSDText:
    {
        fontSize:R.fontSize.medium, 
        color:R.colors.primaryColor, 
        marginLeft:R.fontSize.Size5
    },
    marketUSDPriceText:
    {
        fontSize:R.fontSize.medium, 
        fontWeight:'600'
    }
    
})

export default Styles;