import * as React from 'react';
import {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, ScrollView, Dimensions, Image, ActivityIndicator} from 'react-native';
import {Header, StoryScreen} from '../../components';
import R from '../../res/R';
import { LineSegment, VictoryChart, VictoryAxis, VictoryLabel, VictoryLine, VictoryTheme } from 'victory-native';
const screenWidth = Dimensions.get('window').width;
import moment from 'moment';

import { Config } from '../../config';
import { store } from '../../store';

const data = [ 10, 40, 95, 40, 40, 85, 91, 35, 53, 73, 24, 50, 20, 80, 95, 40, 94, 85, 91, 35, 53, 33, 24, 50, 70, 0]

const DataList = [
    {
        id:1,
        title: 'Action',
        value: 'Buy'
    },
    {
        id:2,
        title: 'Symbol',
        value: 'CBXE'
    },
    {
        id:3,
        title: 'Quantity',
        value: '100'
    },
    {
        id:4,
        title: 'Order Type',
        value: 'Market'
    },
    {
        id:5,
        title: 'Last Price',
        value: '$2,916.84'
    },
    {
        id:6,
        title: 'Days Change',
        value: '$2,916.84'
    },
    {
        id:7,
        title: 'BID/ASK',
        value: '2911.01/2921.00'
    },
    {
        id:8,
        title: 'Days Range',
        value: '2921.21-2936.41'
    },
    {
        id:9,
        title: 'Days Volume',
        value: '1654'
    },
    {
        id:10,
        title: 'Status',
        value: 'Closed with Profit'
    }
]

const HistoryDetailsComponent = (props) => {
    return(
        <View style={{alignItems:'center',justifyContent:'space-between', flexDirection:'row', padding:R.fontSize.Size8, borderBottomWidth:0.5, marginHorizontal:R.fontSize.Size4, borderBottomColor:R.colors.placeholderTextColor}}>
            <View style={{alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:R.fontSize.medium, fontWeight:'500', color:R.colors.buttonColor}}>{props.Title1}</Text>
                <Text style={{fontSize:R.fontSize.medium, color:R.colors.black}}>{props.Value1}</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:R.fontSize.medium, fontWeight:'500', color:R.colors.buttonColor}}>{props.Title2}</Text>
                <Text style={{fontSize:R.fontSize.medium, color:R.colors.black}}>{props.Value2}</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:R.fontSize.medium, fontWeight:'500', color:R.colors.buttonColor}}>{props.Title3}</Text>
                <Text style={{fontSize:R.fontSize.medium, color:R.colors.black}}>{props.Value3}</Text>
            </View>
        </View> 
    )
}

const PreviewScreen = (props) => {

    const [historyDetails, setHistoryDetails] = useState([])

    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        HistoryDetailsAPI()
    },[props.navigation])

