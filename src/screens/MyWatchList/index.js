import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, TouchableOpacity, Image, Text, ScrollView, Alert, ActivityIndicator} from 'react-native';
import R from '../../res/R';
import {Button, Header,StoryScreen} from '../../components';
import { store } from '../../store';
import Toast from 'react-native-simple-toast';
import { Config } from '../../config';
import {SwipeListView} from 'react-native-swipe-list-view';

const WatchListTitle=['Symbol','Exchange','Last Price','Change($)','Volume']


const MyWatchList = (props) => {

    const [watchListContent, setWatchListContent] = React.useState([])
    const [loading, setLoading] = useState(false)

const onDelete = () => {
   onRemoveAllWatchListAPI() 
}
    

const onMyWatchList = () => {

    Alert.alert(
        'Alert!',
        'Are you sure want to Remove All WatchList?',
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

useEffect(()=>{
    setLoading(false)
    onGetWatchListAPI()
    setLoading(true)
},[props.navigation])

const onGetWatchListAPI = () => {
    const {
        auth:{authToken}
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
    };
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/getWishList`,{
        method:'GET',
        headers: headerForAuth
    })
    .then(res => res.json())
    .then(response => {
        console.log('Response JSON ON WATCH LIST', response.data)
        setWatchListContent(response.data)
    })
    .catch(()=>{
        Toast.show('Not Found Company in Watchlist',Toast.SHORT)
    })   
}


const onRemoveAllWatchListAPI = () => {
    setLoading(false)
    const {
        auth:{authToken}
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
    };
    fetch(`${Config.BASE_URL}HustelAppApi/public/api/deleteWishList`,{
        method:'GET',
        headers: headerForAuth
    }) 
    .then(res => res.json())
    .then(response=>{
        console.log('Remove All Watchlist Data on Watchlist Screen', response),
        Toast.show(response.message, Toast.SHORT)
        onGetWatchListAPI()
        setLoading(true)
    })
}

const removeAlert = (item) => {
    Alert.alert('','Are you sure want to delete this from Watchlist?',[{
        text:'No',
        style:'no',
        onPress:()=>{
            
        },
    },
    {
        text:'Yes',
        onPress:()=>{
                onSelectedWishlistDelete(item.id)
        }
    }
    ])
    }

    const onSelectedWishlistDelete = (id) => {
        setLoading(false)
        const {
            auth:{authToken} 
        } = store.getState();
        const headerForAuth = {
            'Accept': "application/json",
            'Authorization': `Bearer ${authToken}`,
          };
        fetch (`${Config.BASE_URL}HustelAppApi/public/api/deleteWishListItem?wishList_id=${id}`,{
            method:'POST',
            headers: headerForAuth  
        })
        .then(res => res.json())
        .then(response => {
            console.log('RESPONSE OF DELETE WISHLIST SELCTED', response)
            onGetWatchListAPI()
            Toast.show(`${response.message}`,Toast.SHORT)
            setLoading(true)
        })
        .catch((error)=>{
            console.log('Catch Error Message in API Services',error.message);      
        })
    }

    return(
        <StoryScreen statusBarStyle="dark-content">
            <Header
            leftSource={R.images.backButton }
            backAction={()=> props.navigation.goBack()}
            title={'My WatchList'}
            />
        <View
        style={{flex:1}}
        >
        {
        loading ?
            <View style={{flex:1, backgroundColor:R.colors.white}}>

            <View 
            style={{marginTop:2, backgroundColor:R.colors.buttonColor,flexDirection:'row', height:45,alignItems:'center'}}
            >
                <Text style={{color:R.colors.white, fontSize:R.fontSize.large, fontWeight:'500',paddingLeft:5,flex:1}}>All WatchList</Text>
                <View  style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity
                    onPress={()=> props.navigation.navigate('Search',{from:'WatchList'})}
                    style={{borderWidth:1, borderColor:R.colors.white, borderRadius:4,alignItems:'center',justifyContent:'center',padding:5,paddingHorizontal:8, marginHorizontal:5}}
                    >
                        <Text style={{color:R.colors.white, fontWeight:'500', fontSize:R.fontSize.medium}}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>onMyWatchList()}
                    disabled={(watchListContent != '' && watchListContent != null) ? false : true}
                    style={{borderWidth:1, borderColor:R.colors.white, borderRadius:4,alignItems:'center',justifyContent:'center',padding:5,paddingHorizontal:8, marginHorizontal:5}}
                    >
                        <Text style={{color:R.colors.white, fontWeight:'500', fontSize:R.fontSize.medium}}>Remove All</Text>
                    </TouchableOpacity>

                </View>    
            </View> 

            {
            watchListContent != '' && watchListContent != null
            ?
            <View style={{marginHorizontal:R.fontSize.Size8,marginTop:5,flex:1}}>
                
                <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:5,alignItems:'center',shadowOpacity: 0.30,shadowRadius: 4.65,
                            elevation: R.fontSize.Size8, 
                            backgroundColor:'#ddffdd',
                            height:R.fontSize.Size45
                            }}>
                    {
                        WatchListTitle.map((item,index)=>{
                            return(
                                <View
                                key={index}
                                style={{flex:1,alignItems:'center',justifyContent:'center'}}
                                >
                                <Text style={{fontWeight:'500',fontSize:R.fontSize.medium}}>
                                    {item}
                                </Text> 
                                </View>   
                            )
                        })
                    }
                </View>  

                <SwipeListView
                style={{flex:1, paddingBottom:R.fontSize.extraSmall}}
                keyExtractor={(item,index)=>item.id}
                data={watchListContent}
                renderItem={(data, index)=> {
                    return(
                        <TouchableOpacity 
                            onPress={()=>
                                props.navigation.navigate('TradingScreen',{
                                    from: data.item?.symbol,
                                })
                            }
                            style={{flexDirection:'row',justifyContent:'space-between',marginVertical:4,alignItems:'center',borderColor:R.colors.placeholderTextColor, paddingVertical:5,flex:1, shadowColor: "#000",shadowOffset: {width: 0,height: 4},
                            shadowOpacity: 0.30,shadowRadius: 4.65,
                            elevation: R.fontSize.Size8, 
                            backgroundColor:R.colors.white,
                            height:R.fontSize.Size45,
                            borderWidth:1
                        }} 
                            key={index}>
                                <View style={{flex:1, alignItems:'center',marginHorizontal:2}}>
                                    <Text style={{fontSize:R.fontSize.small}} numberOfLines={1}>{data.item?.symbol}</Text> 
                                </View>
                                <View style={{flex:1, alignItems:'center',marginHorizontal:2}}> 
                                    <Text style={{fontSize:R.fontSize.small}} numberOfLines={1}>{data.item?.exchange}</Text> 
                                </View>     
                                <View style={{flex:1, alignItems:'center',marginHorizontal:2}}>  
                                    <Text style={{fontSize:R.fontSize.small}} numberOfLines={1}>{data.item?.last_price}</Text>   
                                </View>
                                <View style={{flex:1, alignItems:'center',marginHorizontal:2}}> 
                                    <Text style={{fontSize:R.fontSize.small}} numberOfLines={1}>{data.item?.change_value}</Text>
                                </View> 
                                <View style={{flex:1, alignItems:'center',marginHorizontal:2}}>   
                                    <Text style={{fontSize:R.fontSize.small}} numberOfLines={1}>{data.item?.volume}</Text>    
                                </View>
                        </TouchableOpacity>
                    )
                }}

                renderHiddenItem={ (data,index) => (          
                    <TouchableOpacity
                    key={index}
                     onPress={()=> removeAlert(data.item)} 
                     style={{alignSelf:'center',backgroundColor:'red',width:R.fontSize.Size60,flex:1,justifyContent:'center',alignSelf:'flex-end',borderTopRightRadius:R.fontSize.Size4,borderBottomRightRadius:R.fontSize.Size4,marginVertical:R.fontSize.Size6, marginRight:R.fontSize.Size8}}>
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
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:R.fontSize.medium, color:R.colors.black}} numberOfLines={2}>
                    {`No company found in watchlist`}
                </Text>
            </View>    
            }
            </View>
        :
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <ActivityIndicator size={'large'} color={R.colors.buttonColor}/>
        </View>
        }
        </View>

        </StoryScreen>
    )
}

export default MyWatchList;