import * as React from 'react';
import {useState, useEffect} from 'react';
import {View,TouchableOpacity, Text, Image, ScrollView, ActivityIndicator} from 'react-native';

import {Button,StoryScreen, Header} from '../../components';
import R from '../../res/R';
import Style from './styles';
import { Config } from '../../config';
import { store } from '../../store';

const PendingPosition = (props) => {

const [pendingPositionList, setPendingPositionList] = useState([])
const [loading, setLoading] = useState(false)
const [marketStatus, setMarketStatus] = [false]
const [noFound, setNoFound] = useState(false)

useEffect(()=>{
    const unsubscribe = props.navigation.addListener('focus',()=>{
        onfocus()
    });
    return unsubscribe;
   

},[props.navigation])

const onfocus = () =>{
    OnPendingPositionList()
    OnPendingToOpenPosition()
    MarketStatusAPI()
}

const onCallUpdate = () => {
    // const subscribe = addListener('focus', ()=>{
        setInterval(()=>{
            OnPendingPositionUpdate()
            OnPendingToOpenPosition()
            OnPendingPositionList()
        },20000)
    // });
    // return subscribe;       
}


const MarketStatusAPI = () => {
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/marketStatus`)
    .then(res => res.json())
    .then(responseData => {
        if(responseData?.messages?.market === 'closed')
        {
            // setMarketStatus(false)
            // onCallUpdate()
            console.log('On Market Close')
        }
        else
        {
            // setMarketStatus(true)
            onCallUpdate()
            console.log('On Market Open')

        }
    })
}

const OnPendingPositionUpdate = () => {
    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      };
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/updateLastPricePending`,{
        method:'GET',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => {
        if(response.status === 'success')
        {
            console.log('ONUPDATE ON PENDING POSITION UPDATE', response)
            OnPendingToOpenPosition()
            OnPendingPositionList()
        } 
           
    })
}


const OnPendingPositionList = () => {
    setLoading(false)
    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      }; 
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/getPendings`,{
        method:'GET',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => {
        if(response.status === 'success')
        {
            setLoading(true)
            console.log('Pending Position List ', response)
            setPendingPositionList(response?.data)
        }
        else
        {
            setNoFound(true)
        }
    })
    .catch((err) => {
        console.log(Error, err)
    })
}

const OnPendingToOpenPosition = () => {
    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      };
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

return(
    <StoryScreen statusBarStyle="dark-content" >
        <Header
            leftSource={R.images.backButton}
            backAction={()=> props.navigation.goBack()}
            title={'My Pending Position'}
        />
    {
    !noFound
    ?
    
        <View style={Style.mainView}>
        {
        loading
        ?
        
        <View style={Style.mainView}>
            <View style={{padding:R.fontSize.Size8, backgroundColor:R.colors.buttonColor, justifyContent:'center'}}>
                <Text style={{fontSize:R.fontSize.medium, color:R.colors.white, fontWeight:'600'}}>My Pending Positions</Text>
            </View>
            
            <ScrollView
            contentContainerStyle={{flexGrow:1}}
            >

            <View style={{flex:1}}>    
            <ScrollView
                    scrollEnabled={true}
                    horizontal={true}
                    contentContainerStyle={{flexGrow:1}}
                    showsHorizontalScrollIndicator={false}
            >

            <View style={{flex:1}}>
                {
                    pendingPositionList.map((item,index)=>{
                        return(
                            <View
                key={index}
                style={{marginHorizontal:R.fontSize.extraSmall,borderBottomWidth:0.5, borderBottomColor:R.colors.placeholderTextColor, height:R.fontSize.Size50}}
                >
                    
                <View
                style={{flexDirection:'row', marginVertical:5,flex:1,alignItems:'flex-start',justifyContent:'center'}}>
                    <View
                    style={Style.myopenPositionMainCardView}>
                        <Text style={Style.myOpenpositionTitleText}>Trade</Text>
                        <View  style={{borderWidth:1, borderColor:'red', borderRadius:4, height:R.fontSize.XXLarge, width:R.fontSize.Size50,alignItems:'center',justifyContent:'center'}} >
                            <Text style={{fontSize:R.fontSize.extraSmall, color:R.colors.black}}>{item?.trade_id}</Text>
                        </View>    
                    </View> 
                    <View style={Style.myopenPositionMainCardView}>
                        <Text style={Style.myOpenpositionTitleText}>Symbol</Text>
                        <View style={Style.myopenPositionSymbolView}>
                            <Image source={{uri: item?.symbol}} 
                            resizeMode={'contain'} 
                            style={{height:R.fontSize.XXLarge, width:R.fontSize.XXLarge}}
                            />  
                        </View>    
                    </View> 
                    <View style={Style.myopenPositionMainCardView}>
                        <Text style={Style.myOpenpositionTitleText}>Request</Text>
                        <Text> {item?.request_type}</Text>
                    </View> 
                    <View style={Style.myopenPositionMainCardView}>
                        <Text style={Style.myOpenpositionTitleText}>Qty</Text>
                        <Text>{item?.number_of_shares}</Text>
                    </View> 
                    <View style={Style.myopenPositionMainCardView}>
                        <Text style={Style.myOpenpositionTitleText}>Currancy</Text>
                        <Text>{item?.currency_name}</Text>
                    </View> 
                    <View style={Style.myopenPositionMainCardView}>
                        <Text style={Style.myOpenpositionTitleText}>Price Paid</Text>
                        <Text> {item?.price_per_share}</Text>
                    </View>  
                    <View style={Style.myopenPositionMainCardView}>
                        <Text style={Style.myOpenpositionTitleText}>Last Price</Text>
                        <Text> {(item?.new_last_price) }</Text>
                    </View> 
                   
                    <View style={[Style.myopenPositionMainCardView,{width:R.fontSize.Size100}]}>
                        <Text style={Style.myOpenpositionTitleText}>
                            Stock Amount
                        </Text>
                        <Text style={{width:80,textAlign:'center'}} numberOfLines={1}> 
                        {item?.total_amount}
                        </Text>
                    </View>
                    
                </View>
                </View>
                        )
                    })
                }

            </View>
            </ScrollView>
            </View>
            </ScrollView>
         

        </View>
        :
        (
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <ActivityIndicator size={'large'} color={R.colors.buttonColor}  />
            </View>
        )
        }
    </View>

    :
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={{textAlign:'center', marginHorizontal:10, fontSize:R.fontSize.medium, color:R.colors.black}} numberOfLines={2}>{`No found Stock's\nin Pending Position`}</Text>
    </View> 
    }

    </StoryScreen>
)
}

export default PendingPosition;

  