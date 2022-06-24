import * as React from 'react';
import {useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, Pressable, Modal, SafeAreaView, TouchableWithoutFeedback, Alert, TextInput, Dimensions, ActivityIndicator} from 'react-native'
import { StoryScreen, Button, Header, CustomTextInput } from '../../components';
import R from '../../res/R';
import LinearGradient from 'react-native-linear-gradient';
import Styles from './styles';
import {LineChart} from 'react-native-chart-kit';
import { XAxis} from 'react-native-svg-charts';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import moment from 'moment';
import { store } from '../../store';
import Toast from 'react-native-simple-toast';
import { Config } from '../../config';
import CommonFunctions from '../../utils/CommonFunctions';

const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0.9,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    
  };

const {
    auth:{authToken} 
} = store.getState();
const headerForAuth = {
    'Accept': "application/json",
    'Authorization': `Bearer ${authToken}`,
  };


const StockTrading = [
    
    {id:'1', value:'Buy', type:'Stock'},
    {id:'2', value:'Short', type:'Stock'},
    {id:'3', value:'Cover', type:'Stock'},

]


const MarketList = [
    {id:'1', value:'market', type:'market'},
    {id:'2', value:'limit', type:'market'}
]

const tradeTime = [
    // {label:'Hours'},
    {label:'Day'}
]

const data = [ 10, 40, 95, 40, 40, 85, 91, 35, 53, 73, 24, 50, 20, 80, 95, 40, 94, 85, 91, 35, 53, 33, 24, 50, 70, 0]
const data1 = [
    // Math.random() * 0,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    // Math.random() * 0,
    
]

const Bardata1 = {
    datasets: [
        {
            data:data1,   
            color: (opacity = 1) => R.colors.buttonColor, 
            strokeWidth: 2 }
    ]
};

const TradingScreen = (props) => {

    const {auth:{authToken}} = store.getState();

    const headerForAuth = {
        'Accept': "application/json",
        'Authorization' : `Bearer ${authToken}`,
    };

    const [marketStatus, setMarketStatus] = useState(false)
    const [selectTrad, setSelectTrad] = useState('Buy');
    const [selectMarket, setSelectMarket] = useState('market');

    const [ pickerModal, setPickerModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [noStock, setNoStock] = useState('')
    const [stockPrice, setStockPrice] = useState('')
    const [stopLossTrigger, setStopLossTrigger] = useState('')
    const [froms, setFroms] = useState('')
    // const [selectProduct, setSelectProduct] = useState('IntraDay')
    const [currentDate, setCurrentDate] = useState()
    const [timeGraph, setTimeGraph] = useState('minute')
    const [lastTradeQuoteData, setLastTradeQuoteData] = useState()
    const [tradingGraphData, setTradingGraphData] = useState()
    const [snapShotTickerData, setSnapShotTickerData] = useState()
    const [previousCloseData, setPreviousCloseData] = useState([])
    const [webSocketData, setWebSocketData] = useState()

    const [webSocketQuoteList, setWebSocketQuoteList] = useState()
    const [webSocketTradeList, setWebSocketTradeList] = useState()
    const [webSocketAggregateList, setWebSocketAggregateList] = useState()
    const [activePreview, setActivePreview] = useState(false)
    const [timeStamp, setTimeStamp] = useState('')

    const [profileData, setProfileData] = useState()
    const [dateList, setDateList] = useState();
    const [peRatioValue, setPERationValue] = useState()
    const [walletAmount, setWalletAmount] = useState()
    const [graphData, setGraphData] = useState([])

    const ws = new WebSocket('wss://socket.polygon.io/stocks');

    React.useEffect(() => {
        GetTotalWalletAmount()
        onCallClosedMarket(props.route.params?.from)
        OnTimeStatus()
        MarketStatusAPI()
        OnUserProfile()
        getCurrentDate()
        ProfitEarnRationDetailAPI(props.route.params?.from)
        // const unsubscribeFocus = props.navigation.addListener('focus',() => {
        //     MarketStatusAPI()

        // });
        // return unsubscribeFocus();
        
    }, [props.navigation])


    const GetTotalWalletAmount = () => {
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/maximumNumberOfShares`,{
            method:'GET',
            headers: headerForAuth
        })
        .then(res => res.json())
        .then(response => {
            console.log('Get Wallet Amount', response.wallet_amount)
            setWalletAmount(response?.wallet_amount)
            
        })
    }

    const ProfitEarnRationDetailAPI = (symbolName) => {
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/profitEarningRatioDetails?company_name=${symbolName}`,{
            method:'GET',
            headers: headerForAuth
        })
        .then(res => res.json())
        .then(response => {
            console.log('PE Ration Value and All Details ON TRADING SCREEN', response.data)
            setPERationValue(response.data)
            
        })
    }

    const MarketStatusAPI = () => {
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
                WebSocketLiveTrade(props.route.params?.from)

            }
        })
    }

    const OnTimeStatus = () => {
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/marketStatus`)
        .then(res => res.json())
        .then(responseData => {
            if(responseData?.messages?.market === 'closed')
            {
             setDateList(['4am', '6am', '8am', '10am', '12pm','2pm','4pm', '6pm'])
            }
        })
    }

    const OnMarketOpenTime = () => {
        const arrayList=[]
        const marketTime = 4.00;
        var hours = new Date().getHours();
        let time= 4.00;
        let x = hours-marketTime;
        let y = 2;
        let z = Math.floor(x / y);
        console.log('value after divide', Math.floor(z))
        console.log('value Hour', hours)
        
        for (let i=0; i<z; i++ )
        {
            time += 2
            arrayList.push(time)
            console.log("VALUE OF ARRAY",arrayList)
            setDateList(arrayList)
        }
    
    }
    


    const OnUserProfile = () => {
        
        const APIURL = `${Config.BASE_URL}HustelAppApi/public/api/user/profile`;   
        fetch(APIURL,{
            method:'GET',
            headers: headerForAuth
        })
        .then(response => response.json())
        .then(responseJson => {
            setProfileData(responseJson.profile),
            console.log('Profile Data On Home Page', responseJson.profile)
    
        })
        .catch((error)=>{
            console.log('Catch Error Message in API Services',error.message);          
        })
    }

    const OnConfirmCurrency = () => {
        setLoading(false)
        let formData = new FormData();
        formData.append('currency_type','1');
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/user/chooseCurrencyType`,{
            method:'POST',
            headers: headerForAuth,
            body: formData
        })
        .then(response => response.json())
        .then(responseJson => {
            if(responseJson.status === true)
            {
                console.log('Currency Type List ON Wallet Screen', responseJson),
                OnUserProfile()
                setLoading(true)
                props.navigation.navigate('MyWallet')
                Toast.show(responseJson.message, Toast.SHORT)   
            } else {
                 Toast.show('Please Select Currency', Toast.SHORT)
    
            }  
        })
        .catch((error)=>{
            console.log('Catch Error Message in API Services',error.message);
        })
    }

    const WebSocketLiveTrade = (text) => {
        // const ws = new WebSocket('wss://socket.polygon.io/stocks');
        ws.onopen = () => {
            ws.send(JSON.stringify({"action":"auth","params":"YjTYCa2CwDjq9uCyxWGL7s19OvETztB_"}));
            ws.send(JSON.stringify({"action":"subscribe", "params":`A.${text},T.${text},Q.${text}`}));        
          };
        ws.onmessage = (event) => {
            
            const response = JSON.parse(event.data);
            if(response[0]?.ev === 'T')
            { 
                setWebSocketTradeList(response[0])
                LoadChartData(response[0].p)
                console.log('WEB SOCKET GRAPH DATA ON TRADING SCREEN', response[0])
            }
            else if(response[0]?.ev === 'Q')
            {
                setWebSocketQuoteList(response[0]) 
            }
            else if (response[0]?.ev === 'A')
            {
                setWebSocketAggregateList(response[0])
            }
            else
            {
                console.log('Not Found Web Socket List ON TRADING SCREEN', response[0])
            }
            console.log('WEB SOCKET ON TRADING SCREEN', response[0])

            setInterval(()=>{
                ws.close();
                console.log('Closed Web Socket')
            },40000)

            };
            
        ws.onclose = () => {
            ws.close();
          };
    }

    const ArrayLIST = []
