import * as React from 'react';
import {useState, useEffect} from 'react';
import {View, Text, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import R from '../../res/R';
import {BorderButton, StoryScreen,Button, Header} from '../../components';
import Styles from './styles';
import {useDispatch, connect} from 'react-redux';
import {currencyTypeRequest} from '../../actions/currencytype.actions';
import Toast from 'react-native-simple-toast';
import { store } from '../../store';
import { Config } from '../../config';



const CurrencyTypeScreen = (props) => {

    const dispacth = useDispatch();
    const [selectCurrency, setSelectCurrency] = useState();
    const [currencyList, setCurrencyList] = useState([]);
    const [loading, setLoading] = useState(false)

const CurrencyListAPI= `${Config.BASE_URL}HustelAppApi/public/api/user/currenciesList`;
const CurrencyTypeAPI= `${Config.BASE_URL}HustelAppApi/public/api/user/chooseCurrencyType`;

const {auth:{authToken}} = store.getState();

const headerForAuth = {
    'Accept': "application/json",
    'Authorization' : `Bearer ${authToken}`,
};

    
React.useEffect(()=>{
    fetch(CurrencyListAPI,{
        method:'GET',
        headers: headerForAuth
    })
    .then(response => response.json())
    .then(responseJson => {
        if(responseJson.status === true)
        {
            setLoading(true)
            console.log('Currency List ', responseJson.currencies),
            setCurrencyList(responseJson.currencies),
            console.log('Currency List Data ', currencyList)
        }
    })
    .catch((error)=>{
        console.log('Catch Error Message in API Services',error.message);
    }) 
},[props.navigation])



const OnSelectCurrency = () => {
   
    let formData = new FormData();
    formData.append('currency_type',selectCurrency);

    fetch(CurrencyTypeAPI,{
        method:'POST',
        headers: headerForAuth,
        body: formData
    })
    .then(response => response.json())
    .then(responseJson => {
        if(responseJson.status === true)
        {
            console.log('Currency Type List ', responseJson),
             props.navigation.replace('HomeScreen'),
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
        <StoryScreen statusBarStyle= "dark-content">
            <Header
                leftSource={R.images.backButton}
                backAction={()=> props.navigation.goBack()}
                title={'Choose Currency'}
            />
            {
            loading ? 
            <View style={Styles.mainView}>         
                    <View style={Styles.topTextView}>
                        <Text style={Styles.chooseText}>Choose your</Text>
                        <Text style={Styles.currencyTypeText}>Currency Type</Text>
                    </View>
                    <View>
                    {
                    currencyList.map((item, index)=>{
                        return(
                            <TouchableOpacity
                            key={index}
                            onPress={()=> setSelectCurrency(item?.id)}
                            style={{borderWidth:1,borderRadius:4, height:R.fontSize.Size45,alignItem:'center', justifyContent:'center', borderColor: R.colors.buttonBorderColor, marginBottom:R.fontSize.extraSmall, flexDirection:'row'}}
                            >
                                 <View  style={{height:R.fontSize.XXLarge,width:R.fontSize.XXLarge,borderRadius:R.fontSize.medium, backgroundColor: item?.id === 1 ? R.colors.USDColor : item?.id === 2 ? R.colors.CADColor : R.colors.EURColor , alignSelf:'center', marginHorizontal:R.fontSize.extraSmall}} />
                                 <Text style={{textAlign:'center', fontSize:R.fontSize.XLarge, fontWeight:selectCurrency=== (item.id)? '800':'normal', alignSelf:'center'}}>{item?.currency_name}</Text>
                            </TouchableOpacity>                   
                        )
                    })}  
                        <Button
                            onPress={OnSelectCurrency}
                            marginTop={R.fontSize.UltraXLarge}
                            title={'CONFIRM'}
                            backgroundColor={R.colors.primaryColor}
                            height={R.fontSize.Size50}
                            buttonTextColor={R.colors.white}
                        />
                        <View style={Styles.belowView}>
                            <Text style={Styles.belowText1}>There are only USD currency that you can 
                            <Text style={Styles.belowText2}> Trade.</Text> </Text>
                        </View>    
                    </View>
            </View>
            :
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <ActivityIndicator  size="large" color={R.colors.buttonColor}/>
            </View>    
           }
        </StoryScreen>
    )
}

const mapStateToProps = (state, props) => ({
    loading: state.currencyType.loading,
    currencyData: state.currencyType.currencyData,
})

export default connect(mapStateToProps)(CurrencyTypeScreen);


