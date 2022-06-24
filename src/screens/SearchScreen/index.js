import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, 
    Text, 
    FlatList, 
    Image, 
    TouchableOpacity,
    Alert, 
    ScrollView, 
    TextInput, 
    TouchableWithoutFeedback, 
    Keyboard, 
    KeyboardAvoidingView,
    Dimensions, 
    ActivityIndicator, 
    Platform,
    StatusBar} from 'react-native';
import {StoryScreen, Header} from '../../components';
import R from '../../res/R';
import { LineChart, Grid , YAxis} from 'react-native-svg-charts';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import Styles from './styles';
// import {LineChart} from 'react-native-chart-kit';
import { store } from '../../store';
import {Config} from '../../config';
import CommonFunctions from '../../utils/CommonFunctions';
import LinearGradient from 'react-native-linear-gradient';


const ws = new WebSocket('wss://socket.polygon.io/stocks');
const screenWidth = Dimensions.get("window").width;
const colors = ['#7b4173', '#a55194', '#ce6dbd', '#de9ed6']

const dataList = [12,34,55,32,11,11,51,77]

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
    Math.random() * 0,
    
]
 

const dashboardData=[
    {
        id:'1',
        title:'S&P 500',
        tradingUp:R.images.tradingUp,
        tradingDown: R.images.tradingDown,
        perText:'12%',
        growthText:'+0.02%'
    },
    {
        id:'2',
        title:'Dow Jones',
        tradingUp:R.images.tradingUp,
        tradingDown: R.images.tradingDown,
        perText:'12%',
        growthText:'+0.01%'
    },
    {
        id:'3',
        title:'Nasdaq 100',
        tradingUp:R.images.tradingUp,
        tradingDown: R.images.tradingDown,
        perText:'12%',
        growthText:'+0.03%'
    }
]

const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0.9,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
  };

  const Bardata = {
    datasets: [
      {
        data:
            [Math.random() * 50,
            Math.random() * 50,
            Math.random() * 50,
            Math.random() * 50,
            Math.random() * 50,
            Math.random() * 50,
            Math.random() * 50,
            Math.random() * 50]
      }
    ]
  };

const Token = 'YjTYCa2CwDjq9uCyxWGL7s19OvETztB_'

const SPSTOCKINDEX = ['GS','BA','DE','TGT','COP','F','ADI','PFE','GOOG','FB']
const DOWJONESSTOCKINDEX = ['INTC','WFC','T','USB','HCA','CI','WDAY','SAN','F']
const NYSESTOCKINDEX = ['TSLA','GOOG','FB','PYPL','TXN','PEP','F','ADI','USB']



const SearchScreen = (props) =>{

const [marketStatus, setMarketStatus] = useState(false)
const [selected, setSelected] = useState('All')
const [searchData, setSearchData] = useState('')
const [loading, setLoading] = useState(false)
const [searchList, setSearchList] = useState()
const [froms, setFroms] = useState('')
const [quotes, setQuotes] = useState()
const [logo, setLogo] = useState('')
const [news, setNews] = useState([])
const [stockChart, setStockChart] = useState()
const [chartDate, setChartDate] = useState([])
const [chartClose, setChartClose] = useState([])
const [chartVolume, setChartVolume] = useState()
const [onlyChartVolume, setOnlyChartVolume] = useState()
const [currentDate, setCurrentDate] = useState()
const [dailyPrice, setDailyPrice] = useState()
const [finalChartData, setFinalChartData] = useState()
const [data, setData] = useState([])
const [snapShotData, setSnapShotData] = useState()
const [lastTradeQuoteData, setLastTradeQuoteData] = useState()
const [todayChange, setTodayChange] = useState()
const [previousCloseData, setPreviousCloseData] = useState([])



const [webSocketList, setWebSocketList] = useState([])
const [webSocketQuoteList, setWebSocketQuoteList] = useState()
const [webSocketTradeList, setWebSocketTradeList] = useState()
const [webSocketAggregateList, setWebSocketAggregateList] = useState()

const [totalNasdaqLastTradePrice, setTotalNasdaqLastTradePrice] = useState('')
const [totalNasdaqPreviousClose, setTotalNasdaqPreviousClose] = useState('')
const [Nasdaqcompany, setNasdaqCompany] = useState()

const [totalSP500LastTradePrice, setTotalSP500LastTradePrice] = useState('')
const [totalSP500PreviousClose, setTotalSP500PreviousClose] = useState('')
const [SPcompany, setSPCompany] = useState()

const [totalDowJonesLastTradePrice, setTotalDowJonesLastTradePrice] = useState('')
const [totalDowJonesPreviousClose, setTotalDowJonesPreviousClose] = useState('')
const [DowJonescompany, setDowJonesCompany] = useState()

const [allCompanyDetails, setAllCompanyDetails] = useState([])
const [companyLoading, setCompanyLoading] = useState(false)
const [historyCompanyDetails, setHistoryCompanyDetails] = useState([])

const [allDetails, setAllDetails] = useState([])
const [onError, setOnError] = useState(false)
const [searchLoading, setSearchLoading] = useState(true)


React.useEffect(()=>{
    setFroms(props.route.params?.from)
    const unsubscribe = props.navigation.addListener('focus', () => {
        screenFocus();
    });
    return unsubscribe;
},[getCurrentDate])

const screenFocus = () => {
    OnCallAllCompanyDetails()
    OnCallStockHistoryCompany()
    setSearchData('')
    setLogo('')
    OnCallSP500()
    OnCallDowJonesIndex()
    OnCallNYSEStockIndex()
}

const OnCallStockHistoryCompany = () =>{
    setCompanyLoading(false)
    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      };
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/stockHistory`,{
        method:'GET',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response =>{
        console.log('Response On Call Stock History Company', response)
        setHistoryCompanyDetails([response?.data])
        setCompanyLoading(true)
    })
    .catch((err)=>{
        // setCompanyLoading(true)
        console.log('Error On Call Stock History Company ', err)
    })
}

const OnCallAllCompanyDetails = () => {
    setCompanyLoading(false)
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/allCompanyDetails`)
    .then(res => res.json())
    .then(response =>{
        console.log('Response On Call All Company Details', response.all_data)
        setAllCompanyDetails(response?.all_data)
        setCompanyLoading(true)
    })
    .catch((err)=>{
        console.log('Error On Call All Company ', err)
    })
}



