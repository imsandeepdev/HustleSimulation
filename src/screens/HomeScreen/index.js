import * as React from 'react';
import {useState} from 'react';
import {View, Text, Image, FlatList, 
     TouchableOpacity, ScrollView,
     TouchableWithoutFeedback, Modal, 
     SafeAreaView, Dimensions, 
     ActivityIndicator, 
     Alert} from 'react-native';
import R from '../../res/R';
import {Button, StoryScreen, Header} from '../../components';
import Styles from './styles';
import {Ranges} from '../../constants/Ranges';
import { store } from '../../store';
import { LineChart, Grid , YAxis, XAxis} from 'react-native-svg-charts';

import { websocketClient } from "@polygon.io/client-js";
import { connect } from 'react-redux';
import moment from 'moment';
import { Config } from '../../config';
import LinearGradient from 'react-native-linear-gradient';

const screenWidth = Dimensions.get("window").width;


// const data1 = [ 5, 9, 5, 4, 0, 8, 9, 5, 3, 7, 4, 0, 2, 8, 5, 4, 9, 8, 9, 3, 5,3, 2, 5, 7, 10]
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
const currentDate = new Date().getDate();

const weekData = [
    1,2,3,4,5,6,7,8
]

const SliderList = [
    {
        id:1,
        title:'AAPL',
        imgLink: R.images.edit_Profile
    },
    {
        id:2,
        title:'AAPL',
        imgLink: R.images.edit_Profile
    },
    {
        id:3,
        title:'AAPL',
        imgLink: R.images.edit_Profile
    },
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
        data: [ 10, 40, 95, 40, 40, 85, 91, 35, 53, 73, 24, 50, 20, 80, 95, 40, 94, 85, 91, 35, 53, 33, 24, 50, 70, 0],
        color: (opacity = 1) => R.colors.buttonColor, // optional
        strokeWidth: 2 // optional
      }
    ]
  };



const IndexList = [
    {
        id:'1',
        title: 'S&P 500'       
    },
    {
        id:'2',
        title:'Dow Jones'
    },
    {
        id:'3',
        title:'Nasdaq 100'
    }
]





const HomeScreen = (props) => {


const [ selected, setSelected] = useState('1');
const [currencyName, setCurrencyName] = useState('')
const [loading, setLoading] = useState(false)
const [totalLastTradePrice, setTotalLastTradePrice] = useState('')
const [totalPreviousClose, setTotalPreviousClose] = useState('')
const [data, setData] = useState([]);
const [growthData, setGrowthData] = useState()
const [dataValue, setDataValue] = useState()
const [loadingIndex, setLoadingIndex] = useState(false)
const [marketStatus, setMarketStatus] = useState(false)
const [stockIndexList, setStockIndexList] = useState()
const [companySymbolList, setCompanySymbolList] = useState([])

const [dateList, setDateList] = useState([]);

const [onCatch, setOnCatch] = useState(false)
const {
    auth:{authToken} 
} = store.getState();
const headerForAuth = {
    'Accept': "application/json",
    'Authorization': `Bearer ${authToken}`,
  };


React.useEffect(() => {

    const unsubscribe = props.navigation.addListener('focus',()=>{  
    
        const {
            auth:{authToken} 
        } = store.getState();
        const headerForAuth = {
            'Accept': "application/json",
            'Authorization': `Bearer ${authToken}`,
          };
        const APIURL = `${Config.BASE_URL}HustelAppApi/public/api/user/profile`;   
        fetch(APIURL,{
            method:'GET',
            headers: headerForAuth
        })
        .then(response => response.json())
        .then(responseJson => {
            setLoading(true)
            setCurrencyName(responseJson.profile.currency_name)
            console.log('Currency Name', responseJson.profile.currency_name)     
        })
        .catch((error)=>{
            console.log('Catch Error Message in API Services',error.message);      
        })  
    });
    return unsubscribe;  
},[props.navigation])


React.useEffect(()=>{
    const unsubscribeCall = props.navigation.addListener('focus',()=>{  
        OnSliderCompanySyambolListAPI('trandingCompaniesOfSandP500')
        MarketStatusAPI('AAPL')
        OnCallStockIndexDetailAPI('SandP500')
        OnPendingToOpenPosition()
        OnTimeStatus()
    })
    return unsubscribeCall;  
},[props.navigation])

// const OnFocus = () => {
//     MarketStatusAPI('AAPL')
//     OnCallStockIndexDetailAPI('SandP500')
// }

const OnSliderCompanySyambolListAPI = (indexName) => {
    setLoading(false)
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/${indexName}`)
    .then(res => res.json())
    .then(response => {
        console.log('OnSlider Company Symbol List', response)
        setCompanySymbolList(response?.data)
        setLoading(true)
    })
    .catch((err)=>{

        console.log('Catch Error on OnSliderCompany SymbolList', err)
        
    })
}


const OnCallStockIndexDetailAPI = (index) => {
   setLoading(false) 
    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      };
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/${index}`,{
        method:'GET',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => {
        console.log('RESPONSE FOR MARKET PRICE STOCK INDEX VALUE', response)
        setData(response?.last_trade_price)
        setTotalLastTradePrice(response?.last_trade)
        setTotalPreviousClose(response?.previous_close)
        setStockIndexList(response?.company_name)
        console.log('RESPONSE FOR MARKET PRICE STOCK INDEX MARKET VALUE MARKET GRAPGH', response?.last_trade_price)
        setLoading(true)

    })
    .catch((err)=>{

        console.log('Catch Error On Home Page For Data', err)
    })
}



const MarketStatusAPI = (text) => {
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/marketStatus`)
    .then(res => res.json())
    .then(responseData => {
        if(responseData?.messages?.market === 'closed')
        {
            setMarketStatus(false)
            loadChartForGrowth(text)
        }
        else
        {
            setMarketStatus(true)
            loadChartForGrowth(text)
            // WebSocketLiveTrade(text)
        }
    })
}

const OnTimeStatus = () => {
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/marketStatus`)
    .then(res => res.json())
    .then(responseData => {
        if(responseData?.messages?.market === 'closed')
        {
         setDateList(['4am', '6am', '8am', '10am', '12pm','2pm','4pm','6pm'])
        }
        else
        {
            OnMarketOpenTime()
        }
    })
}




