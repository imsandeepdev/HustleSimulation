import * as React from 'react';
import {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Text,ScrollView, ActivityIndicator, FlatList, Alert } from 'react-native';
import {Header, StoryScreen} from '../../components'
import R from '../../res/R';
import { Config } from '../../config';
import { store } from '../../store';
import {SwipeListView} from 'react-native-swipe-list-view';
import Toast from 'react-native-simple-toast';

const MyAchievements = (props) => {

    const [loading, setLoading] = useState(false)
    const [achivementsList, setAchivementsList] = useState([])
    const [noFound, setNoFound] = useState(false)

    useEffect(()=>{
      MyAchievementsList()
    },[props.navigation])

    const {
        auth:{authToken} 
    } = store.getState();
    const headerForAuth = {
        'Accept': "application/json",
        'Authorization': `Bearer ${authToken}`,
      };

    const MyAchievementsList = () => {
        setLoading(false)
        fetch(`http://18.216.142.130/HustelAppApi/public/api/achivements`,{
            method:'GET',
            headers: headerForAuth
        })
        .then(res => res.json())
        .then(response => {
            if(response.status === 'success')
            {
                setLoading(true)
                setAchivementsList(response.data)
                console.log('MyAchievements RESPONSE', response)
            }
            else
            {
                setLoading(true)
                setNoFound(true)
            }

            
    })
    }

    const onAllAchievementsClear = () => {
        Alert.alert(
            'Alert!',
            'Are you sure want to Remove All Achievements?',
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
        onRemoveAllAchievementsAPI() 
     }

     const onRemoveAllAchievementsAPI = () => {
        setLoading(false)
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/deleteAchivements`,{
            method:'POST',
            headers: headerForAuth
        }) 
        .then(res => res.json())
        .then(response=>{
            setLoading(true)
            console.log('Remove All Achievements LIST', response),
            Toast.show(response.message, Toast.SHORT)
            MyAchievementsList()
        })
    }

    const removeAlert = (id) => {
        Alert.alert('','Are you sure want to delete this Achievements?',[{
            text:'No',
            style:'no',
            onPress:()=>{
                
            },
        },
        {
            text:'Yes',
            onPress:()=>{
                    onSelectedAchievementsDelete(id)
            }
        }
        ])
    }

    const onSelectedAchievementsDelete = (id) => {
        setLoading(false)
        fetch (`${Config.BASE_URL}HustelAppApi/public/api/deleteAchivementsItem?achivement_id=${id}`,{
            method:'POST',
            headers: headerForAuth  
        })
        .then(res => res.json())
        .then(response => {
            console.log('RESPONSE OF DELETE Achievements', response)
            Toast.show(`${response.message}`,Toast.SHORT)
            MyAchievementsList()
            setLoading(true)
        })
        .catch((error)=>{
            console.log('Catch Error Message in API Services',error.message);      
        })
    }
 

    return(
        <StoryScreen statusBarStyle= 'dark-content'>
            <Header
             leftSource={R.images.backButton}
             backAction={() => { props.navigation.goBack() }}
             title={`My Achievements`}
            />
            {
            loading
            ?     
            <View style={{flex:1, backgroundColor:R.colors.backgroundColor}}>
                <View style={{paddingHorizontal:R.fontSize.large, paddingVertical:R.fontSize.Size8,backgroundColor:R.colors.buttonColor, flexDirection:'row', alignItems:'center'}}>
                    <Text style={{fontSize:R.fontSize.medium, fontWeight:'600', color:R.colors.white, flex:1}}>Achievements</Text>
                    <TouchableOpacity
                    onPress={ ()=> onAllAchievementsClear()}
                    disabled={!noFound ? false : true}
                    style={{borderWidth:1, padding:R.fontSize.Size4, borderColor:R.colors.white}}
                    >
                        <Text style={{fontSize:R.fontSize.medium, fontWeight:'600', color: R.colors.white}}>Remove All</Text>
                    </TouchableOpacity>
                </View>

                {
                !noFound
                ?
                
                <View style={{flex:1,  paddingTop:R.fontSize.Size4, marginVertical: R.fontSize.Size5}}>
                <SwipeListView
                    data={achivementsList}
                    keyExtractor = {item => item.id}
                    renderItem ={({item}) => {
                        return(
                            <View 
                            style={{marginHorizontal:R.fontSize.extraSmall, padding:R.fontSize.Size4, borderWidth:1, flexDirection:'row', borderColor: R.colors.placeholderTextColor, marginVertical:R.fontSize.Size4, backgroundColor:R.colors.white}}>
                            <View style={{height:R.fontSize.Size45, width:R.fontSize.Size45, borderRadius:R.fontSize.Size4, borderWidth:0.5, alignItems:'center', justifyContent:'center', overflow:'hidden', borderColor: R.colors.placeholderTextColor, marginVertical: R.fontSize.Size4}}>
                                <Image source={{uri: item?.logo}} resizeMode={'contain'} style={{height:R.fontSize.Size45, width:R.fontSize.Size45}} />
                            </View>
                            <View style={{flex:1, flexDirection:'row', marginHorizontal:R.fontSize.Size4}}>
                                <View style={{flex:1, justifyContent:'space-evenly'}}>
                                    <Text style={{fontSize: R.fontSize.small, marginTop:2, color:R.colors.placeholderTextColor, fontWeight:'500'}}>Trade Id: <Text style={{color:R.colors.black, fontWeight:'normal'}}>{item?.trade_id}</Text></Text>
                                    <Text style={{fontSize: R.fontSize.small, marginTop:2, color:R.colors.placeholderTextColor, fontWeight:'500'}}>Closed Time: <Text style={{color:R.colors.black, fontWeight:'normal'}}>{item?.close_time}</Text></Text>   
                                </View>
                                <View style={{flex:1, justifyContent:'space-evenly'}}>
                                    <Text style={{fontSize:R.fontSize.medium, fontWeight:'600', color:R.colors.placeholderTextColor}} numberOfLines={1}>{`Symbol `}<Text style={{color: R.colors.buttonColor}}>{item?.company_symbol}</Text></Text>
                                    <Text style={{fontSize:R.fontSize.medium, fontWeight:'600', color:R.colors.placeholderTextColor}} numberOfLines={1}>{`Achievement `}<Text style={{color: R.colors.buttonColor}}>{(item?.profit_loss).toFixed(3)}</Text></Text>
                                </View>
                            </View>
                            </View>
                        )
                    }}

                    renderHiddenItem={ ({item}) => (          
                        <TouchableOpacity
                         onPress={()=> removeAlert(item.id)} style={{alignSelf:'center',backgroundColor:'red',width:R.fontSize.Size60,flex:1,justifyContent:'center',alignSelf:'flex-end',borderTopRightRadius:R.fontSize.Size4,borderBottomRightRadius:R.fontSize.Size4,marginVertical:R.fontSize.Size4, marginRight:R.fontSize.extraSmall}}>
                                <Image style={{height:R.fontSize.EXXXLarge,width:R.fontSize.EXLarge,alignSelf:'center',resizeMode:'contain'}} source={R.images.delete_icon} />
                        </TouchableOpacity>
                     )}
        
                    leftOpenValue={0}
                    rightOpenValue={-75}
                    // ItemSeparatorComponent={(props) => {
                    //   return (<View style={{height: 1, backgroundColor: '#DDDDDD'}} />);
                    // }}   

                />
                </View>
                :
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:R.fontSize.medium, color:R.colors.black}} numberOfLines={1}>
                        {`No found achievements`}
                    </Text>
                </View>    
                }

            </View>
            :
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <ActivityIndicator  size={'large'} color={R.colors.buttonColor} />
            </View>
        }
        </StoryScreen>
    )
}

export default MyAchievements