const OnCallSP500 = () => {
    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      };
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/SandP500`,{
        method:'GET',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => {
        console.log('S AND P 500 STOCK INDEX VALUE', response)
        setTotalSP500LastTradePrice(response?.last_trade)
        setTotalSP500PreviousClose(response?.previous_close)
        setSPCompany(response?.company_name)
    })
}

const OnCallDowJonesIndex = () => {
    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      };
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/DowJones`,{
        method:'GET',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => {
        console.log('DOW JONES STOCK INDEX VALUE', response)
        setTotalDowJonesLastTradePrice(response?.last_trade)
        setTotalDowJonesPreviousClose(response?.previous_close)
        setDowJonesCompany(response?.company_name)
    })
}

const OnCallNYSEStockIndex = () => {
    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      };
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/Nasdaq100`,{
        method:'GET',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => {
        console.log('NASDAQ STOCK INDEX VALUE', response)
        setTotalNasdaqLastTradePrice(response?.last_trade)
        setTotalNasdaqPreviousClose(response?.previous_close)
        setNasdaqCompany(response?.company_name)
    })
}



const getCurrentDate = () => {
   
    setCurrentDate(moment().subtract(4, 'days').format('YYYY-MM-DD'))
    console.log('Previous Date', currentDate)

}

const isValid = () => {
    return CommonFunctions.isBlank(searchData.trim(), 'Please Enter Valid Symbol Name')
}

const MarketStatusAPI = (text) => {
    if(isValid())
    {
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/marketStatus`)
        .then(res => res.json())
        .then(responseData => {
            if(responseData?.messages?.market === 'closed')
            {
                setMarketStatus(false)
                onCallClosedMarket(text)
            }
            else
            {
                setMarketStatus(true)
                onCallOpenMarket(text)
            }
        })
    }
}




const onCallClosedMarket  = (text) => {  
    LoadSearchDetails(text)
    // loadLogoForStock(text)
    // loadDetailsForTicker(text)
    // loadChartForStock(text)
    // onCallLastTradeQuote(text)
    // LoadChartData()
  

}

const onCallOpenMarket = (text) => {
    LoadSearchDetails(text)
    // loadLogoForStock(text)
    // loadDetailsForTicker(text)
    // loadChartForStock(text)
    // SnapshotTicker(text)
    // onCallLastTradeQuote(text) 
    // WebSocketLiveQuote(text)
    // WebSocketLiveTrade(text)
    
}

