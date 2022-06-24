import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, TouchableOpacity, Image, Text, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import R from '../../res/R';
import {Button, Header,StoryScreen} from '../../components';
import { store } from '../../store';
import { Config } from '../../config';
import Styles from './styles';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

const TradeHistory = (props) => {

    const [tradingHistory, setTradingHistory] = useState([])
    const [tradeHistorySuccess, setTradeHistorySuccess] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        tradeHistoryAPI()
    },[props.navigation])

    const tradeHistoryAPI = () => {
        setLoading(false)
        const {
            auth:{authToken} 
        } = store.getState();
        const headerForAuth = {
            'Accept': "application/json",
            'Authorization': `Bearer ${authToken}`,
          };
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/getHistory`,{
            method:'GET',
            headers: headerForAuth
        })
        .then(res => res.json())
        .then(response => {
            console.log('Response Of GET HISTROY', response)
            setTradingHistory(response?.data)
            setTradeHistorySuccess(response)
            setLoading(true)
        })
        .catch((error)=>{
            console.log('Catch Error Message in API Services',error.message);      
        }) 
    }

    const removeAlert = (item) => {
        Alert.alert('','Are you sure want to delete this History?',[{
            text:'No',
            style:'no',
            onPress:()=>{
                
            },
        },
        {
            text:'Yes',
            onPress:()=>{
                    onSelectedHistoryDelete(item.id)
            }
        }
        ])
        }

        const onSelectedHistoryDelete = (id) => {
            setLoading(false)
            const {
                auth:{authToken} 
            } = store.getState();
            const headerForAuth = {
                'Accept': "application/json",
                'Authorization': `Bearer ${authToken}`,
              };
            fetch (`${Config.BASE_URL}HustelAppApi/public/api/deleteHistoryItem?history_id=${id}`,{
                method:'POST',
                headers: headerForAuth  
            })
            .then(res => res.json())
            .then(response => {
                console.log('RESPONSE OF DELETE TRADE SELCTED', response)
                Toast.show(`${response.message}`,Toast.SHORT)
                tradeHistoryAPI()
                setLoading(true)
            })
            .catch((error)=>{
                console.log('Catch Error Message in API Services',error.message);      
            })
        }
        
        const onAllTradeHistoryClear = () => {
            Alert.alert(
                'Alert!',
                'Are you sure want to Remove All Trade History?',
                [
                    {
                        text:'REMOVE',
                        onPress: ()=> onDelete()
                    },
                    {
                        text: 'CANCEL',
                    },
                ],
                {
                    cancelable: true
                }
            )
        }

        const onDelete = () => {
            onRemoveAllTradeHistoryAPI() 
         }

         const onRemoveAllTradeHistoryAPI = () => {
            setLoading(false)
            const {
                auth:{authToken}
            } = store.getState();
            const headerForAuth = {
                'Accept': "application/json",
                'Authorization': `Bearer ${authToken}`,
            };
            fetch(`${Config.BASE_URL}HustelAppApi/public/api/deleteHistory`,{
                method:'GET',
                headers: headerForAuth
            }) 
            .then(res => res.json())
            .then(response=>{
                console.log('Remove All Trade History Data on Trade Histry Screen', response),
                Toast.show(response.message, Toast.SHORT)
                tradeHistoryAPI()
                setLoading(true)
            })
        }

    return(
        <StoryScreen statusBarStyle="dark-content">
            <Header
            leftSource={R.images.backButton }
            backAction={()=> props.navigation.goBack()}
            title={'Trade History'}
            />
        {
        loading
        ?
        <View
        style={{flex:1}}
        >
            <View 
            style={{marginTop:2, backgroundColor:R.colors.buttonColor,flexDirection:'row', height:45,alignItems:'center'}}
            >
                <Text style={{color:R.colors.white, fontSize:R.fontSize.large, fontWeight:'500',paddingLeft:5,flex:1}}>All Trade History </Text>
                <View  style={{flexDirection:'row',alignItems:'center'}}>
                    
                    <TouchableOpacity
                    onPress={()=>onAllTradeHistoryClear()}
                    disabled={(tradeHistorySuccess?.data != '' && tradeHistorySuccess?.data != null) ? false : true}
                    style={{borderWidth:1, borderColor:R.colors.white, borderRadius:4,alignItems:'center',justifyContent:'center',padding:5,paddingHorizontal:8, marginHorizontal:5}}
                    >
                        <Text style={{color:R.colors.white, fontWeight:'500', fontSize:R.fontSize.medium}}>Remove All</Text>
                    </TouchableOpacity>

                </View>    
            </View> 


            {
            (tradeHistorySuccess?.data != '' && tradeHistorySuccess?.data != null)
            ?  
            <View style={Styles.mainView}>    
            <SwipeListView
                style={{flex:1, paddingBottom:R.fontSize.extraSmall}}
                keyExtractor={(item,index)=>item.id}
                data={tradingHistory}
                renderItem={(data,index) => {
                    return(
                        <TouchableOpacity
                        key={index}
                        onPress={
                            ()=>props.navigation.navigate('PreviewScreen',{
                            value: data.item?.trade_id,
                            Syambol: data.item?.company_symbol
                        })}
                        style={Styles.cardTouchMain}>
                            {
                            console.log('History Data',data)
                        }
                            <View style={Styles.cardFirstView}>
                                <View style={Styles.firstView}>
                                     <Image source={R.images.clock_icon} 
                                     resizeMode={'contain'} 
                                     style={Styles.firstImage}
                                     />
                                     <Text style={Styles.firstText}>
                                         {(data.item?.close_time)}
                                         {/* {`${data.item?.close_time}`} */}
                                    </Text>
                                </View>
                                <Text style={Styles.tradeidText}>
                                    {`Trade id:`} 
                                    <Text>{data.item?.trade_id}</Text>
                                </Text>    
                            </View>
                            <View style={Styles.secondMainView}>
                                <View style={Styles.firstView}>
                                    <View  style={Styles.secondImageView}>
                                        <Image 
                                        source={{uri:data.item?.logo}} 
                                        resizeMode={'contain'} 
                                        style={Styles.secondImage}
                                        />
                                    </View>    
                                    <Text style={Styles.companyNameText}>
                                        {data.item?.company_symbol}
                                    </Text>
                                </View>
                                <View style={[Styles.firstView,{width:R.fontSize.Size100}]}>
                                   
                                   
                                       <Text 
                                        style={{fontSize:R.fontSize.small, color:(data.item?.profit_loss < 0) ? R.colors.red :R.colors.buttonColor, fontWeight:'600'}} 
                                        numberOfLines={1}
                                        >
                                            {(data.item?.profit_loss < 0) ? `Loss :`:`Profit :`} 
                                            <Text> {`$ ${(data.item?.profit_loss).toFixed(3)}`}</Text>
                                        </Text>
                                         
                                   
                                         
                                </View>
                            </View>
   
                            <View
                            style={Styles.ThirdMainView}
                            >
                                <Text style={Styles.ThirdText}>Open Price:  
                                    <Text style={{fontWeight:'normal'}}>{ data.item?.price_paid}</Text>
                                </Text>
                                <Text style={Styles.ThirdText}>Open Time: 
                                    <Text style={{fontWeight:'normal'}}>
                                        { data.item?.open_time}
                                        {/* {moment(data.item?.open_time).format('Do,MMM hA')} */}
                                    </Text>
                                </Text>   
                            </View>  
                            <View
                            style={{flexDirection:'row',justifyContent:'space-between'}}
                            >
                                <Text style={Styles.ThirdText}>Closed Price:  
                                    <Text style={{fontWeight:'normal'}}>
                                        { data.item?.last_price}
                                    </Text>
                                </Text>
                                <Text style={Styles.ThirdText}>Closed Time:  
                                    <Text style={{fontWeight:'normal'}}>
                                        {moment(data.item?.close_time).format('Do,MMM hA')}
                                        {/* { data.item?.close_time} */}
                                    </Text>
                                </Text>   
                            </View> 

                            <View style={[Styles.firstView, {marginVertical:R.fontSize.Size4}]}>
                                <Text style={{fontSize:R.fontSize.small, color:R.colors.placeholderTextColor}}>
                                    {`Status :`}
                                </Text>
                                
                                    <Text style={{fontSize:R.fontSize.small, color: (data.item?.profit_loss < 0) ? R.colors.red : R.colors.buttonColor}} numberOfLines={1}>
                                    {(data.item?.profit_loss < 0) ? `Closed With Loss` :`Closed With Profit`}
                                    </Text>
                                    
                                
                                
                            </View>      
                        </TouchableOpacity>
                    )
                }}
                renderHiddenItem={ (data,index) => (          
                <TouchableOpacity
                key={index}
                 onPress={()=> removeAlert(data.item)} style={{alignSelf:'center',backgroundColor:'red',width:R.fontSize.Size60,flex:1,justifyContent:'center',alignSelf:'flex-end',borderTopRightRadius:R.fontSize.Size4,borderBottomRightRadius:R.fontSize.Size4,marginVertical:R.fontSize.Size4, marginRight:R.fontSize.Size8}}>
                        <Image style={{height:R.fontSize.EXXXLarge,width:R.fontSize.EXLarge,alignSelf:'center',resizeMode:'contain'}} source={R.images.delete_icon} />
                </TouchableOpacity>
             )}

            leftOpenValue={0}
            rightOpenValue={-75}
            ItemSeparatorComponent={(props) => {
              return (<View style={{height: 1, backgroundColor: '#DDDDDD'}} />);
            }}   
            />
            </View>
            :
            (
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:R.fontSize.medium, color:R.colors.black, textAlign:'center'}} numberOfLines={1}>{`Not found any trading history`}</Text>
                </View>
            )
            }
        </View>
        :
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <ActivityIndicator  size={'large'} color={R.colors.buttonColor}/>
        </View>
        }

        </StoryScreen>
    )
}

export default TradeHistory;