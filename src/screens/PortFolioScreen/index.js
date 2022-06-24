import * as React from 'react';
import {useState} from 'react';
import {View, 
    Text, 
    ScrollView,
    FlatList,
    TouchableOpacity, 
    Image, 
    Dimensions, 
    ActivityIndicator, 
    Alert,
    StatusBar} from 'react-native';
import {StoryScreen, Header} from '../../components';
import R from '../../res/R';
import { store } from '../../store';
import Styles from './styles';
import { Config } from '../../config';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';

const screenWidth = Dimensions.get('window').width; 
// const PositionsData = [
//     {id:'1', value:'Equities'},
//     {id:'2', value:'Other'},
//     {id:'3', value:'Market'},
//     {id:'4', value:'Kindly'},
//     {id:'5', value:'Equities'},
// ]


const PortFolioScreen = (props) =>{
    const [loading, setLoading] = useState(false)
    const [dropDown, setDropDown] = useState(false);
    const [dropDownData, setDropDownData] = useState('Equities');
    const [froms, setFroms] = useState('');
    const [portFolioData, setPortFolioData] = useState([]);
    const [portFolioDataValue, setPortFolioDataValue] = useState([]);
    const [openPositionData, setOpenPositionData] = useState([])
    const [marketStatus, setMarketStatus] = useState(false)
    const [companySymbolList, setCompanySymbolList] = useState([])
    const [counter, setCounter] = useState(0)
    const [loadingOpenPosition, setLoadingOpenPosition] = useState(false)

    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      };

React.useEffect(() => {  
    const unsubscribe = props.navigation.addListener('focus', () => {
        screenFocus();
    });
    return unsubscribe;
}, [props.navigation])

const screenFocus = () => {
    // Platform.OS === 'android' &&
    // StatusBar.setBackgroundColor(R.colors.white, true);
    // StatusBar.setBarStyle('dark-content', true);
    OnCoverTradingAPIUpdate()

    // OnIntraDayAPIUpdate()
    GetMyPortFolioAPI()
    GetMyOpenPositionAPI()
    GetMyPortFolioValueAPI()
    OnPendingToOpenPosition()
    MarketStatusAPI()
    const data = props.route.params?.from
    setFroms(data)
}

const onCallUpdate = () => {
        setInterval(()=>{
            OnUpdateLastPriceAPI()
            OnCoverTradingAPIUpdate()
            GetMyOpenPositionAPI()
        },35000)     
}

const MarketStatusAPI = (text) => {
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/marketStatus`)
    .then(res => res.json())
    .then(responseData => {
        if(responseData?.messages?.market === 'closed')
        {
            setMarketStatus(false)
        }
        else
        {
            setMarketStatus(true)
            onCallUpdate()
        }
    })
    .catch((err)=>{
        console.log('Error', err)
    })
}


const OnUpdateLastPriceAPI = () => {
    
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/updateLastPriceTrading`,{
        method:'GET',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => {
        if(response.status === 'success')
        {
            console.log('ONUPDATE LAST PRICE API CALLING', response)
            // OnUpdateGetMyOpenPositionAPI()
        }    
    })
    .catch((err)=>{
        console.log('Error', err)
    })
}

// const OnUpdateGetMyOpenPositionAPI = () => {  
//     setLoadingOpenPosition(false)
    
//     fetch(`${Config.BASE_URL}HustelAppApi/public/api/getDetailsOfMyOpenPosition`,
//     {
//         method:'GET',
//         headers: headerForAuth
//     })
//         .then(res => res.json())
//         .then(responseData => {
//             setLoadingOpenPosition(true)
//             setOpenPositionData(responseData?.data)
//             console.log('UPDATED GET MY OPEN POSITION API ', responseData?.data)
//         }) 
// }