const LoadChartData = (text) => {
    if(ArrayLIST.length<25)
    {
        ArrayLIST.push(text)
        console.log('STOCK CHART BY ArrayLIST LIST', ArrayLIST)
        setTradingGraphData({
            data:ArrayLIST,   
            color: (opacity = 1) => R.colors.buttonColor, 
            strokeWidth: 2 })
    }
    else
    {
        ArrayLIST.splice(0,2)
        ArrayLIST.push(text)
        setTradingGraphData({
            data:ArrayLIST,   
            color: (opacity = 1) => R.colors.buttonColor, 
            strokeWidth: 2 })
    }
}

    const onCallClosedMarket  = (text) => {      
        onCallLastTradeQuote(text)
        StockGraphDetails(text)
    }

    const onCallLastTradeQuote = (text) => {   
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/lastTradeQuote?company_name=${text}`)
        .then(res => res.json())
        .then(responseData => {
            setLastTradeQuoteData(responseData?.data)
            setPreviousCloseData(responseData?.data?.previous_close)
            setTimeStamp(responseData?.data?.last_trade?.t)
            console.log('Last Trade and Quotes on Trading Screen', lastTradeQuoteData)  
            
        })
    }
    
    const StockGraphDetails = (text) => {
        setLoading(false)
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/aggregateBar?company_name=${text}&time=minute`)
        .then(res => res.json())
        .then(responseData => {
          return( console.log('Stock Graph Details###', responseData?.AggregatesBar),
            setGraphData([responseData?.AggregatesBar]),
            setTradingGraphData({
                data:responseData?.AggregatesBar,   
                color: (opacity = 1) => R.colors.buttonColor, 
                strokeWidth: 2 }),
             console.log('Stock Graph Details NEW', tradingGraphData),
             setLoading(true)
          )
        })
    }

    const getCurrentDate = () => {
        const Newdate = moment()
        setCurrentDate(Newdate.subtract(1,'days').format('YYYY-MM-DD')); 
        const DateDay = moment(currentDate).day();
        let i = DateDay;
        if(i==='0' || i==='1')
        {

        }
        else
        {

        }
    }

    const openStockTrading = () => {
        setModalData(StockTrading);
        setPickerModal(true);
    }
    const openMarketList = () => {
        setModalData(MarketList);
        setPickerModal(true);
    }

    const onStockTrading = (item) => {
       if(item.type === 'Stock'){
            let tempData = item
            if(tempData.id === item.id)
            {
                setSelectTrad(tempData.value);
                setPickerModal(false);
            }
       }
       else if(item.type === 'Currancy'){
            let tempData = item
            if(tempData.id === item.id)
            {
                setSelectCurrancy(tempData.value);
                setPickerModal(false);
            } 
       }
       else if(item.type === 'market'){
            let tempData = item
            if(tempData.id === item.id)
            {
                setSelectMarket(tempData.value);
                setPickerModal(false);
            }
       }    
    }

    const Bardata = {
        // labels: [dateList],
        datasets: [
            tradingGraphData
        ]
    };

    // const OnCloseWebSocket = () => {
    //     ws.close();
    //     console.log('CLOSED WEB SOCKET ')

    // }


    const onCallBUYAPI = () => {      
       if(isValid())
       {
        fetch (`${Config.BASE_URL}HustelAppApi/public/api/purchaseShares?market=${selectMarket}&number_of_shares=${noStock}&price=${selectMarket==='Market'? (webSocketTradeList?.p) :stockPrice}&request_type=buy&company_name=${props.route.params?.from}`,{
            method:'POST',
            headers: headerForAuth
        })
            .then(res => res.json())
            .then(responseData => {
                console.log('Call BUY DATA API', responseData)
                if(responseData.status === 'success')
                {
                    Toast.show(responseData.message, Toast.SHORT)  
                    setActivePreview(true)
                    props.navigation.replace('HomeScreen') 
                }
                else (responseData.status === 'error')
                {
                    Toast.show(responseData.message, Toast.SHORT)  
                }
            })
       }         
    }

    const onCallSHORTAPI = () => {
        if(isValid())
        {
        fetch (`${Config.BASE_URL}HustelAppApi/public/api/purchaseShares?market=${selectMarket}&number_of_shares=${noStock}&price=${stockPrice}&request_type=sellShort&company_name=${props.route.params?.from}`,{
            method:'POST',
            headers: headerForAuth
        })
            .then(res => res.json())
            .then(responseData => {
                console.log('Call SHORT DATA API', responseData)
                if(responseData.status === 'success')
                {
                    Toast.show(responseData.message, Toast.SHORT)  
                    props.navigation.replace('HomeScreen',{
                        from:'MenuHomeScreen'
                    })
                }
                else (responseData.status === 'error')
                {
                    Toast.show(responseData.message, Toast.SHORT)  
                }
            })
        }
    }


    const onCallCOVERBUYAPI = (text) => {
       if(isValidCover())
        {
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/purchaseSharesTypeCover?market=${selectMarket}&number_of_shares=${noStock}&price=${stockPrice}&request_type=${text}&company_name=${props.route.params?.from}&stop_loss_price=${stopLossTrigger}`,
        {
            method:'POST',
            headers: headerForAuth
        })
            .then(res => res.json())
            .then(responseData => {
                console.log('CALL COVER BUY SELL DATA API', responseData)
                if(responseData.status === 'success')
                {
                    Toast.show(responseData.message, Toast.SHORT)  
                    props.navigation.replace('HomeScreen',{
                        from:'MenuHomeScreen'
                    })
                }
                else (responseData.status === 'error')
                {
                    Toast.show(responseData.message, Toast.SHORT)  
                }
            })
        }
    }

    const isValid = () => {
        return CommonFunctions.isBlank(noStock.trim(), 'Please Enter Number of Shares')
    }

    const isValidCover = () => {
        return CommonFunctions.isBlank(noStock.trim(), 'Please Enter Number of Shares') &&
               CommonFunctions.isBlank(stopLossTrigger.trim(), 'Please Enter StopLoss Price')
    }


    const GetMaxNumberOfShare = () => {
        let StockPrice = lastTradeQuoteData?.last_trade?.p
        const NoOfStockValue = Math.floor(walletAmount/StockPrice)
        setNoStock(`${NoOfStockValue}`)
        console.log('Max Number of Share', NoOfStockValue)
    }

    return(
        <StoryScreen statusBarStyle= 'dark-content'>
            <Header
            leftSource={R.images.backButton}
            backAction={() => {props.navigation.goBack()}}
            title={'Trading'}
            />
        {
        loading ? ( 
        <View style={{flex: 1, backgroundColor:R.colors.white}}>
        {
             (profileData?.currency_name === '' || profileData?.currency_name === null)
             ?
             <View
             style={{flex:1, alignItems:'center', justifyContent:'center', marginHorizontal:25}}
             >
                 <Text style={{textAlign:'center', fontWeight:'500', fontSize:R.fontSize.large}}>{`Please!! Firstly Add USD Amount To Your Wallet `}</Text>
            
                 <TouchableOpacity
                 onPress={()=> OnConfirmCurrency()}
                 style={{height:45, backgroundColor:R.colors.buttonColor,alignItems:'center', justifyContent:'center', borderRadius:4,width:'100%', marginVertical:20}}
                 >
                     <Text style={{color:R.colors.white, fontWeight:'600', fontSize:R.fontSize.XLarge}}>My Wallet</Text>
                 </TouchableOpacity>
             </View> 
        :
        

        <View style={{flex:1}}>
        <ScrollView contentContainerStyle={{flexGrow:1}}
        showsVerticalScrollIndicator={false}
        > 
            <View style={{flex: 1, backgroundColor:R.colors.white}}>
{/* Buy Selection */}
                <View style={{marginTop:R.fontSize.extraSmall}}>
                    <View style={{flexDirection:'row',alignItems:'center', marginHorizontal:R.fontSize.extraSmall, marginBottom:R.fontSize.extraSmall}}>
                        <View style={{marginHorizontal:R.fontSize.extraSmall, flex:1}}>
                            <View style={{flexDirection:'row', height:R.fontSize.Size45, borderRadius:4,alignItems:'center', flex:1, borderWidth:1, borderColor:R.colors.placeholderTextColor}}>
                                <Text style={{marginHorizontal:R.fontSize.extraSmall,fontSize:R.fontSize.medium,flex:1,fontWeight:'500'}}>{selectTrad}</Text>
                                <TouchableOpacity
                                onPress={()=>openStockTrading()}
                                style={{paddingHorizontal:R.fontSize.extraSmall}}
                                >   
                                    <Image source={R.images.backButton} resizeMode="contain" style={{height:R.fontSize.large,width:R.fontSize.large, transform: [{rotate:'-90deg'}]  }} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                        onPress={()=>GetMaxNumberOfShare()}
                        style={{width:R.fontSize.Size60, height:R.fontSize.Size45, alignItems:'center', justifyContent:'center', borderRadius:R.fontSize.Size4, borderWidth:1, borderColor:R.colors.placeholderTextColor}}>
                         <Text style={{fontSize:R.fontSize.medium, fontWeight:'500', color:R.colors.black}}>max</Text>
                       </TouchableOpacity>

                        <View style={{marginHorizontal:R.fontSize.extraSmall, flex:1}}>
                            <View style={{flexDirection:'row', height:R.fontSize.Size45, borderRadius:4,alignItems:'center', flex:1, borderWidth:1, borderColor:R.colors.placeholderTextColor}}>
                                <Text style={{marginHorizontal:R.fontSize.extraSmall,fontSize:R.fontSize.medium,flex:1,fontWeight:'500'}}>{selectMarket}</Text>
                                <TouchableOpacity
                                onPress={()=> openMarketList()}
                                style={{paddingHorizontal:R.fontSize.extraSmall}}
                                >   
                                    <Image source={R.images.backButton} resizeMode="contain" style={{height:R.fontSize.large,width:R.fontSize.large, transform:[{rotate:'-90deg'}]}} />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    {/* Market and Stcok Value */}

                    <View style={{flexDirection:'row',alignItems:'center', marginHorizontal:R.fontSize.extraSmall}}>
                      
                      <View style={{marginHorizontal:R.fontSize.extraSmall, flex:1}}>
                          <View style={{flexDirection:'row', height:R.fontSize.Size45, borderRadius:4,alignItems:'center', flex:1, borderWidth:1, borderColor:R.colors.placeholderTextColor}}>
                              <TextInput
                                style={{paddingLeft:R.fontSize.extraSmall,flex:1,height:R.fontSize.Size45}}
                                value={noStock}
                                placeholder={'Number of Shares'}
                                placeholderTextColor={R.colors.black}
                                onChangeText={(no)=> setNoStock(no)}
                                numberOfLines={1}
                                keyboardType={'number-pad'}
                                maxLength={10}
                              />
                          </View>
                          
                      </View>

                      <View style={{marginHorizontal:R.fontSize.extraSmall, flex:1}}>
                         <View style={{flexDirection:'row', height:R.fontSize.Size45, borderRadius:4,alignItems:'center', flex:1, borderWidth:1, borderColor:R.colors.placeholderTextColor}}>
                            {
                                selectMarket==="market"
                                ?
                                <Text style={{flex:1,paddingHorizontal:R.fontSize.extraSmall,fontWeight:'500', fontSize:R.fontSize.medium}}>
                                    {`$ ${(marketStatus && webSocketTradeList?.p != null) ?  webSocketTradeList?.p : lastTradeQuoteData?.last_trade?.p}`}
                                </Text>
                            : 
                              <TextInput
                                style={{paddingLeft:R.fontSize.extraSmall,flex:1,height:R.fontSize.Size45}}
                                value={stockPrice}
                                placeholder={'Enter USD Price'}
                                onChangeText={(price)=> setStockPrice(price)}
                                numberOfLines={1}
                                keyboardType={'number-pad'}
                                maxLength={10}
                              />
                            }
                          </View>
                      </View>
                  </View>
                </View>

{/* Product Type */}

                {/* <View style={{marginHorizontal:R.fontSize.extraSmall, marginVertical:R.fontSize.extraSmall}}>
                    <Text style={{fontWeight:'600', fontSize:R.fontSize.medium, marginLeft:R.fontSize.Size8}}>Product</Text>
                    <View style={{flexDirection:'row',marginTop:4}}>
                        <TouchableOpacity
                        onPress={()=> setSelectProduct('IntraDay')}
                        style={{borderWidth: selectProduct == 'IntraDay' ? 2 : 1, borderRadius:4,height:R.fontSize.Size40, flex:1/2, alignItems:'center',justifyContent:'center',marginHorizontal:R.fontSize.Size8, borderColor:selectProduct == 'IntraDay' ? R.colors.buttonColor : R.colors.placeholderTextColor}}
                        >
                            <Text style={{fontSize:R.fontSize.medium, fontWeight: selectProduct == 'IntraDay' ? '600' : 'normal', color: selectProduct == 'IntraDay' ? R.colors.black : R.colors.placeholderTextColor}}>IntraDay</Text>
                        </TouchableOpacity>
                        {
                        selectTrad === 'Buy' &&
                        <TouchableOpacity
                        onPress={()=> setSelectProduct('LongTerm')}
                        style={{borderWidth: selectProduct == 'LongTerm' ? 2 : 1, borderRadius:4,height:R.fontSize.Size40, flex:1/2 ,alignItems:'center',justifyContent:'center',marginHorizontal:8, borderColor:selectProduct == 'LongTerm' ? R.colors.buttonColor : R.colors.placeholderTextColor}}
                        >
                            <Text style={{fontSize:R.fontSize.medium, fontWeight: selectProduct == 'LongTerm' ? '600' : 'normal', color: selectProduct == 'LongTerm' ? R.colors.black : R.colors.placeholderTextColor}}>LongTerm</Text>
                        </TouchableOpacity>
                        }
                    </View>
                </View>  */}

                {
                selectTrad === 'Cover' &&
                <View style={{marginHorizontal:R.fontSize.XLarge}}>
                    <Text style={{fontWeight:'600', fontSize:R.fontSize.medium}}>Stoploss Trigger</Text>
                    <View style={{marginTop:4, borderWidth:1, borderRadius:4, width:'50%', height:R.fontSize.Size45, borderColor:R.colors.placeholderTextColor}}>
                            <TextInput
                                style={{height:R.fontSize.Size45,marginHorizontal:5}}
                                value={stopLossTrigger}
                                placeholder={'StopLoss Price'}
                                onChangeText={(stopLoss)=> setStopLossTrigger(stopLoss)}
                                numberOfLines={1}
                                keyboardType={'number-pad'}
                                maxLength={10}
                              />
                    </View>
                </View> 
                }   


{/* Crypto Currancy Exchange */}

                <View style={{marginVertical:R.fontSize.extraSmall}}>
                    {/* {
                        console.log('WebSocket Data List on Trading Screen', webSocketData)
                    } */}
                    <View style={{borderWidth:1, borderStyle:'dashed', flex:1, borderColor:R.colors.placeholderTextColor }}/>
                         {/* <View style={{alignItems:'center', marginVertical:R.fontSize.Size8}}>
                          <Text style={{fontSize:R.fontSize.large, color:R.colors.placeholderTextColor}}>Company Syntax Name</Text>
                          <Text style={{fontSize:R.fontSize.extraSmall, color:R.colors.placeholderTextColor}}>[For News & Article Click On Syntax]</Text>
                          <View style={{paddingHorizontal:R.fontSize.Size6, borderWidth:1, marginTop:R.fontSize.Size4, borderRadius:R.fontSize.Size4, borderColor:R.colors.buttonColor}}>
                          <Text style={{fontSize: R.fontSize.EXXLarge, fontWeight:'900', color:R.colors.buttonColor}}>{props.route.params?.from}</Text>
                          </View>
                        </View> */}

                        <View style={{alignItems:'center', marginVertical:R.fontSize.Size8, flexDirection:'row', marginHorizontal:R.fontSize.large}}>
                          <View style={{flex:1}}>                         
                            <Text style={{fontSize:R.fontSize.large, color:R.colors.placeholderTextColor}}>Company Syntax Name</Text>
                            <Text style={{fontSize: R.fontSize.EXXLarge, fontWeight:'900', color:R.colors.buttonColor, textAlign:'center'}}>{props.route.params?.from}</Text>
                          </View>
                          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                            <TouchableOpacity 
                            onPress={()=> props.navigation.navigate('CompanySyntaxDetails',{
                                symbolname: props.route.params?.from,
                                from: 'TradingScreen'
                            })}
                            style={{paddingHorizontal:R.fontSize.Size8,paddingVertical:R.fontSize.Size4 ,borderWidth:1, marginTop:R.fontSize.Size4, borderRadius:R.fontSize.Size4, borderColor:R.colors.buttonColor, backgroundColor:R.colors.buttonColor}}>
                             <Text style={{fontSize: R.fontSize.medium, fontWeight:'500', color:R.colors.lightwhite}}>{`View News/Article`}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                    <View style={{borderWidth:1, borderStyle:'dashed', flex:1, borderColor:R.colors.placeholderTextColor }}/>
                </View> 

   {/*Green Card  */}
        {
        previousCloseData.map((item, index)=>{
            return(
                <View key={index}>
                        <View
                        key={index}
                        style={{marginTop:R.fontSize.Size4, flexDirection:'row',marginHorizontal:R.fontSize.extraSmall}}>
                            <LinearGradient
                            colors={['#4dab68','#377e4a']}
                            start={{x:0, y:0}}
                            end={{x:0, y:1}}
                            style={{borderRadius:4, alignItems:'center', flex:1, paddingVertical:R.fontSize.small, marginHorizontal:5}}
                            >
                                <Text style={{color:R.colors.white, fontSize:R.fontSize.XLarge, fontWeight:'600'}}>${(marketStatus && webSocketTradeList?.p!=null) ?  webSocketTradeList?.p : lastTradeQuoteData?.last_trade?.p}</Text>
                                <Text style={{color:R.colors.white, fontSize:R.fontSize.large, fontWeight:'500', marginTop:5}}>Last Price</Text>
                            </LinearGradient> 
                            <LinearGradient
                            colors={['#4dab68','#377e4a']}
                            start={{x:0, y:0}}
                            end={{x:0, y:1}}
                            style={{borderRadius:4, alignItems:'center', flex:1, paddingVertical:R.fontSize.small, marginHorizontal:5}}
                            >   
                                <View
                                style={{flex:1, flexDirection:'row',alignItems:'center',justifyContent:'center'}}
                                >
                                    <Text style={{color:R.colors.white, fontSize:R.fontSize.XLarge, fontWeight:'600',width:R.fontSize.Size60, flex:1, marginHorizontal:R.fontSize.XXLarge, textAlign:'center'}}numberOfLines={1}>
                                        {(marketStatus && webSocketTradeList?.p!=null) ? (webSocketTradeList?.p - item?.c).toFixed(4) : (lastTradeQuoteData?.last_trade?.p - item?.c).toFixed(4)}
                                    </Text>
                                    {/* <Text style={{color:R.colors.white, fontSize:R.fontSize.XLarge, fontWeight:'600', width:100, flex:1, marginHorizontal:10}} numberOfLines={1}>{((item?.c - lastTradeQuoteData?.last_trade?.p)*100)/ lastTradeQuoteData?.last_trade?.p}</Text> */}
                               
                                </View>
                                <Text style={{color:R.colors.white, fontSize:R.fontSize.large, fontWeight:'500', marginTop:5}}>Day's Change</Text>
                            </LinearGradient> 
                        </View>
            
                        {/* <View style={{flexDirection:'row', marginTop:8, justifyContent:'flex-end', marginHorizontal:22}}>
                            <Text style={Styles.BidTitle}>{`as of ${(lastTradeQuoteData?.last_trade?.t)}`}</Text>
                            <Text style={{marginLeft:10, fontSize:R.fontSize.large}}>{7636}</Text>
                        </View>       */}
            
            {/* Bid /ASK */}
            
                        <View style={{marginTop:R.fontSize.Size4, marginHorizontal:R.fontSize.small,flexDirection:'row', justifyContent:'space-between'}}>


                             <View style={{marginVertical:2, alignItems:'center', padding:R.fontSize.Size4,backgroundColor:R.colors.darkgreen, flex:1, marginHorizontal:R.fontSize.Size2, paddingVertical:R.fontSize.Size4}}>
                                    <Text style={Styles.BidTitle}>BID/ASK</Text>
                                    <Text style={Styles.BidValue} numberOfLines={1}>
                                        {(marketStatus && webSocketQuoteList?.bp != null) ? (`${(webSocketQuoteList?.bp).toFixed(1)} / ${(webSocketQuoteList?.ap).toFixed(1)}`) : (`${(lastTradeQuoteData?.last_quote?.p).toFixed(1)} / ${(lastTradeQuoteData?.last_quote?.P).toFixed(1)}`)}
                                    </Text>
                            </View>
                            <View style={{marginVertical:2, alignItems:'center', padding:R.fontSize.Size4,backgroundColor:R.colors.darkgreen,flex:1, marginHorizontal:R.fontSize.Size2, paddingVertical:R.fontSize.Size4}}>
                                    <Text style={Styles.BidTitle}>Day's Range</Text>
                                    <Text style={Styles.BidValue} numberOfLines={1}>{(marketStatus && webSocketTradeList?.p != null) ? (`${(item?.c).toFixed(1)} - ${(webSocketTradeList?.p).toFixed(1)}`) : (`${(item?.c).toFixed(1)} - ${(lastTradeQuoteData?.last_trade?.p).toFixed(1)}`)}</Text>
                            </View>
                            <View style={{marginVertical:2, alignItems:'center', padding:R.fontSize.Size4,backgroundColor:R.colors.darkgreen,flex:1, marginHorizontal:R.fontSize.Size2, paddingVertical:R.fontSize.Size4}}>
                                    <Text style={Styles.BidTitle}>Day's Volume</Text>
                                    <Text style={Styles.BidValue} numberOfLines={1}>{(marketStatus && webSocketAggregateList?.v != null) ? (webSocketAggregateList?.v) : (item?.v)}</Text>
                            </View>

                            <View style={{marginVertical:2, alignItems:'center', padding:R.fontSize.Size4,backgroundColor:R.colors.darkgreen, flex:1, marginHorizontal:R.fontSize.Size2, paddingVertical:R.fontSize.Size4}}>
                                <Text style={Styles.BidTitle}>P/E Ratio</Text>
                                <Text style={Styles.BidValue} numberOfLines={1}>
                                    {((lastTradeQuoteData?.last_trade?.p)/(peRatioValue?.value)).toFixed(2)}
                                </Text>
                            </View>
                        </View> 

                        <View style={{marginTop:R.fontSize.Size2, marginHorizontal:R.fontSize.small,flexDirection:'row', justifyContent:'space-between'}}>
                        <View style={{marginVertical:2, alignItems:'center', padding:R.fontSize.Size4,backgroundColor:R.colors.darkgreen,flex:1, marginHorizontal:R.fontSize.Size2, paddingVertical:R.fontSize.Size4}}>
                            <Text style={Styles.BidTitle}>Open Price</Text>
                            <Text style={Styles.BidValue} numberOfLines={1}>{peRatioValue?.o}</Text>
                        </View>
                        <View style={{marginVertical:2, alignItems:'center', padding:R.fontSize.Size4,backgroundColor:R.colors.darkgreen,flex:1, marginHorizontal:R.fontSize.Size2, paddingVertical:R.fontSize.Size4}}>
                            <Text style={Styles.BidTitle}>Previous Close</Text>
                            <Text style={Styles.BidValue} numberOfLines={1}>{peRatioValue?.c}</Text>
                        </View>
                        <View style={{marginVertical:2, alignItems:'center', padding:R.fontSize.Size4,backgroundColor:R.colors.darkgreen,flex:1, marginHorizontal:R.fontSize.Size2, paddingVertical:R.fontSize.Size4}}>
                            <Text style={Styles.BidTitle}>52-wk high</Text>
                            <Text style={Styles.BidValue} numberOfLines={1}>{`${peRatioValue?.week_highest_value}`}</Text>
                        </View>
                        <View style={{marginVertical:2, alignItems:'center', padding:R.fontSize.Size4,backgroundColor:R.colors.darkgreen,flex:1, marginHorizontal:R.fontSize.Size2, paddingVertical:R.fontSize.Size4}}>
                            <Text style={Styles.BidTitle}>52-wk low</Text>
                            <Text style={Styles.BidValue} numberOfLines={1}>{peRatioValue?.week_lowest_value}</Text>
                        </View>

                        </View>   
             </View>   
            )
        })
        }



            <View style={{marginVertical:20,shadowColor: "#000",shadowOffset: {width: 0,height: 5,},
                        shadowOpacity: 0.34,shadowRadius: 6.27,elevation: 10,backgroundColor:'#fff'}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:R.fontSize.large,marginVertical:15}}>
                        {
                            tradeTime.map((item,index)=>{
                                return(
                                    <TouchableOpacity
                                    key={index}
                                    onPress={()=>console.log('Pressed')}
                                    >
                                        <Text style={{fontWeight:'500', fontSize:R.fontSize.small, color:R.colors.black}}>
                                        {`Day ${marketStatus ?
                                                (moment().format("Do MMM"))
                                                    :
                                                (moment().subtract(1, 'days').format("Do MMM"))
                                                }`}
                                        </Text>
                                    </TouchableOpacity>    
                                )
                            })
                        }
                    </View> 
                   <View style={{alignItems:'center',height:screenHeight/3,justifyContent:'center'}}>
                            <LineChart
                                data={(graphData.length > 0) ? Bardata: Bardata1}
                                width={screenWidth/1.1}
                                style={{flex:1, marginHorizontal:R.fontSize.large}}
                                height={screenHeight/3.2}
                                chartConfig={chartConfig}

                            />
                            <View style={{ paddingBottom:R.fontSize.small,width:screenWidth,alignItems:'center'}}>
                            {
                            marketStatus
                            ?
                            <Text style={{fontSize:R.fontSize.small, color:R.colors.black}}>{moment().format('LT')}</Text>
                            :
                            <XAxis
                                                style={{  alignItems:'center',flexDirection:'row', justifyContent:'center', marginLeft:R.fontSize.Size60, marginRight:R.fontSize.small}}
                                                data={ dateList }
                                                xAccessor={ ({ index }) => index }
                                                formatLabel={ (value, index) => dateList[value]}
                                                contentInset={{ right:R.fontSize.Size8, left: R.fontSize.Size35}}
                                                svg={{ fontSize: R.fontSize.Size8, fill: R.colors.black }}
                            />     
                            }
                            <Text style={{fontSize:R.fontSize.small, color:R.colors.placeholderTextColor}}>Time</Text>
                            </View>
                    </View>
            </View>
{/* Estimated Order Total */}
            
            {
                activePreview &&
                <View style={{marginVertical:10, marginHorizontal:22, alignItems:'center'}}>
                    <Text style={{alignSelf:'flex-end',marginHorizontal:30, fontSize:R.fontSize.large, color:R.colors.placeholderTextColor, marginBottom:3}}>Place your order</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{flex:1, fontSize:R.fontSize.large, fontWeight:'700'}}>Estimated Order Total</Text>
                            <TouchableOpacity
                            onPress={()=> props.navigation.navigate('BuySalePreview',{
                                symbol_name : props.route.params?.from,
                                requestType: selectTrad,
                                noOfShare: noStock,
                                orderType: selectMarket,
                                productType: selectProduct
                            })}
                            style={{height:45, borderRadius:4, backgroundColor:R.colors.buttonColor,alignItems:'center',justifyContent:'center', flex:1,marginHorizontal:5}}
                            >
                                <Text style={{color:R.colors.white, fontSize:R.fontSize.large, fontWeight:'900'}}>PREVIEW</Text>
                            </TouchableOpacity>
                    </View> 
                </View>   
                }

            </View>

              

        </ScrollView>

        {
            marketStatus ?
                <View style={{ alignItems:'center', backgroundColor:R.colors.white, justifyContent:'center', borderTopWidth:0.2, paddingVertical:10}}>
                        <View style={{flexDirection:'row',marginHorizontal:15,alignItems:'center'}}>
                            {
                                selectTrad === 'Buy' && 
                                <TouchableOpacity
                                onPress={()=> onCallBUYAPI()}
                                style={{height:R.fontSize.Size45, borderRadius:4, backgroundColor:R.colors.buttonColor,alignItems:'center',justifyContent:'center', flex:1,marginHorizontal:5}}
                                >
                                    <Text style={{color:R.colors.white, fontSize:R.fontSize.large, fontWeight:'900'}}>BUY</Text>
                                </TouchableOpacity>
                                }
                                {
                                    // Sell (Short)
                                    selectTrad === 'Short' &&
                                <TouchableOpacity
                                onPress={()=> onCallSHORTAPI()}
                                style={{height:R.fontSize.Size45, borderRadius:4, backgroundColor:'red' ,alignItems:'center',justifyContent:'center', flex:1, marginHorizontal:5}}
                                >
                                    <Text style={{color:R.colors.white, fontSize:R.fontSize.large, fontWeight:'900'}}>SELL</Text>
                                </TouchableOpacity>
                                }
                        </View>
                        {
                            selectTrad === 'Cover' &&
                            <View style={{flexDirection:'row',marginHorizontal:15,alignItems:'center'}}>            
                                <TouchableOpacity
                                onPress={()=> onCallCOVERBUYAPI('cover_buy')}
                                style={{height:R.fontSize.Size45, borderRadius:4, backgroundColor:R.colors.buttonColor,alignItems:'center',justifyContent:'center', flex:1,marginHorizontal:5}}
                                >
                                    <Text style={{color:R.colors.white, fontSize:R.fontSize.large, fontWeight:'900'}}>BUY</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                onPress={()=> onCallCOVERBUYAPI('cover_sell')}
                                style={{height:R.fontSize.Size45, borderRadius:4, backgroundColor:'red' ,alignItems:'center',justifyContent:'center', flex:1, marginHorizontal:5}}
                                >
                                    <Text style={{color:R.colors.white, fontSize:R.fontSize.large, fontWeight:'900'}}>SELL</Text>
                                </TouchableOpacity>
                        </View>
                        }
                </View>
                :
               (
                   <View style={{ alignItems:'center', backgroundColor:R.colors.white, justifyContent:'center', borderTopWidth:0.2, paddingVertical:R.fontSize.extraSmall}}>
                       <Text style={{fontSize:R.fontSize.medium,color:R.colors.black, marginHorizontal:R.fontSize.XLarge, textAlign:'center', fontWeight:'700'}} 
                       numberOfLines={3}>
                           {`Market is Closed Now!!\nYou can start trading once the market will be open`}
                       </Text>
                    </View>
               )
               }
        
        </View>
        }
         </View>
         )
         :
         (    
             <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                 <ActivityIndicator  size="large" color={R.colors.buttonColor} />
             </View>    

         )
     }
        

        <Modal
        visible={pickerModal}
        animationType={'fade'}
        transparent={true}
        onRequestClose={()=>setPickerModal(false)}
        >
            <SafeAreaView style={{flex:1,backgroundColor:R.colors.modelBackground}}>
                <TouchableWithoutFeedback onPress={() => setPickerModal(false)}>
                    <View style={{flex:1, justifyContent:'flex-end'}}>
                        <View >
                        <View style={{marginHorizontal:22, backgroundColor:R.colors.white, borderRadius:4, marginVertical:10}}>
                           { 
                           modalData.map((item, index) => {
                               return(
                                <View 
                                key={index}>
                                    <TouchableOpacity
                                    onPress={()=>onStockTrading(item)}
                                    style={{alignItems:'center', justifyContent:'center', height:40}}
                                    >
                                        <Text style={{fontSize:R.fontSize.XLarge, fontWeight:'500', color:R.colors.secondaryTextColor}}>{item?.value}</Text>
                                    </TouchableOpacity>
                                    <View  style={{height:1, marginHorizontal:20, borderRadius:1, backgroundColor: R.colors.placeholderTextColor}} />
                                </View>
                               )
                           })
                            }
                        </View>
                        <View style={{marginHorizontal:22, backgroundColor:R.colors.white, borderRadius:4, marginBottom:10}}>
                            <TouchableOpacity
                            onPress={()=>setPickerModal(false)}
                            style={{height:40, width:'100%', justifyContent:'center', alignItems:'center'}}
                            >
                                <Text style={{fontWeight:'500', fontSize:R.fontSize.XLarge}}>Close</Text>
                            </TouchableOpacity>
                        </View>

                        </View>    
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </Modal>  

        </StoryScreen>

    )
}

export default TradingScreen