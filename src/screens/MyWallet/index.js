import * as React from 'react';
import {useState} from 'react';
import {View, TouchableOpacity,Text,ScrollView, Dimensions, Image, TextInput, ActivityIndicator} from 'react-native';
import {StoryScreen, Header} from '../../components';
import R from '../../res/R';
import { store } from '../../store';
import Toast from 'react-native-simple-toast';
import Styles from './styles';
import { Config } from '../../config';
import LinearGradient from 'react-native-linear-gradient';
import CommonFunctions from '../../utils/CommonFunctions';

const screenWidth = Dimensions.get('window').width

const walletAmount =[
    {
        id:1,
        value: '100'
    },
    {
        id:2,
        value: '200'
    },
    {
        id:3,
        value: '500'
    },
    {
        id:4,
        value: '800'
    },
    {
        id:5,
        value: '1000'
    },
    {
        id:6,
        value: '2000'
    }
]



const MyWallet = (props) => {

const {auth:{authToken}} = store.getState();

const headerForAuth = {
    'Accept': "application/json",
    'Authorization' : `Bearer ${authToken}`,
};


    const [amount, setAmount] = useState('')
    const [selectedid, setSelectedID] = useState('0')
    const [deposit, setDeposit] = useState()
    const [currencyName, setCurrencyName] = useState('');
    const [currencyColor, setCurrencyColor] = useState();
    const [loading, setLoading] = useState(false)
    const [upAmount, setUpAmount] = useState()
    
    const onCurrencyName = (item) => {
       
        setCurrencyName(item)
        console.log('Set currency Name', currencyName)
        if(item === 'USD')
        {
            setCurrencyColor(R.colors.USDColor)
        }
        else if(item === 'CAD')
        {
            setCurrencyColor(R.colors.CADColor)
        }
        else if(item === 'EUR')
        {
            setCurrencyColor(R.colors.EURColor)
        }
        else
        {
            setCurrencyColor(R.colors.USDColor)
        }
       
    }

    React.useEffect(() => {

        const unsubscribe = props.navigation.addListener('focus',()=>{       
           OnUserProfileAPI()
            
        });
        return unsubscribe;  
    },[props.navigation, OnWalletAmount])


    const OnUserProfileAPI = () => {
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
            OnWalletAmount()
            onCurrencyName(responseJson.profile.currency_name),
            console.log('Currency Name on Wallet Screen', responseJson.profile.currency_name)    
        })
        .catch((error)=>{
            console.log('Catch Error Message in API Services',error.message);      
        })  
    }

    const isValid = () => {
        return CommonFunctions.isBlank(amount.trim(), 'Please Enter USD')  
    }

    const OnCurrencyAPI = (amount) => {
        if(isValid())
        {
        setLoading(false)
        const {
            auth:{authToken} 
        } = store.getState();
        const headerForAuth = {
            'Accept': "application/json",
            'Authorization': `Bearer ${authToken}`,
          };
        const APIURL = `${Config.BASE_URL}HustelAppApi/public/api/addCurrencyToWallet?currency_amount=${amount}`;
        fetch (APIURL,{
            method:'POST',
            headers: headerForAuth
        })
        .then(response => response.json())
        .then(responseJson => {
            setLoading(true)
            console.log('Currency Amount Update ', responseJson),
            OnWalletAmount(),
            Toast.show(responseJson?.message, Toast.SHORT)
        })
    }   
    }


    const OnWalletAmount = () => {
        const {
            auth:{authToken} 
        } = store.getState();
        const headerForAuth = {
            'Accept': "application/json",
            'Authorization': `Bearer ${authToken}`,
          };
        const APIURL = `${Config.BASE_URL}HustelAppApi/public/api/getWalletAmount`;
        fetch (APIURL,{
            method:'GET',
            headers: headerForAuth
        })
        .then(response => response.json())
        .then(responseJson => {
            setUpAmount(responseJson?.data?.wallet_amount),
            console.log('Currency Amount', upAmount)
        
        })
    }

    const UpgradeWallet = (item) => {
        const tempData= item
        if(tempData.id === item.id)
        {
            setAmount(item.value)
            setSelectedID(item.id)
        }
    }

    const onDepositWallet = () => {
        setDeposit(amount)
    }

    const OnConfirmCurrency = () => {
        setLoading(false)
        let formData = new FormData();
        formData.append('currency_type','1');
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/user/chooseCurrencyType`,{
            method:'POST',
            headers: headerForAuth,
            body: formData
        })
        .then(response => response.json())
        .then(responseJson => {
            if(responseJson.status === true)
            {
                console.log('Currency Type List ON Wallet Screen', responseJson),
                OnUserProfileAPI()
                 setLoading(true)
                Toast.show(responseJson.message, Toast.SHORT)   
            } else {
                 Toast.show('Please Select Any Currency', Toast.SHORT)
    
            }  
        })
        .catch((error)=>{
            console.log('Catch Error Message in API Services',error.message);
        })
    }

    return(
        <StoryScreen statusBarStyle="dark-content">
            <Header
                leftSource={R.images.backButton}
                backAction={()=> props.navigation.goBack()}
                title={'My Wallet'}
            />
            {
            loading 
            ?
            <View style={Styles.mainView}>
             {
              currencyName == '' 
              ?
              <View
              style={{flex:1, alignItems:'center', justifyContent:'center', marginHorizontal:25}}
              >
                  <Text style={{textAlign:'center', fontWeight:'500', fontSize:R.fontSize.large}}>{`Now We Have Only USD Currency\nPlease!! Firstly Confirm Then You Can Check Your Wallet `}</Text>
             
                  <TouchableOpacity
                  onPress={()=> OnConfirmCurrency()}
                  style={{height:45, backgroundColor:R.colors.buttonColor,alignItems:'center', justifyContent:'center', borderRadius:4,width:'100%', marginVertical:20}}
                  >
                      <Text style={{color:R.colors.white, fontWeight:'600', fontSize:R.fontSize.XLarge}}>Confirm</Text>
                  </TouchableOpacity>
              </View> 
            :

            <View style={Styles.mainView}>   
            <ScrollView
            contentContainerStyle={{flexGrow:1}}
            showsVerticalScrollIndicator={false}
            >   
                <View style={Styles.mainView}> 
                <View style={Styles.mainView}>
                    <LinearGradient
                    start={{x:1, y:0}}
                    end={{x:1, y:1}}
                    colors={[ R.colors.darkgreen, R.colors.buttonColor]}
                    style={{marginHorizontal:R.fontSize.small, marginVertical:R.fontSize.Size4, borderRadius:R.fontSize.Size4, overflow:'hidden', borderWidth:0.3, borderColor:R.colors.placeholderTextColor, paddingVertical:R.fontSize.extraSmall, height:screenWidth/1.8}}
                    >
                        <View style={{flexDirection:'row', alignItems:'center',backgroundColor:R.colors.lightwhite, height:R.fontSize.EXLarge, width:'100%'}}>
                            <Image  source={R.images.appLogo} resizeMode={'contain'} style={{height:R.fontSize.UltraXLarge,width:R.fontSize.Size50, marginLeft:R.fontSize.Size8}}/>
                            {/* <Text style={{fontSize:R.fontSize.medium, fontWeight:'600', marginLeft:R.fontSize.Size6}}>Wallet</Text> */}
                            {/* <View style={{ flex:1, backgroundColor:R.colors.lightwhite, height:R.fontSize.EXLarge}}> */}
                                {/* <Text style={{fontSize:R.fontSize.medium, color:R.colors.white}}>Hustle</Text>
                                <Text style={{fontSize:R.fontSize.medium, color:R.colors.white}}>Wallet</Text> */}
                            {/* </View> */}
                        </View>
                        {/* <View style={{height:2, backgroundColor:R.colors.lightwhite}}/> */}
                        <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
                        <View style={{borderWidth:1, padding: R.fontSize.large, borderRadius:R.fontSize.Size4, borderColor:R.colors.white, alignItems:'center'}}>
                            <Text style={Styles.currencyNameText}>
                                {`Total ${currencyName}`}
                            </Text>
                            <Text style={Styles.currencyValueText}>
                                {/* {upAmount} */}
                                {(upAmount!=0 && upAmount!=null)? `$ ${upAmount.toFixed(4)}` : '00.00'}
                            </Text>
                        </View>
                        </View>   
                    </LinearGradient>

                    <View style={{marginTop:R.fontSize.large, marginHorizontal:R.fontSize.large}}>
                        <Text style={{fontSize:R.fontSize.medium, fontWeight:'500'}}>
                            {'Enter Amount To Add Your Wallet'}
                        </Text>
                        <Text style={{fontSize:R.fontSize.small, color:R.colors.placeholderTextColor}}>
                            {`(Can't add more then 100000 USD)`}
                        </Text>
                        {/* <View 
                        style={Styles.selectCurrencyMainView}
                        >
                            {
                                walletAmount.map((item ,index)=>{
                                    return(
                                        <TouchableOpacity
                                        onPress={()=>UpgradeWallet(item)} 
                                        key={index}
                                        style={[Styles.selectCurrencyTouch, {borderColor: item.id === selectedid ? currencyColor : R.colors.placeholderTextColor}]}>
                                          {
                                              item.id === selectedid &&
                                              <View   
                                              style={[Styles.selectCurrencyCheckView,{backgroundColor:currencyColor}]} >
                                                  <Image  source={R.images.check_icon} resizeMode={'contain'} 
                                                  style={{height:R.fontSize.large, width:R.fontSize.large}}
                                                  />
                                              </View> 
                                          }
                                            <Text style={{fontWeight:'600', fontSize:R.fontSize.large, color: item.id === selectedid ? currencyColor: '#333'}}>
                                                {item.value}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>   */}

                        <View style={{marginVertical:R.fontSize.large, flexDirection:'row'}}>
                            <View 
                            style={Styles.bottomCurrencyNameView}
                            >
                                <Text style={{fontWeight:'800', fontSize:R.fontSize.XLarge, color:currencyColor}}>{currencyName}</Text>
                            </View>
                            <View
                            style={Styles.bottomCurrencyValueView}
                            >
                                <TextInput
                                    style={{flex:1,paddingHorizontal:R.fontSize.extraSmall,fontSize:R.fontSize.XLarge, fontWeight:'800', color:currencyColor, height:R.fontSize.Size40, paddingVertical:R.fontSize.Size4}}
                                    value={amount}
                                    placeholder={'Enter Amount'}
                                    onChangeText={(amount)=>setAmount(amount)}
                                    maxLength={10}
                                />
                            </View>        
                        </View>      
                    </View>  
                </View>
                </View>
                    
            </ScrollView> 
                    <View
                    style={{paddingHorizontal:R.fontSize.large, paddingVertical:R.fontSize.extraSmall,shadowColor: "#000",
                    shadowOffset: {width: 0,height: 2},shadowOpacity: 0.25,shadowRadius: 3.84, elevation: 5, backgroundColor:'#fff'}}>
                        <TouchableOpacity
                        onPress={()=> OnCurrencyAPI(amount)}
                        style={{borderRadius:4, height: R.fontSize.Size50, backgroundColor:R.colors.buttonColor, alignItems:'center', justifyContent:'center'}}
                        >
                            <Text style={{color:R.colors.white, fontSize:R.fontSize.XLarge, fontWeight:'800'}}>DEPOSIT</Text>
                        </TouchableOpacity>
                    </View> 
            </View>
        }
           </View>
        
            :
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <ActivityIndicator  size="large" color={R.colors.buttonColor}/>
            </View>  
        }   
        </StoryScreen>
    )
}

export default MyWallet