const OnCoverTradingAPIUpdate = () => {
    
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/coverTrading`,{
        method:'GET',
        headers: headerForAuth
    })
    .then(res => res.text())
    .then(response => {    
            console.log('ON UPDATE GET API SUCCESS',response)
            // GetMyOpenPositionAPI()
    })
    .catch((err)=>{
        console.log('ON UPDATE GET API CATCH ERROR',err)
    })
}

// const OnIntraDayAPIUpdate = () => {
//     setLoading(false)
//     fetch(`${Config.BASE_URL}HustelAppApi/public/api/getIndraday`,{
//         method:'GET',
//         headers: headerForAuth
//     })
//     .then(res => res.json())
//     .then(response => {
//         if(response.status === 'success')
//         {
//             console.log('RESPONSE JSON ON INTRADAYN###', response)
//             GetMyOpenPositionAPI()
//             GetMyPortFolioAPI()
//             // GetMyPortFolioValueAPI()
//             Toast.show(response?.message, Toast.SHORT)
//             setLoading(true)

//         }    
//     })
//     .catch((err)=>{
//         console.log('Error', err)
//     })
// }







 
const GetMyOpenPositionAPI = () => {
    setLoadingOpenPosition(false)
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/getDetailsOfMyOpenPosition`,
    {
        method:'GET',
        headers: headerForAuth
    })
        .then(res => res.json())
        .then(responseData => {
            setLoadingOpenPosition(true)
            setOpenPositionData(responseData?.data)
            console.log('Get My Open Position Data', responseData?.data)
            // setCompanySymbolList(responseData?.data)
        }) 
        .catch((err)=>{
            console.log('Error', err)
        })
}

const GetMyPortFolioAPI = () => {
    setLoading(false)
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/getMyPortfolio`,
    {
        method:'GET',
        headers: headerForAuth
    })
        .then(res => res.json())
        .then(responseData => {
            if(responseData.status === 'success')
            {   
                setPortFolioData([
                    {id:'1',title:'Cash Balance', value: responseData?.cash_balance},
                    {id:'2',title:'Buying Power', value: responseData?.buying_power}
                ])
                console.log('PortFolio Get API', responseData)
                setLoading(true)
            }
        })
        .catch((err)=>{
            console.log('Error', err)
        })
}

const GetMyPortFolioValueAPI = () => {
    setLoading(false)
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/myPortFolioValue`,
    {
        method:'GET',
        headers: headerForAuth
    })
        .then(res => res.json())
        .then(responseData => { 
            setLoading(true)
                setPortFolioDataValue([
                    {id:'1',title:'Portfolio Value', value: responseData?.portFolioValue},
                    {id:'2',title:'Portfolio Return', value: `${responseData?.portFolioReturn}`}
                ])
                console.log('PortFolio Value and PortoFolio Return Value', responseData)
        })
        .catch((err)=>{
            console.log('Error', err)
        })
}

