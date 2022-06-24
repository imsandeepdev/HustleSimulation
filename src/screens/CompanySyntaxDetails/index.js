import * as React from 'react';
import {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Text,ScrollView, ActivityIndicator } from 'react-native';
import {Header, StoryScreen} from '../../components'
import R from '../../res/R'
import { LineChart, Grid , YAxis} from 'react-native-svg-charts';
import {Config} from '../../config';
import {store} from '../../store';
import Styles from './styles';


const CompanySyntaxDetails = (props) => {

    const [companyDetails, setCompanyDetails] = useState()
    const [stockDetails, setStockDetails] = useState([])
    const [stockGraph, setStockGraph] = useState([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(true)
    const [selectedNews, setSelectedNews] = useState(true)

    useEffect(()=>{
        SymbolGraphDetails(props.route.params?.symbolname)
        NewsArticleAPI(props.route.params?.symbolname)
        NewsArticleWithSymbolDetails(props.route.params?.symbolname)
    },[props.navigation])
 
    const NewsArticleAPI = (text) => {
        setLoading(false)
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/newsArticle?company_name=${text}`)
        .then((res)=> res.json())
        .then(response => {
            console.log('Response JSON on Company News Article', response.data)
            setStockDetails(response?.data)
            setLoading(true)
        })
        .catch((err)=>{
            console.log('Error hai',err)
        })
    }

    const NewsArticleWithSymbolDetails = (text) => {
        setLoading(false)
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/newArticleMetaSymbol?company_name=${text}`)
        .then((res)=> res.json())
        .then(response => {
            console.log('Response JSON on Company Syntax Details', response.data)
            setCompanyDetails(response?.data)
            setLoading(true)
        })
        .catch((err)=>{
            console.log('Error ',err)
        })
    }

    const SymbolGraphDetails = (text) => {
        setLoading(false)
        fetch(`${Config.BASE_URL}HustelAppApi/public/api/searchCompanyDetailsWithGraph?company_name=${text}`)
        .then((res)=> res.json())
        .then(response => {
            setLoading(true)
            console.log('Response JSON on Company Graph details', response)
            setStockGraph(response?.data)
        })
        .catch((err)=>{
            console.log('Error ',err)
        })
    }



    return(
        <StoryScreen statusBarStyle= 'dark-content' >
            <Header
             leftSource={R.images.backButton}
            //  backAction={() => { props.navigation.goBack() }}

             backAction={() => { props.route.params?.fromScreen === 'Home' ? props.navigation.replace('HomeScreen') : props.navigation.goBack()}}
             title={`${props.route.params?.symbolname} Syntax Details`}
            />
            {
            loading 
            ?
            <View style={Styles.mainView}>
                {
                (props.route.params?.from != 'TradingScreen')
                &&
                <View style={Styles.firstCardMainView}>
                    {
                        stockGraph.map((item,index)=>{
                            return(
                                <TouchableOpacity 
                                onPress={()=>props.navigation.navigate('TradingScreen',{
                                    from: item.company_name
                                })}
                                style={Styles.firstcardView}
                                key={index}
                                >
                                    <View style={Styles.symbolLogoMainView}>
                                        <View style={Styles.symbolLogoView}>
                                            <Image  
                                            source={{uri: item?.company_logo}} 
                                            resizeMode={'contain'} 
                                            style={Styles.symbolImage}/>
                                        </View>
                                        <Text 
                                        style={Styles.SymbolText} 
                                        numberOfLines={1}>
                                            {item?.company_name}
                                        </Text>
                                    </View>

                                    <View style={Styles.graphView}>
                                        <LineChart
                                        style={Styles.lineChartStyle}
                                        data={item?.graph_values}
                                        svg={{ stroke:R.colors.white, strokeWidth:1.5 }}
                                        contentInset={{ top: R.fontSize.Size4, bottom: R.fontSize.Size4 }}               
                                        >
                                        <Grid/>
                                        </LineChart>
                                    </View>
                                    <View style={Styles.priceMainView}>
                                        <Text style={Styles.priceText} numberOfLines={1}>{`$ ${item?.last_trade}`}</Text>
                                        <View style={Styles.priceRatioView}>
                                            <Text style={[Styles.priceRatioText ,{ color:(item?.last_trade - item?.previous_close ) < 0 ? R.colors.red : R.colors.white, fontSize: R.fontSize.medium}]} numberOfLines={1}>
                                                { (item?.last_trade - item?.previous_close).toFixed(4) } 
                                            </Text>
                                            <Text style={[Styles.priceRatioText ,{ color:(item?.last_trade - item?.previous_close ) < 0 ? R.colors.red : R.colors.white, fontSize: R.fontSize.medium}]} numberOfLines={1}>
                                                {
                                                (`${(((item?.last_trade - item?.previous_close ) * 100) /item?.last_trade).toFixed(4)}`)
                                                } 
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }           
                </View>
                }

                <View style={Styles.aboutMainView}>
                    <TouchableOpacity 
                    onPress={()=> setSelected(!selected)}
                    style={Styles.aboutMainTouch}>
                        <Text style={{fontSize:R.fontSize.medium, color:R.colors.white, fontWeight:'700',flex:1}}>{`ABOUT ${companyDetails?.symbol}`}</Text>
                        <View style={Styles.updownImageView}>
                            <Image 
                            source={R.images.dropdown_icon} 
                            resizeMode={'contain'} 
                            style={[Styles.updownImage ,{transform: selected === true ? [{rotate:'180deg'}] : [{rotate:'0deg'}]}]}/>
                        </View>
                    </TouchableOpacity>
                    {
                    selected &&
                    <View style={Styles.aboutDetailView}>
                        <Text style={Styles.aboutCompanyNameText}>{companyDetails?.name}</Text>
                        <Text style={Styles.aboutTitleText}>CEO: <Text style={Styles.aboutValueText}>{companyDetails?.ceo}</Text></Text>
                        <Text style={Styles.aboutTitleText}>Industry: <Text style={Styles.aboutValueText}>{companyDetails?.sector}</Text></Text>
                        <Text style={Styles.aboutTitleText}>Market Capital: <Text style={Styles.aboutValueText}>{companyDetails?.marketcap}</Text></Text>
                        <Text style={Styles.aboutTitleText}>HQ Address: <Text style={Styles.aboutValueText}>{companyDetails?.hq_address}</Text></Text>
                        <Text style={Styles.aboutTitleText}>Description: <Text style={Styles.aboutValueText}>{companyDetails?.description}</Text></Text>
                    </View>
                    }
                </View>

                <View style={Styles.newsMainView}>
                    <TouchableOpacity 
                    onPress={()=> setSelectedNews(!selectedNews)}
                    style={Styles.aboutMainTouch}>
                        <Text style={Styles.newsArticleText}>{`NEWS / ARTICLE ON ${companyDetails?.symbol}`}</Text>
                        <View style={Styles.updownImageView}>
                            <Image 
                            source={R.images.dropdown_icon} 
                            resizeMode={'contain'} 
                            style={[Styles.updownImage ,{transform: selectedNews === true ? [{rotate:'180deg'}] : [{rotate:'0deg'}]}]}
                            />
                        </View>
                    </TouchableOpacity>
                    {
                    selectedNews 
                    &&
                    <ScrollView
                    contentContainerStyle={{flexGrow:1}}
                    style={{ paddingTop:R.fontSize.Size4}}
                    >
                    {
                        stockDetails.map((item, index) => {
                            return(
                                <TouchableOpacity 
                                onPress={()=> props.navigation.navigate('NewsWebView',{
                                    newsUrl: item?.article_url,
                                    publisherName: item?.publisher_name
                                })}
                                key={index}
                                style={Styles.NewsCardTouch}>
                                    <View style={Styles.newsImageView}>
                                        <Image 
                                        source={{uri: item?.image_url}} 
                                        resizeMode={'cover'} 
                                        style={Styles.newsImage} 
                                        />
                                        <View style={Styles.PublisherLogoView}>
                                            <Image source={{uri: item?.favicon_url}} 
                                            resizeMode={'contain'} 
                                            style={Styles.PublisherLogo}
                                            />
                                        </View>
                                    </View>
                                    <View style={{flex:1,padding:R.fontSize.Size4}}>
                                        <Text style={Styles.newsTitle} numberOfLines={3}>{item?.title}</Text>
                                        <Text style={Styles.publisherText} numberOfLines={1}>Publiser: <Text style={Styles.publisherTextValue}>{item?.publisher_name}</Text></Text>
                                        <Text style={Styles.publisherText} numberOfLines={1}>Author: <Text style={Styles.publisherTextValue}>{item?.author}</Text></Text>
                                        <Text style={Styles.publisherText} numberOfLines={1}>Publised Date: <Text style={Styles.publisherTextValue}>{`${item?.published_utc}`}</Text></Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                    </ScrollView>
                    }
                </View>
            </View>
            :
            <View style={Styles.ActivityView}>
                <ActivityIndicator size={'large'} color={R.colors.buttonColor} />
            </View>
            }


        </StoryScreen>
    )
}

export default CompanySyntaxDetails