const HistoryDetailsAPI = () => {
    setLoading(false)
    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      };
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/showHistoryPage?trade_id=${props.route.params?.value}`,{
        method:'GET',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response =>{
        console.log('Response Result on Preview Screen', response)
        setHistoryDetails(response?.data)
        setLoading(true)
    })
    .catch((err) => {
        console.log('Error', err)
    })
}

    return(
        <StoryScreen>
            <Header
                leftSource={R.images.backButton}
                backAction={()=> props.navigation.goBack()}
                title={`${props.route.params?.Syambol} Trade Preview`}
            />
            {
            loading?    
            <View
            style={{flex:1}}
            >
            <View style={{flex:1, backgroundColor: R.colors.white, paddingTop:10}}>
               
               {
                historyDetails.map((item,index)=>{
                    return(

                        <View key={index}>

                        <View style={{paddingVertical:R.fontSize.Size4, flexDirection:'row', marginHorizontal:R.fontSize.extraSmall,alignItems:'center'}}>
                            <View style={{height:R.fontSize.Size42, width:R.fontSize.Size42, borderWidth:1, borderRadius:R.fontSize.Size4, borderColor:R.colors.placeholderTextColor, alignItems:'center',justifyContent:'center', overflow:'hidden'}}>
                                <Image source={{uri:item?.logo}} resizeMode={'contain'} style={{height:R.fontSize.Size40,width:R.fontSize.Size40}}/>
                            </View>
                            <Text style={{marginLeft:R.fontSize.Size4, fontSize:R.fontSize.XXLarge, fontWeight:'600', color:R.colors.buttonColor, flex:1}} numberOfLines={1}>{item?.company_symbol}</Text>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Text style={{fontSize:R.fontSize.medium, color:R.colors.buttonColor, fontWeight:'600'}}>Trade id </Text>
                                <Text style={{fontSize:R.fontSize.medium, color:R.colors.black}}>{item?.trade_id}</Text>
                            </View>
                        </View>
        
        
                        <View style={{marginHorizontal:R.fontSize.extraSmall, borderWidth:1, borderColor:R.colors.placeholderTextColor}}>
                        
                        <HistoryDetailsComponent
                            Title1={'OPEN TIME'}
                            Value1={moment(item?.open_time).format('Do, MMM hA')}
                            Title2={'CLOSED TIME'}
                            Value2={moment(item?.close_time).format('Do, MMM hA')}
                            Title3={'PRICE PAID'}
                            Value3={item?.price_paid}
                        />
                        
                        <HistoryDetailsComponent
                            Title1={'SYMBOL'}
                            Value1={item?.company_symbol}
                            Title2={'ACTION'}
                            Value2={item?.request_type}
                            Title3={'ORDER TYPE'}
                            Value3={item?.market}
                        />
                        
        
                        <HistoryDetailsComponent
                            Title1={'BID PRICE'}
                            Value1={item?.bid_price}
                            Title2={'ASK PRICE'}
                            Value2={item?.ask_price}
                            Title3={'DAY VOLUME'}
                            Value3={item?.days_volume}
                        />

                        <HistoryDetailsComponent
                            Title1={'QUANTITY'}
                            Value1={item?.number_of_share}
                            Title2={'CLOSED PRICE'}
                            Value2={item?.new_last_price}
                            // Title3={'PRODUCT'}
                            // Value3={item?.product_type}
                        />
        
                        </View>
        
                        <View style={{backgroundColor:'#f1f1f1', paddingHorizontal:R.fontSize.extraSmall, paddingVertical:R.fontSize.large,marginTop:5}}>
                            <View style={{flexDirection:'row',paddingVertical:R.fontSize.Size4}}>
                            <Text style={{fontWeight:'600', fontSize:R.fontSize.medium, color:R.colors.black}}>Status: </Text>
                            <Text style={{fontWeight:'600', fontSize:R.fontSize.medium, color: item?.profit_loss<0 ? R.colors.red : R.colors.buttonColor}} > {item?.profit_loss<0 ? `Closed With Loss` : `Closed With Profit`}</Text>
                            </View>                           
                            <View style={{backgroundColor: item?.profit_loss<0 ? R.colors.red : R.colors.buttonColor,borderRadius:4,flexDirection:'row',paddingVertical:R.fontSize.extraSmall, paddingHorizontal:R.fontSize.extraSmall,alignItems:'center'}}>
                                <View style={{flex:1}}>
                                    <Text style={{color:R.colors.white, fontSize:R.fontSize.medium, fontWeight:'600'}}>Amount</Text>
                                    <Text style={{color:R.colors.white, fontWeight:'700', fontSize:R.fontSize.XLarge}} numberOfLines={1}>{`$ ${item?.total_price}`}</Text>
                                </View>   
                                <View style={{flex:1}}>
                                    <Text style={{color:R.colors.white, fontSize:R.fontSize.medium, fontWeight:'600'}}>{item?.profit_loss < 0 ? 'Loss' : 'Profit' }</Text>
                                    <Text style={{color:R.colors.white, fontWeight:'700', fontSize:R.fontSize.XLarge}} numberOfLines={1}>{`$ ${(item?.profit_loss).toFixed(3)}`}</Text>
                                </View>  
        
                            </View>    
                        </View>
                       
                        </View>

                    )
                })   

            }

            </View>
            </View>
            :
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <ActivityIndicator  size={'large'} color={R.colors.buttonColor}/>
            </View>
        }
        </StoryScreen>
    )
}

export default PreviewScreen;