const OnPendingToOpenPosition = () => {
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/bringPendingToOpenPosition`,{
        method:'GET',
        headers: headerForAuth 
    })
    .then(res => res.json())
    .then(response => {
        if(response.status === "error")
        {
            console.log('RESPONSE ON PENDING TO OPEN POSITION ON ERROR', response)

        }
        else
        {
            console.log('RESPONSE ON PENDING TO OPEN POSITION SUCCESS', response)
        }
    })
    .catch((err)=>{
        console.log('Error', err)
    })
}


const onSetDropDownValue = (item) => {
    let tempData = item
    if(tempData.id === item.id)
    {
        setDropDownData(tempData.value),
        setDropDown(false)
    }
}

const removeAlert = (item) => {
    Alert.alert('','Are you sure want to delete this Trade?',[{
        text:'No',
        style:'no',
        onPress:()=>{
            
        },
    },
    {
        text:'Yes',
        onPress:()=>{
            OnLongPressTradeDelete(item)
        }
    }
    ])
    }

const OnLongPressTradeDelete = (item) => {
    setLoading(false)
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/longPressdeleteOpenPosition?trade_id=${item}`,{
        method:'POST',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => { 
            if(response.status === 'success')
            {
            setLoading(true)
            console.log('Success Delete Trade API', response)
            GetMyOpenPositionAPI()
            Toast.show(`${response.message}`,Toast.SHORT)
            }

        })
        .catch((err)=>{
            console.log('Error', err)
        })
}

    return(
        <StoryScreen statusBarStyle="dark-content">
            <Header
            leftSource={froms === 'MenuHomeScreen' ? R.images.backButton : R.images.menu_icon}
            backAction={()=>  froms === 'MenuHomeScreen' ? props.navigation.goBack()  :  props.navigation.toggleDrawer()}
            title={'My Portfolio'}
            rightContent={
                <View>
                 <Image  
                 source={R.images.wallet_icon} 
                 resizeMode={'contain'} 
                 style={{height:R.fontSize.UltraXLarge, width:R.fontSize.UltraXLarge}}
                 /> 
                </View>
            }
            rightAction={()=>props.navigation.navigate('MyWallet')}
            />
        
        <View style={{flex:1}}>
        {
            loading ?  
            <View style={Styles.mainView}>
                
            <View style={{ backgroundColor: R.colors.buttonColor}}>
                <Text style={Styles.myPortofolioText}>
                    {`My Portfolio`}
                </Text>
            </View>
            <View style={Styles.TopMainView}>
            {
                portFolioDataValue.map((item, index)=>{
                    return(             
                        <View 
                        style={Styles.portfolioCardView} key={index}>
                            <View style={{flexDirection:'row', alignItems:'center'}}> 
                                <View  style={Styles.portfolioGreenView} />
                                <Text style={{marginLeft:5}}>
                                    {item.title}
                                </Text>
                            </View>
                            <View style={{marginTop:8,alignItems:'center'}}>
                                <Text style={Styles.portfolioValueText} numberOfLines={1}>
                                    {(item.value!=undefined && item.value!='undefined') ? item.value : `00.00`}
                                </Text>
                            </View>    
                        </View>
                        )
                })
            }
           
            {
                portFolioData.map((item, index)=>{
                    return(             
                        <View 
                        style={Styles.portfolioCardView} key={index}>
                            <View style={{flexDirection:'row', alignItems:'center'}}> 
                                <View  style={Styles.portfolioGreenView} />
                                <Text style={{marginLeft:5}}>{item.title}</Text>
                            </View>
                            <View style={{marginTop:8, alignItems:'center'}}>
                                <Text style={Styles.portfolioValueText} numberOfLines={1}>
                                    {(item.value != null && item.value != '') ? item.value : '00.00'}
                                </Text>
                            </View>    
                        </View>
                        )
                })
            }
             <LinearGradient
                start={{x:1, y:0}}
                end={{x:1, y:1}}
                colors={[ R.colors.darkgreen, R.colors.buttonColor]}
                style={{flex:1, marginHorizontal:R.fontSize.small, marginVertical:R.fontSize.Size4, borderRadius:R.fontSize.Size4, overflow:'hidden', borderWidth:1, borderColor:R.colors.placeholderTextColor, padding:R.fontSize.extraSmall, paddingVertical:R.fontSize.Size6}}
            >
            <TouchableOpacity
            onPress={()=> props.navigation.navigate('TradeHistory')}
            style={{alignItems:'center'}} >    
                    <Image source={R.images.whiteTradeHistory_icon} resizeMode={'contain'} 
                    style={{height:R.fontSize.EXXLarge, width:R.fontSize.EXXLarge, marginVertical:R.fontSize.Size4}} />
                    <View style={{padding:R.fontSize.Size4}}>
                    <Text style={{fontSize:R.fontSize.medium, color:R.colors.white, fontWeight:'600'}} numberOfLines={2}>
                        Trade History
                    </Text>
                    </View>          
            </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
                start={{x:1, y:0}}
                end={{x:1, y:1}}
                colors={[ R.colors.darkgreen, R.colors.buttonColor]}
                style={{flex:1, marginHorizontal:R.fontSize.small, marginVertical:R.fontSize.Size4, borderRadius:R.fontSize.Size4, overflow:'hidden', borderWidth:1, borderColor:R.colors.placeholderTextColor, padding:R.fontSize.extraSmall, paddingVertical:R.fontSize.Size6}}
            >
            <TouchableOpacity
            onPress={()=> props.navigation.navigate('MyWatchList')}
            style={{alignItems:'center'}} >    
                    <Image source={R.images.whiteeye_icon} resizeMode={'contain'} 
                    style={{height:R.fontSize.EXXLarge, width:R.fontSize.EXXLarge, marginVertical:R.fontSize.Size4}} />
                    <View style={{padding:R.fontSize.Size4}}>
                    <Text style={{fontSize:R.fontSize.medium, color:R.colors.white, fontWeight:'600'}} numberOfLines={2}>
                         My WatchList
                    </Text>
                    </View>          
            </TouchableOpacity>
            </LinearGradient>
        </View>


        <View style={{flex:1}}>

            <View style={{marginTop:R.fontSize.extraSmall, backgroundColor: R.colors.buttonColor}}>           
                <Text style={Styles.myopenPositionText}>
                     My Open Positions
                </Text>      
            </View>
           
            {
            loadingOpenPosition ?
              
            <ScrollView
                    scrollEnabled={true}
                    horizontal={true}
                    contentContainerStyle={{flexGrow:1}}
                    showsHorizontalScrollIndicator={false}
            >
            {
                (openPositionData != null && openPositionData.length != '0')
            ?
            <ScrollView 
            contentContainerStyle={{flexGrow:1,paddingBottom:R.fontSize.extraSmall}}
            style={{paddingTop:R.fontSize.Size4}}>
            {
            openPositionData.map((item, index)=>{
                return(
                <View
                key={index}
                style={{marginHorizontal:R.fontSize.extraSmall,borderBottomWidth:0.5, borderBottomColor:R.colors.placeholderTextColor}}
                >
                    
                <TouchableOpacity
                onPress={item?.status != 'completed' ? (()=> props.navigation.navigate('BuySalePreview',{
                    symbol_name : item?.company_symbol,
                    noOfShare: item?.number_of_shares,
                    tradeId: item?.trade_id,
                    requestType: item?.request_type
                })): console.log('pressed')}
                // disabled={item?.status==='completed'}
                onLongPress={item?.status==='completed' ? (()=>  removeAlert(item?.trade_id)): console.log('LongPressed')}
                style={{flexDirection:'row', marginVertical:5,flex:1,alignItems:'flex-start',justifyContent:'center'}}>
                    <TouchableOpacity
                    style={Styles.myopenPositionMainCardView}>
                        <Text style={Styles.myOpenpositionTitleText}>Trade id</Text>
                        <View  style={{ borderRadius:R.fontSize.Size4, height:R.fontSize.XLarge, width:R.fontSize.Size50,alignItems:'center',justifyContent:'center', backgroundColor: item?.status==='completed' ? R.colors.red : R.colors.buttonColor}} >
                            <Text style={{fontSize:R.fontSize.extraSmall, color:R.colors.white}}>{item?.trade_id}</Text>
                        </View>    
                    </TouchableOpacity> 
                    <View style={Styles.myopenPositionMainCardView}>
                        <Text style={Styles.myOpenpositionTitleText}>Symbol</Text>
                        <View style={Styles.myopenPositionSymbolView}>
                            <Image source={{uri: item?.symbol}} 
                            resizeMode={'contain'} 
                            style={{height:R.fontSize.XLarge, width:R.fontSize.XLarge}}
                            />  
                        </View>    
                    </View> 
                    <View style={Styles.myopenPositionMainCardView}>
                        <Text style={Styles.myOpenpositionTitleText}>Request</Text>
                        <Text style={Styles.openPositionTextValue}> {item?.request_type}</Text>
                    </View>
                    <View style={Styles.myopenPositionMainCardView}>
                        <Text style={Styles.myOpenpositionTitleText}>Qty</Text>
                        <Text style={Styles.openPositionTextValue}>{item?.number_of_shares}</Text>
                    </View> 
                    <View style={Styles.myopenPositionMainCardView}>
                        <Text style={Styles.myOpenpositionTitleText}>Currancy</Text>
                        <Text style={Styles.openPositionTextValue}>{item?.currency_name}</Text>
                    </View> 
                    <View style={Styles.myopenPositionMainCardView}>
                        <Text style={Styles.myOpenpositionTitleText}>Price Paid</Text>
                        <Text style={Styles.openPositionTextValue}> {item?.price_per_share}</Text>
                    </View>  
                    <View style={Styles.myopenPositionMainCardView}>
                        <Text style={Styles.myOpenpositionTitleText}>Last Price</Text>
                        {/* <Text> {webSocketTradeList?.sym === item?.company_symbol ? (webSocketTradeList?.p) : (item?.last_price) }</Text> */}
                        <Text style={Styles.openPositionTextValue}> {(item?.new_last_price) }</Text>

                    </View> 
                    
 
                    <View style={[Styles.myopenPositionMainCardView,{paddingHorizontal:R.fontSize.Size4}]}>
                        <Text style={Styles.myOpenpositionTitleText}>P/L</Text>
                        {
                            (item?.request_type==='buy' || item?.request_type==='cover_buy')
                            ?
                            <Text style={{
                                fontSize: R.fontSize.medium,
                                color:          
                                    (((item?.number_of_shares)*(item.new_last_price)) - (item?.total_amount)) > 0  
                                    ? 
                                    R.colors.buttonColor:'red',
                                    textAlign:'center'}} 
                                numberOfLines={1}> {   
                                (((item?.number_of_shares)*(item?.new_last_price))-(item?.total_amount)).toFixed(2) 
                                }
                            </Text>
                            :
                            <Text style={{
                                fontSize: R.fontSize.medium,
                                color:          
                                    ((item?.total_amount)-((item?.number_of_shares)*(item.new_last_price))) > 0  
                                    ? 
                                    R.colors.buttonColor:'red',
                                    textAlign:'center'}} 
                                numberOfLines={1}> {   
                                ((item?.total_amount)-((item?.number_of_shares)*(item?.new_last_price))).toFixed(2) 
                                }
                            </Text>

                        }
                        

                    </View>
                    <View style={[Styles.myopenPositionMainCardView,{paddingHorizontal:R.fontSize.Size4}]}>
                        <Text style={Styles.myOpenpositionTitleText}>
                            Stock Amount
                        </Text>
                        <Text style={Styles.openPositionTextValue} numberOfLines={1}> 
                        {(item?.total_amount).toFixed(2)}
                        </Text>
                    </View>  
                    <View style={[Styles.myopenPositionMainCardView,{paddingHorizontal:R.fontSize.Size4}]}>
                        <Text style={Styles.myOpenpositionTitleText}>Market Value</Text>
                        {/* <Text style={{width:80, textAlign:'center'}} numberOfLines={1}> {marketStatus ? (item?.number_of_shares)*(webSocketTradeList?.p) : (item?.market_value)}</Text> */}
                        <Text style={Styles.openPositionTextValue} numberOfLines={1}> {((item?.number_of_shares)*(item?.new_last_price)).toFixed(2)}</Text>   
                    </View> 
                   
                </TouchableOpacity>
                </View>
                )
            })
            }
            </ScrollView>
            :
            <View style={{flex:1, alignItems:'center', justifyContent:'center', marginHorizontal:R.fontSize.XXLarge}}>
                <Text style={{textAlign:'center', marginHorizontal:10, fontSize:R.fontSize.medium}}>{`No stocks found in open position`}</Text>
            </View>    
            } 
            </ScrollView>
            :
            <ActivityIndicator  size={'large'} color={R.colors.buttonColor}/>
            }
            </View>
            </View>
            :
            (
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <ActivityIndicator  size="large" color={R.colors.buttonColor} />
            </View>    
            )
        }
        </View>
        </StoryScreen>
    )
}

export default PortFolioScreen;