// const WebSocketLiveTrade = (text) => {
//     const ws = new WebSocket('wss://socket.polygon.io/stocks');
//     ws.onopen = () => {
//         ws.send(JSON.stringify({"action":"auth","params":"YjTYCa2CwDjq9uCyxWGL7s19OvETztB_"}));
//         ws.send(JSON.stringify({"action":"subscribe", "params":`A.${text},T.${text},Q.${text}`}));
        
       
//       };
//     ws.onmessage = (event) => {
//         const response = JSON.parse(event.data);
//         setInterval(()=>{

//             if(response[0]?.ev === 'T')
//             {
//                 setWebSocketTradeList(response[0])
               
//                 LoadChartData(response[0]?.p)
               
//                 console.log('Last Trade Price',response[0]?.p) 
//             }
//             else if(response[0]?.ev === 'Q')
//             {
//                 setWebSocketQuoteList(response[0])
//             }
//             else if (response[0]?.ev === 'A')
//             {
//                 setWebSocketAggregateList(response[0]?.v)
//             }
//             else
//             {
//                 console.log('Not Found Web Socket List', response[0])
//                 ws.onclose = () => {
//                     ws.close();
//                   };
//             }

//         },9000)
        
//         console.log('WEB SOCKET API LIST', response[0])
//         };
        
//     ws.onclose = () => {
//         ws.close();
//       };
// }

