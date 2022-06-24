import * as React from 'react';
import {useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, StatusBar, Platform, ActivityIndicator, FlatList} from 'react-native'
import { StoryScreen, Button, GradientButton, Header } from '../../components';
import R from '../../res/R';
import { LineChart, Grid , YAxis} from 'react-native-svg-charts';
import Toast from 'react-native-simple-toast';
import { store } from '../../store';
import { Config } from '../../config';
import Style from './styles';



const CompanyScreen = (props) => {

    const [from, setFrom] = useState('');
    const [loading, setLoading] = useState(false)
    const [stockIndexList, setStockIndexList] = useState([])
    const datafrom = props.route.params?.from;
    const [companiesArray, setCompaniesArray] = useState([])

    const [noFound, setNoFound] = useState(false)

    React.useEffect(()=>{
    OnCompanyListing(props.route.params?.STOCKINDEX)
    setFrom(props.route.params?.from)
    // setStockIndexList(props.route.params?.STOCKINDEX)
    // onCallStockIndexCompaniesList(props.route.params?.STOCKINDEX)
    const subscribeFocus = props.navigation.addListener('focus',() => {

    console.log('Call back fromos', from ) 
    });
    return subscribeFocus
    },[props.navigation])

    const onWishListAdd = () => {
        return(
            Toast.show('Add to Wishlist', Toast.SHORT)
        )
    }

    async function OnCompanyListing(index){
        try
        {
            setLoading(false)
            const response = await fetch(`${Config.BASE_URL}HustelAppApi/public/api/${index}`);
            const json = await response.json();
            console.log('RESPONSE JSON TRY', json.data)
            setCompaniesArray(json.data)
            setLoading(true)

            // .then(res => res.json())
            // .then(response => {
            //     console.log('Response JSON SUCCESS', response.data)
            //     setCompaniesArray(response.data)
            //     setLoading(true)
            // })
        }
        catch(err){
            console.log('Response Error', err);
            setNoFound(true)
        }
    }

    // const onCallStockIndexCompaniesList = (INDEXARRAY) => {
    //     console.log('LOG INDEX ARRAT LIST',INDEXARRAY)
    //     setLoading(false)
    //     let length  = INDEXARRAY.length;
    //     let i;
    //     let StockIndexArray = []
    //     for(i=0; i<length; i++)
    //     {
    //     fetch(`${Config.BASE_URL}HustelAppApi/public/api/companyListingApi?company_name=${INDEXARRAY[i]}`)
    //     .then(res => res.json())
    //     .then(response => {
    //         console.log('response Data on Companies List Page', response)
    //         if(StockIndexArray.length < length)
    //         {
    //             StockIndexArray.push(response)
    //             console.log('Response Array Values of Stcok Index ', StockIndexArray)
    //             console.log('Response Array Values of Stcok Index ON USE STATE ', companiesArray)
    //         }
    //         if(StockIndexArray.length === length)
    //         {
    //             console.log('Print and Show Loading')
    //             setCompaniesArray(StockIndexArray)
    //             setLoading(true)
    //         }
    //     })
    //     }
    // }

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

    


    return(
        <StoryScreen statusBarStyle= 'dark-content' loading={props.loading}>
            <Header
            leftSource={R.images.backButton}
            backAction={() => { props.route.params?.fromScreen === 'Search' ? props.navigation.goBack() : props.navigation.replace('HomeScreen') }}
            title={datafrom}

            />
        {
        !noFound
        ?
         
        <View style={{flex:1, paddingHorizontal:R.fontSize.Size4}}>
            {
            loading ?
            <View style={{flex:1, backgroundColor:R.colors.white}}> 
            <View style={{marginTop:R.fontSize.Size8, flex:1}}>
            <View style={{marginVertical:R.fontSize.Size8,alignItems:'center'}}>
                <Text
                style={{fontSize:R.fontSize.small, fontWeight:'500', textAlign:'center',color:R.colors.placeholderTextColor}}
                >{`Start Trading with ${datafrom} Stock Exchange Companies`}</Text>
            </View>    
                <View style={{flex:1}} >
                    <FlatList
                        style={{flex:1}}
                        showsVerticalScrollIndicator={false}
                        data={companiesArray}
                        keyExtractor={(item) => item.id}
                        renderItem={({item, index})=>{
                            return(
                                <TouchableOpacity
                                    key={index}
                                    onPress={()=> props.navigation.navigate('TradingScreen',{
                                        from: item.company_name
                                    })}
                                    style={Style.touchView}>               
                                            <View  style={Style.imageView} >
                                                <Image 
                                                source={{uri:item.company_logo}} 
                                                resizeMode={'contain'} 
                                                style={Style.imageSyntax} 
                                                />
                                            </View>    
                                            <View style={Style.CompanyNameView}>
                                                <Text style={Style.companyName} 
                                                    numberOfLines={2}
                                                >
                                                    {item.company_name}
                                                </Text>
                                                <Text style={Style.usdText} 
                                                      numberOfLines={1}>
                                                    {'USD'}
                                                </Text>
                                            </View>
                
                                            <View style={{flex:1, marginHorizontal:R.fontSize.Size4}}>
                                            <LineChart
                                                    style={{height:R.fontSize.Size100,borderBottomWidth:0.5,borderLeftWidth:0.5,marginVertical:R.fontSize.extraSmall, borderColor:R.colors.placeholderTextColor}}
                                                    data={item?.graph_values}
                                                    svg={{ strokeWidth:1, stroke:'green'}}
                                                    contentInset={{ top: R.fontSize.extraSmall, bottom: R.fontSize.extraSmall }}
                                            >
                                                    <Grid />
                                            </LineChart>
                                            </View>
                                            
                                            <View style={{flex:1,marginHorizontal:R.fontSize.Size4}}>
                                                <View 
                                                style={{flexDirection:'row',alignItems:'center'}}
                                                >
                                                <Image 
                                                source={R.images.usDoller_icon} 
                                                style={{height:R.fontSize.large,width:R.fontSize.large}} 
                                                resizeMode={'contain'} />
                                                    <Text 
                                                    style={{fontWeight:'600', fontSize: R.fontSize.medium, color:R.colors.black}}>
                                                        {item?.last_trade}
                                                    </Text>
                                                </View>
                                                
                                                <View
                                                    style={{flexDirection:'row', alignItems:'center'}}
                                                    >   
                                                        <Text 
                                                        style={{color: (item?.last_trade - item?.previous_close ) < 0 ? 'red' : R.colors.buttonColor, fontSize:R.fontSize.medium}} 
                                                        numberOfLines={1}>
                                                            { (item?.last_trade - item?.previous_close).toFixed(2) } 
                                                        </Text>    
                                                         <Text style={{fontSize:R.fontSize.large, color:R.colors.placeholderTextColor}}> / </Text>   
                                                        <Text 
                                                        style={{color: (item?.last_trade - item?.previous_close ) < 0 ? 'red' : R.colors.buttonColor, fontSize:R.fontSize.medium}} 
                                                        numberOfLines={1}>
                                                            {
                                                            (`${(((item?.last_trade - item?.previous_close ) * 100) /item?.last_trade).toFixed(2)}`)
                                                            } 
                                                        </Text> 
                                                        <Text style={{color: (item?.last_trade - item?.previous_close ) < 0 ? 'red' : R.colors.buttonColor,  width:R.fontSize.large, fontSize:R.fontSize.medium}} 
                                                        numberOfLines={1}>%</Text>   
                                                </View>
                                                   

                                            </View>
                                            <TouchableOpacity
                                            onPress={()=>onAddWatchListAPI(item?.company_name)}
                                            style={{position:'absolute',right:R.fontSize.extraSmall,top:R.fontSize.extraSmall,alignItems:'center',justifyContent:'center', paddingHorizontal:2, borderWidth:1, borderRadius:R.fontSize.Size4, borderColor:R.colors.buttonColor}}
                                            >
                                                <Image  source={R.images.green_eye_icon} resizeMode={'contain'} style={{height:R.fontSize.XXLarge,width:R.fontSize.XXLarge}}/>
                                            </TouchableOpacity>  
                        </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </View>
            </View>
            :
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <ActivityIndicator  size={'large'} color={R.colors.buttonColor}/>
            </View>
        
        }
        </View>
        :

        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:R.fontSize.medium, color:R.colors.black,textAlign:'center'}} numberOfLines={1}>{'Sorry! No Found Company List'}</Text>
        </View>

       }

        </StoryScreen>

    )
}


export default CompanyScreen;