import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, ScrollView, Dimensions, ActivityIndicator, StatusBar, Image, Modal, SafeAreaView, TouchableWithoutFeedback, TextInput} from 'react-native';
import {Header, StoryScreen, CustomTextInput} from '../../components';
import R from '../../res/R';
import {LineChart} from 'react-native-chart-kit';
import { store } from '../../store';
import Toast from 'react-native-simple-toast';
import { XAxis} from 'react-native-svg-charts';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import Style from './styles';
import { Config } from '../../config';


  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0.9,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
  };


const data1 = [
    Math.random() * 0,
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
    Math.random() * 0,
    
]


const BuySalePreview = (props) => {

const [previewData, setPreviewData] = useState()
const [loading, setLoading] = useState(false)
const [previewDataList, setPreviewDataList] = useState([])
const [lastTradeQuoteData, setLastTradeQuoteData] = useState()
const [previousCloseData, setPreviousCloseData] = useState()
const [tradingGraphData, setTradingGraphData] = useState()
const [webSocketTradeList, setWebSocketTradeList] = useState()
const [marketStatus, setMarketStatus] = useState(false)
const [updatePrice, setUpdatePrice] = useState()
const [updateQuote, setUpdateQuote] = useState()
const [ pickerModal, setPickerModal] = useState(false);


const [stockQuantity, setStockQuantity] = useState([])
const [selectStock, setSelectStock] = useState('')
const [seleckStockCondition, setSeleckStockCondition] = useState('')
const [dateList, setDateList] = useState();


const {
    auth:{authToken} 
} = store.getState();
const headerForAuth = {
    'Accept': "application/json",
    'Authorization': `Bearer ${authToken}`,
  };

useEffect(()=>{
    const unsubscribe = props.navigation.addListener('focus', () => {
        screenFocus();
    });
    return unsubscribe;
},[props.navigation])


const screenFocus = () => {
    Platform.OS === 'android' &&
    StatusBar.setBackgroundColor(R.colors.white, true);
    StatusBar.setBarStyle('dark-content', true);
    setPreviewData(props.route.params.openPositionPortFolioData)
    onCallClosedMarket(props.route.params?.symbol_name)
    // WebSocketLiveTrade(props.route.params?.symbol_name)
    OnCallBuySalePreviewList()
    MarketStatusAPI(props.route.params?.symbol_name)
    StockLength();
    OnTimeStatus()   
}

const OnTimeStatus = () => {
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/marketStatus`)
    .then(res => res.json())
    .then(responseData => {
        if(responseData?.messages?.market === 'closed')
        {
         setDateList(['4am', '6am', '8am', '10am', '12pm','2pm','4pm', '6pm'])
        }
        // else
        // {
        //     // OnMarketOpenTime()
        //     setDateList([moment().format('LT')])
        // }
    })
}

const StockLength = () => {
    const list = []
    for (let i=1 ; i <= props.route.params?.noOfShare; i++)
    {
        list.push(i)
        console.log('Numbers', i)
        setStockQuantity(list)
    }
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
            WebSocketLiveTrade(props.route.params?.symbol_name)

        }
    })
}

const WebSocketLiveTrade = () => {
    const ws = new WebSocket('wss://socket.polygon.io/stocks');
    ws.onopen = () => {
        ws.send(JSON.stringify({"action":"auth","params":"YjTYCa2CwDjq9uCyxWGL7s19OvETztB_"}));
        ws.send(JSON.stringify({"action":"subscribe", "params":`T.${props.route.params?.symbol_name},Q.${props.route.params?.symbol_name}`}));        
      };
    ws.onmessage = (event) => {    
        const response = JSON.parse(event.data);
        if(response[0]?.ev === 'T')
        { 
            setWebSocketTradeList(response[0])
            LoadChartData(response[0].p)
            setUpdatePrice(response[0].p)
            console.log('Console Log Web Socket on Preview Screen', response[0])
        }
        else if(response[0]?.ev === 'Q')
        {
            console.log('Console Log Web Socket on QUOTE SCREEN', response[0])
            setUpdateQuote(response[0])
        }
        else
        {
            console.log('Not Found Web Socket List ON BUY SALE PREVIEW', response[0])
        }
        console.log('WEB SOCKET ON BUY SALE PREVIEW', response[0])

        setInterval(()=>{
            ws.close();
            console.log('Closed Web Buy Sale Preview')
        },30000)
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
        console.log('STOCK CHART BY ArrayLIST LIST ON BUY SALE PREVIEW', ArrayLIST)
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
    setLoading(false)   
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/lastTradeQuote?company_name=${text}`)
    .then(res => res.json())
    .then(responseData => {
        setLastTradeQuoteData(responseData?.data)
        setPreviousCloseData(responseData?.data?.previous_close[0])
        console.log('Last Trade and Quotes on ON BUY SALE PREVIEW', previousCloseData)  
    })
    setLoading(true)
}