const loadChartForGrowth = (text) => {
    setLoadingIndex(false)
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/aggregateBar?company_name=${text}&time=minute`)
     .then(res => res.json())
     .then(responseData => {
         return(
         setDataValue(responseData?.AggregatesBar),
         console.log('LOAD CHART DATA FOR GROWTH', dataValue),
         setLoadingIndex(true)
         )
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
    }


const onCallStockExchange = (item) => {

    const tempData = item
    console.log('TempData', tempData)
    if(tempData.id == item.id)
    {
        props.navigation.navigate('CompanyScreen',{
            from: item.title
        })
    }
}



const onSelectedIndex = (item) => {
    const tempData = item.id
    if(item.id === '1')
    {  
       setSelected('1') 
       OnCallStockIndexDetailAPI('SandP500')
       loadChartForGrowth('AAPL')
       MarketStatusAPI('AAPL')
       OnSliderCompanySyambolListAPI('trandingCompaniesOfSandP500')
       console.log('Pressed1')
    }
    else if(item.id === '2')
    {
        setSelected('2')
        OnCallStockIndexDetailAPI('DowJones')
        loadChartForGrowth('AMZN')
       MarketStatusAPI('AMZN')
       OnSliderCompanySyambolListAPI('trandingCompaniesOfDowJones')
       console.log('Pressed2')
       
    }
    else
    {
        setSelected('3')
        OnCallStockIndexDetailAPI('Nasdaq100')
        loadChartForGrowth('FB')
        MarketStatusAPI('FB')
        OnSliderCompanySyambolListAPI('trandingCompaniesOfNasdaq100')
       console.log('Pressed3')
    }
}

const onPressStockIndex = (item) => {
    if(selected === '1')
    {
       props.navigation.navigate('CompanyScreen',{
           STOCKINDEX: 'SandP500CompanyListing',
           from:'S&P 500'
       })
       console.log('Pressed11')
    }
    else if(selected === '2')
    {
        props.navigation.navigate('CompanyScreen',{
            STOCKINDEX: 'DowJonesCompanyListing',
            from: 'Dow Jones'
        })
       console.log('Pressed22')

    }
    else
    {
        props.navigation.navigate('CompanyScreen',{
            STOCKINDEX: 'Nasdaq100CompanyListing',
            from: 'Nasdaq 100'
        })
       console.log('Pressed33')

    }
}

const OnMarketOpenTime = () => {
    const arrayList=[]
    const marketTime = 2.00;
    var hours = new Date().getHours();
    let time= 2.00;
    let x = hours-marketTime;
    let y = 2;
    let z = Math.floor(x / y);
    console.log('value after divide', Math.floor(z))
    console.log('value Hour', hours)
    
    for (let i=0; i<z; i++ )
    {
        time += 2
        console.log("VALUE OF TIME",time)
        if(time <= 12)
        {
            arrayList.push(`${time}am`)
            console.log("VALUE OF ARRAY",arrayList)
            setDateList(arrayList)
        }
        else
        {
            let i = time -12
            arrayList.push(`${i}pm`)
            console.log("VALUE OF ARRAY",arrayList)
            setDateList(arrayList)
        }

    }

}

    return(
        <StoryScreen statusBarStyle= "dark-content">
            <Header
            leftSource={R.images.menu_icon}
            backAction={()=> props.navigation.toggleDrawer()}
            title={'Home Screen'}
            />
            {
            loading ?
            <View style={{flex:1}}>   
            <ScrollView
            contentContainerStyle={{flexGrow:1}}
            showsVerticalScrollIndicator={false}
            >
                    <View style={{height:R.fontSize.Size42, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                        {
                            IndexList.map((item,index)=>{
                                return(
                                    <TouchableOpacity
                                    key={index}
                                    onPress={()=> onSelectedIndex(item)}
                                    style={{alignItems:'center',justifyContent:'center',height:R.fontSize.Size40,flex:1 ,backgroundColor:selected==item.id ? R.colors.white: R.colors.lightwhite , borderWidth: selected==item.id ? 1 : 0.5, borderColor: selected===item.id ? R.colors.black : R.colors.placeholderTextColor}}
                                    >
                                        <Text style={{fontWeight:'bold', fontSize:R.fontSize.large, color: selected==item.id ? R.colors.black : R.colors.placeholderTextColor}}>{item.title}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        } 
                    </View> 
            
            
            <View style={Styles.mainView}>
                <View style={{paddingTop:R.fontSize.Size4}}>
                       
                            <LinearGradient
                                    start={{x:1, y:0}}
                                    end={{x:1, y:1}}
                                    colors={[ R.colors.lightwhite, R.colors.white]}
                                    style={{flex:1, marginHorizontal:R.fontSize.Size8, marginVertical:R.fontSize.Size4, borderRadius:R.fontSize.Size4, overflow:'hidden', borderWidth:1, borderColor:R.colors.black}}
                            >
                            <TouchableOpacity                        
                            onPress={()=> onPressStockIndex()}
                            style={Styles.TopCardTouch}>
                             
                             <View style={{paddingVertical:R.fontSize.Size4, borderRadius:R.fontSize.Size4,    borderWidth:1, borderColor:R.colors.black, justifyContent:'flex-end', alignSelf:'center', paddingHorizontal:R.fontSize.Size4, width:R.fontSize.Size120}}>
                                <Text style={Styles.TopCardTitle}>
                                    {
                                    selected === '1'
                                    ?
                                    `S&P 500`
                                    :
                                    (
                                    selected === '2'
                                    ?
                                    'Dow Jones'
                                    :
                                    'Nasdaq 100'
                                    )
                                    }
                                </Text>
                            </View>

                                <View style={Styles.TopCardBottomView}>
                                    <View style={{flexDirection:'row'}}>
                                        <Image source={(totalLastTradePrice - totalPreviousClose < 0) ? R.images.red_down : R.images.tradingUp} 
                                        resizeMode={'contain'} 
                                        style={Styles.upDownImage}
                                        />
                                        <Text style={{fontSize:R.fontSize.XLarge, color: (totalLastTradePrice - totalPreviousClose < 0) ? R.colors.red : R.colors.buttonColor, marginLeft:R.fontSize.Size5, fontWeight:'600'}} numberOfLines={1}>
                                            {(totalLastTradePrice - totalPreviousClose).toFixed(3)}
                                        </Text>
                                    </View> 
                                    <View style={{ marginRight:R.fontSize.extraSmall}}>
                                    <Text style={{fontSize:R.fontSize.XLarge, fontWeight:'700', color: (totalLastTradePrice - totalPreviousClose < 0) ? R.colors.red : R.colors.buttonColor, textAlign:'center'}} numberOfLines={1}>
                                        {(((totalLastTradePrice - totalPreviousClose)*100) / totalPreviousClose).toFixed(3) }
                                    </Text>     
                                    </View>
                                </View>



                            </TouchableOpacity> 
                            </LinearGradient>



                            <View style={{borderBottomWidth:2, borderTopWidth:2,paddingVertical:R.fontSize.Size4, borderColor:R.colors.placeholderTextColor,marginTop:R.fontSize.Size4, backgroundColor:'#f1f1f1'}}>
                                    <View style={{marginHorizontal:R.fontSize.Size8}}>
                                        <Text style={{fontSize:R.fontSize.medium, fontWeight:'700', color:R.colors.black}} numberOfLines={1}>
                                            Trending Companies
                                        </Text>
                                    </View>
                                        <ScrollView 
                                        
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        snapToEnd={true}
                                        contentContainerStyle ={{flexDirection:'row', marginHorizontal:R.fontSize.Size4,alignItems:'center'}}>
                                         {
                                             companySymbolList.map((item,index)=>{
                                                 return(
                                                    <TouchableOpacity
                                                    key={index}
                                                    onPress={()=> props.navigation.navigate('CompanySyntaxDetails',{
                                                        symbolname: item?.company_name,
                                                        fromScreen: 'Home'
                                                    })}
                                                     style={{alignItems:'center',marginHorizontal:R.fontSize.Size4}}>
                                                        <View style={{height:R.fontSize.Size50, width:R.fontSize.Size50, borderRadius:R.fontSize.Size40, borderWidth:1,marginVertical:R.fontSize.Size4, overflow:'hidden', alignItems:'center',justifyContent:'center', borderColor:R.colors.buttonColor, backgroundColor:R.colors.black}}>
                                                            <Image source={{uri: item?.company_logo}} resizeMode={'contain'} style={{height:R.fontSize.Size50, width:R.fontSize.Size50,borderRadius:R.fontSize.Size40}}/>
                                                        </View>
                                                        <Text style={{fontWeight:'600', fontSize:R.fontSize.small, color:R.colors.black}} numberOfLines={1}>
                                                            {item?.company_name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                 )
                                             })
                                         }   
                                        </ScrollView>
                            </View>        
                </View> 
                  

                <View style={{marginTop:R.fontSize.small, marginHorizontal:R.fontSize.large}}>

                    {/* <View>
                       <TouchableOpacity
                       onPress={()=>OnValue()}
                       >
                           <Text>Value</Text>
                       </TouchableOpacity>
                    </View> */}


                    <Text style={Styles.dashboardText}>Market</Text>  
                            <View style={Styles.marketTopView}>
                                <View style={Styles.marketCardView}>
                                <Text style={{fontSize:R.fontSize.small, color:R.colors.placeholderTextColor}}>
                                               {` Day ${marketStatus ?
                                                (moment().format("Do MMM"))
                                                    :
                                                (moment().subtract(1, 'days').format("Do MMM"))
                                                }`}
                    </Text>
                                   <View style={{flexDirection:'row', alignItems:'center', borderColor:R.colors.placeholderTextColor}}>
                                       <View style={{paddingVertical:R.fontSize.Size5}}>
                                            <View style={{flexDirection:'row'}}>
                                                <Text style={Styles.marketUSDText}>USD</Text>
                                                <Image source={R.images.tradingUp} 
                                                resizeMode={'contain'} 
                                                style={Styles.marketGrowthImage}
                                                />
                                            </View> 
                                            <Text style={Styles.marketUSDPriceText} numberOfLines={1}>
                                                {totalLastTradePrice}
                                            </Text>
                                        </View>
                                        <View style={{flex:1}}>
                                        <View style={{flex:1,height: screenWidth/3.6, marginLeft:R.fontSize.extraSmall, flexDirection:'row'}}>                                         
                                                <YAxis
                                                data={((data != null) && (data.length > 1)) ? data :data1}
                                                contentInset={{top: R.fontSize.Size5, bottom: R.fontSize.Size5 }}
                                                svg={{
                                                    fill: 'grey',
                                                    fontSize: R.fontSize.Size8,
                                                }}
                                                numberOfTicks={10}
                                                formatLabel={(value) => `$${value}`}
                                                />
                                                
                                                <LineChart
                                                style={{height: screenWidth/3.6,  borderLeftWidth:1, borderColor:R.colors.placeholderTextColor, flex:1, marginLeft:R.fontSize.Size4,borderBottomWidth:1}}
                                                // data={data != null ? data :data1}
                                                data={((data != null) && (data.length > 1)) ? data :data1}
                                                svg={{ stroke:R.colors.buttonColor, strokeWidth:2 }}
                                                contentInset={{ top: R.fontSize.Size8, bottom: R.fontSize.Size8 }}
                                                >
                                                <Grid />
                                                </LineChart>    
                                        </View>

                                        <XAxis
                                                style={{ paddingHorizontal: R.fontSize.extraSmall, marginTop:R.fontSize.Size4, flex:1, alignItems:'center',flexDirection:'row', justifyContent:'center'}}
                                                data={ dateList }
                                                xAccessor={ ({ index }) => index }
                                                formatLabel={ (value, index) => dateList[value]}
                                                contentInset={{ right:R.fontSize.Size8, left: R.fontSize.Size35}}
                                                svg={{ fontSize: R.fontSize.Size8, fill: R.colors.black }}
                                        />
                                        <Text style={{textAlign:'center', fontSize:R.fontSize.extraSmall, color:R.colors.black,marginVertical:R.fontSize.Size4}}>
                                              {'Time'}
                                        </Text>

                                        </View>
                                    </View>
                                     </View>
                            </View>
                </View> 

                <View style={{marginTop:R.fontSize.small, marginHorizontal:R.fontSize.large}}>
                    <Text style={Styles.dashboardText}>Growth</Text>        
                    <View style={[Styles.marketCardView,{backgroundColor:'#ddffdd'}]}>
                   
                    <Text style={{fontSize:R.fontSize.small, color:R.colors.placeholderTextColor}}>
                                               {` Day ${marketStatus ?
                                                (moment().format("Do MMM"))
                                                    :
                                                (moment().subtract(1, 'days').format("Do MMM"))
                                                }`}
                    </Text>
      
                            {/* <LineChart
                                data={Bardata}
                                width={screenWidth/1.1}
                                style={{flex:1, marginHorizontal:20}}
                                height={220}
                                chartConfig={chartConfig}
                                yAxisLabel="$"
                                yAxisSuffix="k"
                            />   */}
                                    {
                                    loadingIndex
                                    ?  
                                    <View style={{flex:1,  height:screenWidth/2.2, marginHorizontal:R.fontSize.Size4, flexDirection:'row'}}> 
                                        {
                                            console.log('Growth Data ValueNEW #', dataValue)
                                        }
                                                <Text style={{width:10,fontSize:R.fontSize.Size8,textAlign:'center',alignSelf:'center',letterSpacing:2, marginHorizontal:2}}>VOLUME</Text>
                                                <YAxis
                                                data={dataValue}
                                                contentInset={{top: R.fontSize.XLarge, bottom: R.fontSize.XLarge }}
                                                svg={{
                                                    fill: 'grey',
                                                    fontSize: R.fontSize.Size8,
                                                }}
                                                numberOfTicks={10}
                                                formatLabel={(value) => `${value}`}
                                                /> 
                                                 <LineChart
                                                 style={{height: screenWidth/2.2,borderBottomWidth:1,borderLeftWidth:1,borderColor:R.colors.placeholderTextColor,flex:1, marginLeft:R.fontSize.Size4}}
                                                 data={dataValue}
                                                 svg={{ stroke:R.colors.buttonColor, strokeWidth:2 }}
                                                 contentInset={{ top: R.fontSize.XXLarge, bottom: R.fontSize.extraSmall }}
                                                
                                                 >
                                                 <Grid/>
                                                 </LineChart>     
                                    </View> 

                                    :
                                    (
                                        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                                        <ActivityIndicator  size={'large'} color={R.colors.buttonColor}/>
                                        </View>
                                    )
                                    }
                                    
                                                <XAxis
                                                style={{ marginHorizontal: R.fontSize.extraSmall, marginTop:R.fontSize.Size4 }}
                                                data={ dateList }
                                                xAccessor={ ({ index }) => index }
                                                formatLabel={ (value, index) => dateList[value]}
                                                contentInset={{ left: R.fontSize.Size40, right:R.fontSize.medium}}
                                                svg={{ fontSize: R.fontSize.Size8, fill: R.colors.black }}
                                                />
                                            <Text style={{textAlign:'center', fontSize:R.fontSize.extraSmall, color:R.colors.black,marginVertical:R.fontSize.Size4}}>
                                             {`Time`}
                                            </Text>
                    </View>           
                </View>  
            </View>   
            </ScrollView>
            </View>
              :
                 <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                         <ActivityIndicator  size="large" color={R.colors.buttonColor}/>
                 </View> 
             } 
        </StoryScreen>
    )
}

const mapStateToProps = ({auth}) => ({
    loggedIn: auth.loggedIn,
    authToken: auth.authToken
})

export default  connect(mapStateToProps) (HomeScreen);


