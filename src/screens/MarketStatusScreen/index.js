import * as React from 'react';
import {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Text,ScrollView, ActivityIndicator } from 'react-native';
import {Header, StoryScreen} from '../../components'
import R from '../../res/R'
import {Config} from '../../config';
import Style from './styles';

const marketHolidayTitle = [
    {
        id:'1',
        title: 'Date'
    },
    {
        id:'2',
        title: 'Holiday Name'
    },
    {
        id:'3',
        title: 'Market Status'
    }
]


const MarketStatusScreen = (props) => {

    const [loading, setLoading] = useState(false)
    const [holidayList, setHolidayList] = useState([])
    const [marketStatus, setMarketStatus] = useState(false)

    useEffect(()=>{
        MarketOpenCloseAPI()
        StockHolidayAPI()
    },[props.navigation])

    const MarketOpenCloseAPI = () => {
        setLoading(false)
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/marketStatus`)
        .then(res => res.json())
        .then(response => {
            setLoading(true)
            if(response.messages?.exchanges?.nasdaq === 'extended-hours')
            {
                setMarketStatus(true)
            }
            else
            {
                setMarketStatus(false)
            }
            console.log('Market Open Close', response.messages?.exchanges?.nasdaq)
        })
    }

    const StockHolidayAPI = () => {
        setLoading(false)
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/holydayCalenderApi`)
        .then(res => res.json())
        .then(response => {
            setLoading(true)
            console.log('Stock Holiday List', response)
            setHolidayList(response?.data)
        })
    }



    return(
        <StoryScreen statusBarStyle= 'dark-content'>
            <Header
             leftSource={R.images.backButton}
             backAction={() => { props.navigation.goBack() }}
             title={`Market Status`}
            />
            {
            loading
            ?
            <View style={Style.mainView}>      
                <View style={{height:R.fontSize.Size150, backgroundColor: marketStatus ? R.colors.buttonColor : R.colors.red, borderRadius:R.fontSize.Size4, alignItems:'center', justifyContent:'center'}}>
                    <Text style={Style.marketStatusText}>Market Status</Text>
                    <Text style={Style.marketOpen}>{marketStatus ? `OPEN` : `CLOSED`}</Text>
                </View>    
            <View style={Style.stockMarketMainView}>
                <View style={Style.stockMarketView}>
                    <Text style={Style.stockMarketText}>
                        {`Stock Market Holidays Of Year`}
                    </Text>
                </View>

                <View style={Style.HolidayTitleMainView}>
                    {
                    marketHolidayTitle.map((item, index)=>{
                        return(
                            <View 
                            key={index}
                            style={Style.HolidayTitleView}>
                                <Text style={Style.HolidayTitleText}>
                                    {item?.title}
                                </Text>
                            </View>
                        )
                    })
                    }   
                </View> 

                <ScrollView contentContainerStyle={{flexGrow:1}}>
                    {
                     holidayList.map((item, index)=>{
                         return(
                            <View
                            key={index}
                            style={Style.HolidayValueMainView}>
                                <View style={Style.HolidayValueView}>
                                    <Text style={Style.HolidayValueText}>{item?.date}</Text>
                                </View>
                                <View style={Style.HolidayValueView}>
                                    <Text style={Style.HolidayValueText}>{item?.name}</Text>
                                </View>
                                <View style={Style.HolidayValueView}>
                                    <Text style={Style.HolidayValueText}>{item?.status}</Text>
                                </View>
                            </View>
                         )
                     })
                    }
                </ScrollView>
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

export default MarketStatusScreen