const LoadSearchDetails = (text) => {
    setSearchLoading(false)
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/searchCompanyDetailsWithGraph?company_name=${text}`)
    .then(res => res.json())
    .then(response => {
        console.log('Serach Details API', response)
        setSearchLoading(true)
        setOnError(false)
        setAllDetails(response?.data)
    })
    .catch((err)=>{
        setOnError(true)
        setSearchLoading(true)
        console.log('Catch Error on Search Details', err)
    })
}


// const loadLogoForStock = text => {    
//     fetch(`https://api.polygon.io/v1/meta/symbols/${text}/company?apiKey=${Token}`)
//     .then(res => res.json())
//     .then(responseData => {
//         console.log('Company Logo', responseData)
//         setLogo(responseData?.logo)
//     })
// }

// const loadDetailsForTicker = text => {
//     fetch(`https://api.polygon.io/vX/reference/tickers/${text}?apiKey=${Token}`)
//     .then(res => res.json())
//     .then(responseData => {
//         console.log('Search Data Value Quotes', responseData.results),
//         setQuotes({currencyName: responseData?.results?.currency_name,
//                     tickerSyntax: responseData?.results?.ticker
//         })
//         console.log('Search List Data Quotes', quotes)
//     })
// }

// const onCallLastTradeQuote = (text) => {
//     fetch(`${Config.BASE_URL}HustelAppApi/public/api/lastTradeQuote?company_name=${text}`)
//     .then(res => res.json())
//     .then(responseData => {
//         setLastTradeQuoteData(responseData?.data)
//         setPreviousCloseData(responseData?.data?.previous_close)
//         console.log('Last Trade and Quotes AND Previous Closed', responseData.data)
//     })
// }



// const loadChartForStock = (text) => {
//     setLoading(false)
//     fetch(`${Config.BASE_URL}HustelAppApi/public/api/aggregateBar?company_name=${text}&time=minute`)
//      .then(res => res.json())
//      .then(responseData => {
//          setData(responseData?.AggregatesBar),
//          console.log('Volume List DataSEARCH SCREEN', responseData?.AggregatesBar)
//          setLoading(true)

//      })
// }
// const ArrayLIST = []
// const LoadChartData = (text) => {
//     if(ArrayLIST.length<25)
//     {
//         ArrayLIST.push(text)
//         console.log('STOCK CHART BY ArrayLIST LIST SEARCH SCREEN', ArrayLIST)
//         setData(ArrayLIST)
//         console.log('STOCK CHART BY ArrayLIST LIST SEARCH SCREEN SET DATA', data)

//     }
//     else
//     {
//         ArrayLIST.splice(0,2)
//         ArrayLIST.push(text)
//         setData(ArrayLIST)
//     }
// }


// const SnapshotTicker = (text) => {
//     fetch(`${Config.BASE_URL}HustelAppApi/public/api/snapshotTicker?company_name=${text}`)
//     .then(res => res.json())
//     .then(responseData => {
//         setSnapShotData(responseData?.data?.ticker)
//         setTodayChange(responseData?.data?.ticker?.todaysChange)
//         console.log('SnapShot Ticker Details',snapShotData)
//         console.log('SnapShot Ticker set Today Changes',todayChange)

//     })
// }



// const AllValue = [
//     {
//     symbol: logo,
//     quotesData:quotes,
//     // stockChartVolume: data,
//     WebSocketTradeData: webSocketTradeList,
//     lastTradeQuotes: lastTradeQuoteData,
//     snapShotTickerValue: snapShotData,
//     WebSocketQuoteData: webSocketQuoteList,
//     WebSocketAggregateData: webSocketAggregateList
// }
// ]

// const callOnValue = () => {
//     AllValue.map((item, index)=>{
//         console.log('All Value',item)

//     })
// }


// const onCallStockExchange = (item) => {

//     const tempData = item
//     console.log('TempData', tempData)
//     if(tempData.id == item.id)
//     {
//         props.navigation.navigate('CompanyScreen',{
//             from: item.title
//         })
//     }
// }

// const onWishListAdd = () => {
//     return(
//         Toast.show('Add to Wishlist', Toast.SHORT)
//     )
// }

// const dataLine = [-100,50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80,-100]


const NavigateToTradingScreen = (item) => {
        props.navigation.navigate('TradingScreen',{
        from: item 
    })
}

// const Bardata = {
//     datasets: [
//       chartVolume
//     ]
//   };


const onAddWatchListAPI = (syntaxName) => {
    const {
        auth:{authToken}
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
    };
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/customerWishListApi?company_name=${syntaxName}`,{
        method:'POST',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => {
        console.log('reasponse Data on Company Screen', response)
        Toast.show(response.message, Toast.SHORT)
    })
}

const IndexTouchCard =(props) => {
    return(
        <LinearGradient
                start={{x:1, y:0}}
                end={{x:1, y:1}}
                colors={[ R.colors.darkgreen, R.colors.buttonColor]}
        style={{flex:1, marginHorizontal:R.fontSize.Size8, marginVertical:R.fontSize.Size4, borderRadius:R.fontSize.Size4, overflow:'hidden', borderWidth:0.5, borderColor:R.colors.placeholderTextColor,height:screenWidth/4.5, padding:2,shadowColor: "#000",
        shadowOffset: {width: 0,height: 4},
         shadowOpacity: 0.30,shadowRadius: 4.65,
        elevation: R.fontSize.Size8 }}
        >
        <TouchableOpacity
            onPress={props.onPress}
            style={Styles.TopFlexTouchView}>
                <View style={Styles.IndexCardTitleView}>
                    <Text style={Styles.IndexCardTitle}>
                        {props.title}
                    </Text>
                </View>
                <View style={Styles.IndexCardBottomMainView}>
                    <View style={Styles.IndexCardBottomView}>
                        <Image source={props.upDownImage} 
                            resizeMode={'contain'}
                            style={Styles.IndexUpDownImage}
                        />
                        <Text style={props.lastTradePriceStyle} 
                        numberOfLines={1}>
                            {props.lastTradePrice}
                        </Text>
                    </View> 
                    <View>
                    <Text style={props.ratioPriceStyle} 
                    numberOfLines={1}>
                        {props.ratioPrice}
                    </Text>     
                    </View>
                </View>
        </TouchableOpacity>
        </LinearGradient>
    )
}

const SymbolDetailCard = (props) => {
    return(
        <TouchableOpacity
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        style={Styles.symbolDetailsCardTouch}>
            <View style={Styles.symbolDetailCardImageView}>
                <Image 
                source={{uri: props.symbolIcon}}
                style={Styles.symbolDetailCardImage} 
                resizeMode={'contain'}
                />
            </View>
            <View style={Styles.cardSymbolNameView}>
                <Text 
                     style={Styles.cardSymbolNameText}
                     numberOfLines={1}>
                    {props.symbolName}
                </Text>
                <Text style={Styles.cardCompanyNameText}numberOfLines={1}>{props.companyName}</Text>
            </View> 
            <View style={{padding:R.fontSize.Size5, maxWidth:R.fontSize.Size90}}> 
                <Text 
                    style={Styles.cardLastTradePrice} 
                    numberOfLines={1}>
                    {props.lastTradePrice}
                </Text>  
            </View>
        </TouchableOpacity> 
    )
}



    return(
        <StoryScreen statusBarStyle="dark-content">
            <Header
            leftSource={froms === 'WatchList'? R.images.backButton : R.images.menu_icon}
            backAction={froms=== 'WatchList' ? ()=>props.navigation.goBack() :()=> props.navigation.toggleDrawer()}
            title={'Search'}
            />

            <View style={Styles.mainView}>
            <View style={Styles.mainView1}> 
            <View style={Styles.StockIndexMainView}>

                            <IndexTouchCard
                                onPress={()=>{
                                    props.navigation.navigate('CompanyScreen',{
                                        STOCKINDEX: 'SandP500CompanyListing',
                                        from:'S&P 500',
                                        fromScreen: 'Search'
                                    }) 
                                }}
                                title={'S&P 500'}
                                upDownImage = {(totalSP500LastTradePrice - totalSP500PreviousClose < 0) ? R.images.red_down : R.images.tradingUpWhite}
                                lastTradePrice={(totalSP500LastTradePrice - totalSP500PreviousClose).toFixed(3)}
                                lastTradePriceStyle={[Styles.IndexLastPrice ,{color: (totalSP500LastTradePrice - totalSP500PreviousClose < 0) ? R.colors.red : R.colors.lightwhite}]}
                                ratioPrice = {(((totalSP500LastTradePrice - totalSP500PreviousClose)*100) / totalSP500PreviousClose).toFixed(3) }
                                ratioPriceStyle = {[Styles.IndexLastPrice  ,{color: (totalSP500LastTradePrice - totalSP500PreviousClose < 0) ? R.colors.red : R.colors.lightwhite}]}
                            />
                            <IndexTouchCard
                                onPress={()=>{
                                    props.navigation.navigate('CompanyScreen',{
                                        STOCKINDEX: 'DowJonesCompanyListing',
                                        from: 'Dow Jones',
                                        fromScreen: 'Search'
                                    }) 
                                }}
                                title={'Dow Jones'}
                                upDownImage = {(totalDowJonesLastTradePrice - totalDowJonesPreviousClose < 0) ? R.images.red_down : R.images.tradingUpWhite}
                                lastTradePrice={(totalDowJonesLastTradePrice - totalDowJonesPreviousClose).toFixed(3)}
                                lastTradePriceStyle={[Styles.IndexLastPrice ,{color: (totalDowJonesLastTradePrice - totalDowJonesPreviousClose < 0) ? R.colors.red : R.colors.lightwhite}]}
                                ratioPrice = {(((totalDowJonesLastTradePrice - totalDowJonesPreviousClose)*100) / totalDowJonesPreviousClose ).toFixed(3)}
                                ratioPriceStyle = {[Styles.IndexLastPrice  ,{color: (totalDowJonesLastTradePrice - totalDowJonesPreviousClose < 0) ? R.colors.red : R.colors.lightwhite}]}
                            />
                            <IndexTouchCard
                                onPress={()=>{
                                    props.navigation.navigate('CompanyScreen',{
                                        STOCKINDEX: 'Nasdaq100CompanyListing',
                                        from: 'Nasdaq 100', 
                                        fromScreen: 'Search'
                                    }) 
                                }}
                                title={'Nasdaq 100'}
                                upDownImage = {(totalNasdaqLastTradePrice - totalNasdaqPreviousClose < 0) ? R.images.red_down : R.images.tradingUpWhite}
                                lastTradePrice={(totalNasdaqLastTradePrice - totalNasdaqPreviousClose).toFixed(3)}
                                lastTradePriceStyle={[Styles.IndexLastPrice ,{color: (totalNasdaqLastTradePrice - totalNasdaqPreviousClose < 0) ? R.colors.red : R.colors.lightwhite}]}
                                ratioPrice = {(((totalNasdaqLastTradePrice - totalNasdaqPreviousClose)*100) / totalNasdaqPreviousClose).toFixed(3) }
                                ratioPriceStyle = {[Styles.IndexLastPrice  ,{color: (totalNasdaqLastTradePrice - totalNasdaqPreviousClose < 0) ? R.colors.red : R.colors.lightwhite}]}
                            /> 

                </View> 
                <View style={{flex:1}}>
                    <View style={Styles.searchMainView}> 
                        <View
                        style={Styles.searchView}
                        >
                            <Image  
                            source={R.images.search_icon} 
                            resizeMode={'contain'} 
                            style={Styles.serachIcon}
                            />
                            <View style={{flex:1}}>
                            <TextInput
                                style={{paddingVertical:0, fontSize:R.fontSize.small}}
                                placeholder={'Enter Company Symbol Name'}
                                numberOfLines={1}
                                maxLength={40}
                                value={searchData}
                                onChangeText={(val)=>setSearchData(val)}
                                autoCapitalize={'characters'}
                            /> 
                            </View>
                            <TouchableOpacity
                            style={Styles.searchButton}
                            onPress={()=> MarketStatusAPI(searchData)}
                            >
                                <Text style={Styles.searchText}>Search</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                {
                searchLoading
                ?
                <View>
                {
                onError
                ?
                <View style={{alignItems:'center',justifyContent:'center',paddingVertical:R.fontSize.Size4}}>
                            <Text style={{fontSize:R.fontSize.medium, color:R.colors.black}}>
                                 Please Enter Valid Symbol Name in Search Box
                            </Text>
                </View>
                :
                
                    <View>                    
                    {  
                        allDetails.map((item, index)=>{
                        return(
                             
                        <TouchableOpacity
                            key={index}
                            onPress={()=> NavigateToTradingScreen(item?.company_name)}
                        >                         
                            <View style={Styles.searchCardView}>
                                <View  style={Styles.searchIconView} >
                                     <Image  
                                     source={{uri:item?.company_logo}} 
                                     resizeMode={'cover'} 
                                     style={Styles.symbolIcon}
                                     />
                                </View>    

                                <View style={{marginLeft:5, marginHorizontal:5, minWidth:R.fontSize.Size45}}>
                                    <Text style={Styles.symbolcompanyName} 
                                    numberOfLines={2}
                                    >
                                        {item?.company_name}
                                    </Text>
                                    <Text style={Styles.USDCurrency} 
                                    numberOfLines={1}
                                    >
                                        {'USD'}
                                    </Text>
                                </View>

                        <View style={{ flex:1}}>
                                <LineChart
                                style={Styles.LineChart}
                                data={item?.graph_values}
                                svg={{ stroke:R.colors.buttonColor, strokeWidth:2 }}
                                contentInset={{ top: R.fontSize.Size8, bottom: R.fontSize.Size4 }}               
                                >
                                <Grid/>
                                </LineChart>
                        
                        </View>
                        <View style={{flex:1,marginLeft:R.fontSize.Size4}}>
                            <View 
                            style={{flexDirection:'row',alignItems:'center'}}
                            >
                                <Image source={R.images.usDoller_icon} style={{height:R.fontSize.XLarge,width:R.fontSize.XLarge}} resizeMode={'contain'} />
                                <Text style={{fontWeight:'600', fontSize: R.fontSize.large, color:R.colors.black}}>{ (item?.last_trade) }</Text>
                               
                                {/* <Text style={{fontWeight:'600', fontSize: R.fontSize.large}}>{ (marketStatus && webSocketTradeList?.p != null) ? (webSocketTradeList?.p) : (item?.last_trade) }</Text> */}
                            </View>
                        
                            
                                <View
                                style={{flexDirection:'row', alignItems:'center'}}
                                >   
                                    <Text style={{color: (item?.last_trade - item?.previous_close ) < 0 ? 'red' : R.colors.buttonColor, fontSize:R.fontSize.medium}} numberOfLines={1}>
                                        { (item?.last_trade - item?.previous_close).toFixed(2) } 
                                    </Text> 
                                    <Text style={{fontSize:R.fontSize.large, color:R.colors.placeholderTextColor}}> / </Text>   
                                    <Text style={{color: (item?.last_trade - item?.previous_close ) < 0 ? 'red' : R.colors.buttonColor, fontSize:R.fontSize.medium}} numberOfLines={1}>
                                        {
                                        (`${(((item?.last_trade - item?.previous_close ) * 100) /item?.last_trade).toFixed(2)}`)
                                        } 
                                    </Text> 
                                    <Text style={{color: (item?.last_trade - item?.previous_close ) < 0 ? 'red' : R.colors.buttonColor,  width:R.fontSize.large}} numberOfLines={1}>%</Text>   
                                </View>
                             
                        </View>
                        <TouchableOpacity
                                    onPress={()=> onAddWatchListAPI(item?.company_name)}
                                    style={{position:'absolute',right:5,top:5,alignItems:'center',justifyContent:'center', paddingHorizontal:2, borderWidth:1, borderColor:R.colors.buttonColor, borderRadius:R.fontSize.Size4}}
                                    >
                                    <Image  source={R.images.green_eye_icon} resizeMode={'contain'} style={{height:R.fontSize.XXLarge,width:R.fontSize.XXLarge}}/>
                        </TouchableOpacity>
                        </View>
                        </TouchableOpacity>           
                        )
                        })
                        }
                    </View>
                }
                </View>
                :
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <ActivityIndicator size={'large'} color={R.colors.buttonColor} />
                </View>    

                }
                    
                    {/* {

                    ((logo != '' && logo != null ) || (data === 'undefined')) ? 
                    (
                    AllValue.map((item, index)=>{
                    return(
            
                    <TouchableOpacity 
                        key={index}
                        onPress={()=> NavigateToTradingScreen(item.quotesData?.tickerSyntax)}
                    >                         
                        <View style={{flexDirection:'row', marginHorizontal:R.fontSize.large, alignItems:'center', paddingHorizontal:R.fontSize.Size4, shadowColor: "#000",
                        shadowOffset: {width: 0,height: 2,},
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: R.fontSize.Size5, 
                        backgroundColor:'#fff',
                        borderWidth:0.5,
                        borderColor:R.colors.placeholderTextColor
                        }}>
                            <View  style={{height:R.fontSize.Size42, width:R.fontSize.Size42, borderRadius:R.fontSize.Size4, borderWidth:1,alignItems:'center',justifyContent:'center', borderColor:R.colors.placeholderTextColor, backgroundColor:R.colors.placeholderTextColor, overflow:'hidden'}} >
                            <Image  source={{uri:item?.symbol}} resizeMode={'cover'} style={{height:R.fontSize.Size40,width:R.fontSize.Size40}}/>
                            </View>    

                            <View style={{marginLeft:5, marginHorizontal:5, minWidth:R.fontSize.Size45}}>
                                <Text style={{color:R.colors.buttonColor, fontSize:R.fontSize.large, fontWeight:'600'}} numberOfLines={2}>{item.quotesData?.tickerSyntax}</Text>
                                <Text style={{ fontSize:R.fontSize.small, color:R.colors.placeholderTextColor}} numberOfLines={1}>{item.quotesData?.currencyName}</Text>
                            </View>

                    <View style={{ flex:1}}>
                    {
                        loading 
                        ?
                            <LineChart
                            style={{height:R.fontSize.Size80,marginVertical:R.fontSize.Size4, borderWidth:0.5, borderColor:R.colors.placeholderTextColor, borderRadius:R.fontSize.Size5}}
                            data={data}
                            svg={{ stroke:R.colors.buttonColor, strokeWidth:2 }}
                            contentInset={{ top: R.fontSize.Size8, bottom: R.fontSize.Size4 }}               
                            >
                            <Grid/>
                            </LineChart>
                        :
                            (
                                <ActivityIndicator  size={'large'} color={R.colors.buttonColor}/>
                            )
                    }
                    </View>
                    <View style={{flex:1,marginLeft:R.fontSize.Size4}}>
                        <View 
                        style={{flexDirection:'row',alignItems:'center'}}
                        >
                            <Image source={R.images.usDoller_icon} style={{height:R.fontSize.XLarge,width:R.fontSize.XLarge}} resizeMode={'contain'} />
                            <Text style={{fontWeight:'600', fontSize: R.fontSize.large}}>{ marketStatus ? (item?.WebSocketTradeData?.p) : (item?.lastTradeQuotes?.last_trade?.p) }</Text>
                        </View>
                       
                        {
                            previousCloseData.map((item2, index2)=>{
                            return(
                            <View
                            key={index2}
                            style={{flexDirection:'row', alignItems:'center'}}
                            >   
                                <Text style={{color: (item?.lastTradeQuotes?.last_trade?.p - item2?.c ) < 0 ? 'red' : R.colors.buttonColor,  width:R.fontSize.Size50, lineHeight:R.fontSize.XLarge}} numberOfLines={1}>
                                    { marketStatus ? (item?.WebSocketTradeData?.p - item2?.c ) : (item?.lastTradeQuotes?.last_trade?.p - item2?.c) } 
                                </Text>    
                                <Text style={{color: (item?.lastTradeQuotes?.last_trade?.p - item2?.c ) < 0 ? 'red' : R.colors.buttonColor,  width:R.fontSize.Size50, lineHeight:R.fontSize.XLarge}} numberOfLines={1}>
                                    {marketStatus ? 
                                    (`${((item?.WebSocketTradeData?.p - item2?.c ) * 100) /item?.WebSocketTradeData?.p}`) 
                                    : 
                                    (`${((item?.lastTradeQuotes?.last_trade?.p - item2?.c ) * 100) /item?.lastTradeQuotes?.last_trade?.p}`)
                                    } 
                                </Text> 
                                <Text style={{color: (item?.lastTradeQuotes?.last_trade?.p - item2?.c ) < 0 ? 'red' : R.colors.buttonColor,  width:R.fontSize.large}} numberOfLines={1}>%</Text>   
                            </View>
                            )  
                            })
                        }
                    </View>
                    <TouchableOpacity
                                onPress={()=> onAddWatchListAPI(item.quotesData?.tickerSyntax)}
                                style={{position:'absolute',right:10,top:10,alignItems:'center',justifyContent:'center'}}
                                >
                                <Image  source={R.images.green_eye_icon} resizeMode={'contain'} style={{height:R.fontSize.EXXLarge,width:R.fontSize.EXXLarge}}/>
                    </TouchableOpacity> 
                </View>
                
            </TouchableOpacity> 
                )
            })
            )
            :
            (
                <View style={{alignItems:'center',justifyContent:'center',paddingVertical:R.fontSize.Size4}}>
                    <Text style={{fontSize:R.fontSize.medium, color:R.colors.black}}>Please Enter Valid Symbol Name in Search Box</Text>
                </View>    
            )
            } */}
                
            <View style={{flex:1}}>
                    <View style={{ borderBottomWidth:0.5, marginTop:R.fontSize.extraSmall, flexDirection:'row', alignItems:'center', borderBottomColor:R.colors.black}}>
                        <TouchableOpacity
                        onPress={()=> setSelected('All')}
                        style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor: selected==='All' ? R.colors.buttonColor : '#f1f1f1' , paddingVertical:R.fontSize.Size8}}
                        >
                          <Text style={{fontSize:R.fontSize.large, fontWeight:'600', color:selected==='All'?R.colors.white :R.colors.black}}>All</Text>  
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=> setSelected('Stocks')}
                        style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor: selected==='Stocks' ? R.colors.buttonColor : '#f1f1f1' , paddingVertical:R.fontSize.Size8}}            
                        >
                          <Text style={{fontSize:R.fontSize.large, fontWeight:'600', color:selected==='Stocks'?R.colors.white :R.colors.black}}>Stocks</Text>   
                        </TouchableOpacity>
                    </View> 

                    <View style={{flex:1}}>
                       
                    {
                    (selected==='All') &&  
                        <View style={{flex:1}}>
                        {(companyLoading && allCompanyDetails.length != 0) ?    
                            <View style={{flex:1,paddingTop:R.fontSize.Size5}}>
                                <FlatList
                                    data={allCompanyDetails}
                                    keyExtractor={(item) => item.id}
                                    renderItem = {(({item})=>{
                                        return(
                                            <SymbolDetailCard
                                                onPress = {()=>{NavigateToTradingScreen(item?.symbol)}}
                                                onLongPress={()=> props.navigation.navigate('CompanySyntaxDetails',{
                                                    symbolname: item?.symbol
                                                })}
                                                symbolIcon = {item?.company_logo}
                                                symbolName = {item?.symbol}
                                                companyName = {item?.company_name}
                                                lastTradePrice = {`$ ${item?.last_trade}`}
                                            />
                                        )
                                    })}
                                />
                            </View>      
                            :
                            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                                <ActivityIndicator size={'large'} color={R.colors.buttonColor}/>    
                            </View> 
                            }     
                        </View>             
                    }

                    {
                        (selected === 'Stocks') && 
                        <View 
                        style={{flex:1}}
                        >
                          { (companyLoading ) ?
                            <View style={{flex:1,paddingTop:R.fontSize.Size5}}>
                                <FlatList
                                    data={historyCompanyDetails}
                                    // keyExtractor = {(item) => item.id }
                                    renderItem = {({item}) => {
                                        return(
                                            <View>   
                                            {
                                            (item !=null && item != '')
                                            ?
                                            <View>
                                            {
                                                item.map((item2, index2)=>{
                                                    return(
                                                        <SymbolDetailCard
                                                        key = {index2}
                                                        onPress = {()=>{NavigateToTradingScreen(item2?.company_symbol)}}
                                                        symbolIcon = {item2?.logo}
                                                        symbolName = {item2?.company_symbol}
                                                        companyName = {item2?.company_name}
                                                        lastTradePrice = {`$ ${item2?.last_price}`}
                                                        />
                                                    )
                                                })
                                            }
                                            </View>           
                                            :
                                            <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop:R.fontSize.Size40}}>
                                                <Text style={{fontSize:R.fontSize.medium, color:R.colors.placeholderTextColor}} numberOfLines={1}>{`Sorry! No Found's Stock Index`}</Text>
                                            </View>    
                                            }
                                            
                                            </View>
                                        )
                                    }}
                                />
                            </View>
                            :
                            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                                <ActivityIndicator size={'large'} color={R.colors.buttonColor}/>    
                            </View>  
                            }
                                  
                        </View> 
                           
                    }
                    </View>
                    </View>
                </View>    
            </View>
            {/* </TouchableWithoutFeedback> */}
            </View>
        </StoryScreen>
    )
}

export default SearchScreen;