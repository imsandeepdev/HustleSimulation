import {StyleSheet, Dimensions} from 'react-native';
import R from '../../res/R';
const screenWidth = Dimensions.get('screen').width

const Styles = StyleSheet.create({

    mainView:
    {
        flex:1
    },
    mainView1:
    {
        flex:1, 
        backgroundColor:R.colors.backgroundColor
    },
    TopFlexTouchView:
    {
        flex:1,
        // borderRadius:R.fontSize.Size4,
        // shadowColor: "#000",
        // shadowOffset: {width: 0,height: 4},
        // shadowOpacity: 0.30,shadowRadius: 4.65,
        // elevation: R.fontSize.Size8, 
        // paddingVertical: R.fontSize.Size4, 
        // paddingHorizontal:R.fontSize.Size4, 
        // backgroundColor:R.colors.lightgreen, 
        // marginHorizontal:R.fontSize.Size8, 
        // marginVertical:R.fontSize.extraSmall, 
        minWidth: R.fontSize.Size100,
        height: screenWidth/4.5,
        borderWidth:0.5,
        borderColor:R.colors.lightwhite,
        overflow:'hidden'   
    },
    StockIndexMainView:
    {
        paddingTop:R.fontSize.Size5, 
        marginHorizontal:R.fontSize.extraSmall, 
        flexDirection:'row'
    },
    IndexCardTitleView:
    {
        alignItems:'center',
        justifyContent:'center',
        padding:4,
        paddingHorizontal:R.fontSize.Size4,
        borderRadius:R.fontSize.Size4,
        // borderWidth:0.4,
        // borderColor:R.colors.lightwhite
    },
    IndexCardTitle:
    {
        fontSize:R.fontSize.medium, 
        fontWeight:'700',
        alignItems:'center',
        color:R.colors.white
    },
    IndexCardBottomMainView:
    {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    IndexCardBottomView:
    {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:R.fontSize.Size4
    },
    IndexUpDownImage:
    {
        height:R.fontSize.extraSmall, 
        width:R.fontSize.extraSmall,
        marginTop:2
    },
    IndexLastPrice:
    {
        marginLeft:5,
        textAlign:'center',
        fontSize:R.fontSize.medium,
        fontWeight:'600'
    },
    searchMainView:
    {
        marginHorizontal:R.fontSize.large
    },
    searchView:
    {
        borderRadius:R.fontSize.Size4, 
        backgroundColor:'#f1f1f1', 
        flexDirection:'row', 
        marginVertical:R.fontSize.Size8, 
        alignItems:'center',
        borderWidth:0.7,
        borderColor: R.colors.buttonColor
    },
    serachIcon:
    {
        height:R.fontSize.XLarge, 
        width:R.fontSize.XLarge, 
        marginHorizontal:R.fontSize.Size5,
        
    },
    searchButton:
    {
        alignItems:'center',
        padding:R.fontSize.Size6,
        backgroundColor:R.colors.buttonColor,
        width:R.fontSize.Size90,
        marginRight:1,
        borderRadius:R.fontSize.Size4
        
    },
    searchText:
    {
        fontSize:R.fontSize.medium, 
        fontWeight:'600', 
        color:R.colors.white
    },
    searchCardView:
    {
        flexDirection:'row',
        marginHorizontal:R.fontSize.large, 
        alignItems:'center', 
        paddingHorizontal:R.fontSize.Size4, 
        shadowColor: "#000",
        shadowOffset: {width: 0,height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: R.fontSize.Size5, 
        backgroundColor:'#fff',
        borderWidth:0.5,
        borderColor:R.colors.placeholderTextColor
    },
    searchIconView:
    {
        height:R.fontSize.Size42, 
        width:R.fontSize.Size42, 
        borderRadius:R.fontSize.Size4, 
        borderWidth:1,
        alignItems:'center',
        justifyContent:'center', 
        borderColor:R.colors.placeholderTextColor, 
        backgroundColor:R.colors.placeholderTextColor, 
        overflow:'hidden'
    },
    symbolIcon:
    {
        height:R.fontSize.Size40,
        width:R.fontSize.Size40
    },
    symbolcompanyName:
    {
        color:R.colors.buttonColor, 
        fontSize:R.fontSize.large, 
        fontWeight:'600'
    },
    USDCurrency:
    {
        fontSize:R.fontSize.small, 
        color:R.colors.placeholderTextColor
    },
    LineChart:
    {
        height:R.fontSize.Size80,
        marginVertical:R.fontSize.Size4,
        borderWidth:0.5, 
        borderColor:R.colors.placeholderTextColor, 
        borderRadius:R.fontSize.Size5
    },
    symbolDetailsCardTouch:
    {
        borderBottomWidth:1,
        marginHorizontal:R.fontSize.extraSmall,
        padding:R.fontSize.Size5,
        flexDirection:'row',
        alignItems:'center', 
        borderBottomColor:R.colors.placeholderTextColor
    },
    symbolDetailCardImageView:
    {
        height:R.fontSize.Size40, 
        width:R.fontSize.Size40, 
        borderRadius:R.fontSize.Size4, 
        borderWidth:1, 
        alignItems:'center', 
        justifyContent:'center', 
        borderColor:R.colors.placeholderTextColor, 
        backgroundColor:R.colors.placeholderTextColor, 
        overflow:'hidden'
    },
    symbolDetailCardImage:
    {
        height:R.fontSize.Size40, 
        width:R.fontSize.Size40,
        borderWidth:1,
        borderColor:R.colors.placeholderTextColor, 
        borderRadius:R.fontSize.Size4
    },
    cardSymbolNameText:
    {
        fontSize:R.fontSize.medium, 
        color:R.colors.black, 
        fontWeight:'600'
    },
    cardSymbolNameView:
    {
        flex:1, 
        justifyContent:'center', 
        marginHorizontal:R.fontSize.extraSmall
    },
    cardCompanyNameText:
    {
        fontSize:R.fontSize.small, 
        color:R.colors.placeholderTextColor
    },
    cardLastTradePrice:
    {
        fontSize:R.fontSize.medium, 
        color:R.colors.black, 
        fontWeight:'600', 
        textAlign:'center'
    }

})

export default Styles;