const StockGraphDetails = (text) => {
    setLoading(false)
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/aggregateBar?company_name=${text}&time=minute`)
    .then(res => res.json())
    .then(responseData => {
      return( console.log('Stock Graph Details### ON BUY SALE PREVIEW', responseData?.AggregatesBar),
        setTradingGraphData({
            data:responseData?.AggregatesBar,   
            color: (opacity = 1) => R.colors.buttonColor, 
            strokeWidth: 2 }),
         console.log('Stock Graph Details ON BUY SALE PREVIEW', tradingGraphData),
         setLoading(true)
      )
    })
}

const Bardata1 = {
    datasets: [{
        data:data1,   
        color: (opacity = 1) => R.colors.buttonColor, 
        strokeWidth: 2
    }
    ]
};

const Bardata = {
    datasets: [
        tradingGraphData
    ]
};


const OnPressBuySalePreview = () => {       
    // const value = marketStatus ?
    //             (`${(lastTradeQuoteData?.last_trade?.p * selectStock)-(previewDataList?.price_per_share * selectStock)}`)
    //             :
    //             (`${(previewDataList?.new_last_price * selectStock)-(previewDataList?.price_per_share * selectStock)}`)
    const value = (marketStatus && updatePrice != null) ? 
                                (
                                    (props.route.params?.requestType==='buy' || props.route.params?.requestType==='cover_buy')
                                    ?
                                    (`${((updatePrice * selectStock)-(previewDataList?.price_per_share * selectStock)).toFixed(3)}`)
                                    :
                                    (`${((previewDataList?.price_per_share * selectStock)-(updatePrice * selectStock)).toFixed(3)}`) 
                                )  
                                :
                                (
                                    (`${((previewDataList?.new_last_price * selectStock)-(previewDataList?.price_per_share * selectStock)).toFixed(3)}`)
                                )
                                
    console.log('Market Status Profit Loss Value', value),
    console.log('Market Status props.route.params?.tradeId', props.route.params?.tradeId),

    OnCallBuySellAPI(value)
}


const OnCallBuySellAPI = (text) => {
    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      };
    fetch (`${Config.BASE_URL}HustelAppApi/public/api/buySellWithQuantity?trade_id=${props.route.params?.tradeId}&quantity=${selectStock}&profit_loss=${text}`,{
        method:'POST',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => {
        if(response.status === 'success')
        {
            console.log('Response JSON on CallBuySell on BuySalePreview Screen', response)
            props.navigation.replace('TradeHistory')
            Toast.show(response.message, Toast.SHORT)
        }
        else
        {
            Toast.show(response.message, Toast.SHORT)
        }

    })
}

const OnselectStock = (item) => {
    const temp = item
    if(temp === item)
    {
        setSelectStock(item)
        setPickerModal(false)
    }
}

const OnCallBuySalePreviewList = () => {
    fetch(`http://18.216.142.130/HustelAppApi/public/api/onSelectTradingPdreview?trade_id=${props.route.params?.tradeId}`,{
        method:'POST',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => {
        console.log(' LIST OF BuySalePreview ScreenResponse JSON', response.data)
        setPreviewDataList(response?.data)
        setSelectStock(response.data?.number_of_shares)
        setSeleckStockCondition(response.data?.number_of_shares)
    })
}



    return(
        <StoryScreen>
            <Header
                leftSource={R.images.backButton}
                backAction={()=> props.navigation.goBack(null)}
                title={`${props.route.params?.symbol_name} Trading Preview`}
            /> 
            {  
            loading ?
            <View style={{flex:1, borderTopWidth:0.5, borderColor:R.colors.placeholderTextColor}}>
            <ScrollView
            contentContainerStyle={{flexGrow:1}}
            showsVerticalScrollIndicator={false}
            >
            <View style={Style.mainView}>
            <View style={Style.GraphMainView}>
                <View style={{alignItems:'center',height:screenHeight/3.4,justifyContent:'center'}}>

                    <LineChart
                        data={tradingGraphData != null ? Bardata : Bardata1}
                        // data={Bardata}
                        width={screenWidth/1.1}
                        style={{flex:1, marginHorizontal:R.fontSize.XLarge}}
                        height={screenHeight/3.5}
                        chartConfig={chartConfig}
                    />  
                    {/* <View style={{ paddingBottom:R.fontSize.Size4,width:screenWidth,alignItems:'center'}}>
                        {
                            marketStatus
                            ?
                            <Text style={{fontSize:R.fontSize.small, color:R.colors.black}}>{moment().format('LT')}</Text>
                            :
                        
                        <XAxis
                                            style={{  alignItems:'center',flexDirection:'row', justifyContent:'center', marginLeft:R.fontSize.Size50, marginRight:R.fontSize.Size8}}
                                            data={ dateList }
                                            xAccessor={ ({ index }) => index }
                                            formatLabel={ (value, index) => dateList[value]}
                                            contentInset={{ right:R.fontSize.Size8, left: R.fontSize.Size35}}
                                            svg={{ fontSize: R.fontSize.Size8, fill: R.colors.black }}
                        />
                        }
                        <Text style={{fontSize:R.fontSize.small, color:R.colors.placeholderTextColor}}>Time</Text>
                    </View>    */}
                </View>
                <View style={{flexWrap:'wrap', flex:1, flexDirection:'row',alignItems:'center', paddingVertical:R.fontSize.small, backgroundColor:R.colors.buttonColor,justifyContent:'center', marginHorizontal:R.fontSize.large, borderRadius:R.fontSize.Size4}}>
                

                            <View style={Style.titleMainView}>
                                <Text style={Style.titleText} numberOfLines={1}>Action</Text>
                                <Text style={Style.titleValue} numberOfLines={2}>{previewDataList?.request_type}</Text>
                            </View>
                            <View style={Style.titleMainView}>
                                <Text style={Style.titleText} numberOfLines={1}>Symbol</Text>
                                <Text style={Style.titleValue} numberOfLines={2}>{previewDataList?.company_symbol}</Text>
                            </View>
                            <View style={Style.titleMainView}>
                                <Text style={Style.titleText} numberOfLines={1}>Order Type</Text>
                                <Text style={Style.titleValue} numberOfLines={2}>{previewDataList?.market}</Text>
                            </View>
                            
                            {/* <View style={Style.titleMainView}>
                                <Text style={Style.titleText} numberOfLines={1}>Product Type</Text>
                                <Text style={Style.titleValue} numberOfLines={2}>{previewDataList?.product_type}</Text>
                            </View> */}

                            <View style={Style.titleMainView}>
                                <Text style={Style.titleText} numberOfLines={1}>Last Price</Text>
                                <Text style={Style.titleValue} numberOfLines={1}>{(marketStatus && updatePrice != null) ? updatePrice : previewDataList?.new_last_price}</Text>
                            </View>
                            <View style={Style.titleMainView}>
                                <Text style={Style.titleText} numberOfLines={1}>Days Change</Text>
                                <Text style={Style.titleValue} numberOfLines={2}>{previewDataList?.new_last_price}</Text>
                            </View>
                            <View style={Style.titleMainView}>
                                <Text style={Style.titleText} numberOfLines={1}>BID/ASK</Text>
                                <Text style={Style.titleValue} numberOfLines={1}>{
                                // marketStatus ? (`${updateQuote?.bp} / ${updateQuote?.ap}`) : 
                                (`${(previewDataList?.bid_price)} / ${(previewDataList?.ask_price)}`)}</Text>
                            </View>
                            <View style={Style.titleMainView}>
                                <Text style={Style.titleText} numberOfLines={1}>Days Range</Text>
                                <Text style={Style.titleValue} numberOfLines={1}>{(`${(previousCloseData?.c)}-${(previewDataList?.new_last_price)}`)}</Text>
                            </View>
                            <View style={Style.titleMainView}>
                                <Text style={Style.titleText} numberOfLines={1}>Days Volume</Text>
                                <Text style={Style.titleValue} numberOfLines={2}>{previewDataList?.trading_volume}</Text>
                            </View>
                </View> 
                </View>



                <View style={{backgroundColor:'#f1f1f1', paddingHorizontal:R.fontSize.large, paddingVertical:R.fontSize.small,marginTop:5}}>
                    {(seleckStockCondition > 1) 
                    &&
                    <View style={{marginBottom:R.fontSize.Size8 }}>
                        <Text style={{fontSize:R.fontSize.medium, color: R.colors.black, paddingVertical:R.fontSize.Size4}}>{`Enter Stock Quantity:`}</Text>
                        <View style={{borderWidth:0.5, height:R.fontSize.Size40, borderRadius:R.fontSize.Size4, backgroundColor:R.colors.white}}>
                            <TextInput
                                style={{flex:1,  fontSize:R.fontSize.medium, padding:R.fontSize.Size4, height:R.fontSize.Size40}}
                                value={selectStock}
                                onChangeText={(stockNo)=>setSelectStock(stockNo)}
                                placeholder={`Enter Number of Stock(Not more than ${selectStock})`}
                                maxLength={5}
                            />
                        </View>
                        
                        {/* <TouchableOpacity
                        onPress={()=> setPickerModal(true) }
                        style={{borderWidth:1, borderRadius: R.fontSize.Size4, borderColor: R.colors.placeholderTextColor, flexDirection: 'row', height:R.fontSize.Size35}}>
                            <View style={{marginHorizontal:R.fontSize.Size4,flex:1, justifyContent:'center'}}>
                                  <Text style={{fontSize:R.fontSize.medium, color: R.colors.buttonColor}} numberOfLines={1}>{`Stock Quantity `}<Text style={{fontWeight:'600', color:R.colors.buttonColor}}>{selectStock}</Text></Text>
                            </View>
                            <View style={{backgroundColor: R.colors.buttonColor, alignItems:'center', justifyContent:'center', width:R.fontSize.Size35}}>
                                <Image source={R.images.dropdown_icon} resizeMode={'contain'} style={{height: R.fontSize.XLarge, width:R.fontSize.XLarge}}/>
                            </View>
                        </TouchableOpacity> */}
                    </View>
                    }

                    <View style={{backgroundColor:R.colors.buttonColor,borderRadius:4,flexDirection:'row',paddingVertical:10, paddingHorizontal:10,alignItems:'center'}}>
                        <View style={{flex:1}}>
                            <Text style={{color:R.colors.white}}>Amount</Text>
                            <Text style={{color:R.colors.white, fontWeight:'700', fontSize:R.fontSize.XLarge, marginRight:5}}
                            numberOfLines={1}
                            >
                                {
                                (marketStatus && updatePrice != null) ?
                                (`$ ${(updatePrice * selectStock).toFixed(3)}`)
                                :
                                (`$ ${(previewDataList?.new_last_price * selectStock).toFixed(3)}`)
                                }
                            </Text>
                        </View>   
                        <View style={{flex:1}}>
                            <Text style={{color:R.colors.white}}>Profit / Loss</Text>
                            <Text style={{color:R.colors.white, fontWeight:'700', fontSize:R.fontSize.XLarge, width:100}}
                             numberOfLines={1}>
                                 {
                                     (marketStatus && updatePrice != null) ? 
                                        (
                                            (props.route.params?.requestType==='buy' || props.route.params?.requestType==='cover_buy')
                                            ?
                                            (`$ ${((updatePrice * selectStock)-(previewDataList?.price_per_share * selectStock)).toFixed(3)}`)
                                            :
                                            (`$ ${((previewDataList?.price_per_share * selectStock)-(updatePrice * selectStock)).toFixed(3)}`) 
                                        )  
                                     :
                                     (
                                        (`$ ${((previewDataList?.new_last_price * selectStock)-(previewDataList?.price_per_share * selectStock)).toFixed(3)}`)
                                     )
                                 }    
                            </Text>
                        </View>  
                    </View>    
                </View>
            </View>
            </ScrollView>

           {
            marketStatus ?
            <View style={Style.bottomView}>
                    <TouchableOpacity
                        onPress={()=> OnPressBuySalePreview()}
                        style={[Style.bottomTouch, {backgroundColor: (props.route.params?.requestType==='buy' || props.route.params?.requestType==='cover_buy')? R.colors.red : R.colors.buttonColor}]}
                    >
                            <Text style={{color:R.colors.white, fontSize:R.fontSize.large, fontWeight:'900'}}>
                                {
                                (props.route.params?.requestType==='buy' || props.route.params?.requestType==='cover_buy') ?
                                'SELL' : 'BUY'
                                }
                            </Text>
                    </TouchableOpacity>
            </View>
            :
            <View style={{ alignItems:'center', backgroundColor:R.colors.white, justifyContent:'center', borderTopWidth:0.2, paddingVertical:R.fontSize.extraSmall}}>
                <Text style={{fontSize:R.fontSize.medium,color:R.colors.black, marginHorizontal:R.fontSize.XLarge, textAlign:'center', fontWeight:'700'}} 
                numberOfLines={3}>
                    {`Market is Closed Now!!\nYou can start trading once the market will be open`}
                </Text>
            </View>
          }   
            </View>
            :
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator size={'large'} color={R.colors.buttonColor} />
            </View>
            }

        {/* <Modal
        visible={pickerModal}
        animationType={'fade'}
        transparent={true}
        onRequestClose={()=>setPickerModal(false)}
        >
            <SafeAreaView style={{flex:1,backgroundColor:R.colors.modelBackground}}>
                <TouchableWithoutFeedback onPress={() => setPickerModal(false)}>
                    <View style={{flex:1, justifyContent:'flex-end'}}>
                        <View >
                        <ScrollView
                         style={{marginHorizontal:R.fontSize.XLarge, backgroundColor:R.colors.white, borderRadius:4, marginVertical:10, maxHeight:R.fontSize.Size300}}>
                        { 
                           stockQuantity.map((item, index) => {
                               return(
                                <View 
                                key={index}>
                                    <TouchableOpacity
                                    onPress={()=>OnselectStock(item)}
                                    style={{alignItems:'center', justifyContent:'center', height:40}}
                                    >
                                        <Text style={{fontSize:R.fontSize.large, fontWeight:'500', color:R.colors.secondaryTextColor}}>{`Stock Quantity ${item}`}</Text>
                                    </TouchableOpacity>
                                    <View  style={{height:1, marginHorizontal:20, borderRadius:1, backgroundColor: R.colors.placeholderTextColor}} />
                                </View>
                               )
                           })
                        } 
                             
                        </ScrollView>
                        <View style={{marginHorizontal:R.fontSize.XLarge, backgroundColor:R.colors.white, borderRadius:4, marginBottom:10}}>
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
        </Modal>  */}



        </StoryScreen>
    )
}

export default BuySalePreview;