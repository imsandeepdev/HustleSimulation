import * as React from 'react';
import {useState, useEffect} from 'react';
import {Image} from 'react-native';
import R from '../res/R';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CurrencyTypeScreen from '../screens/CurrencyTypeScreen';
import UpdatePasswordScreen from '../screens/UpdatePasswordScreen';
import ForgotPassword from '../screens/ForgotPassword';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import PortFolioScreen from '../screens/PortFolioScreen';
import SearchScreen from '../screens/SearchScreen';
import Splash from '../screens/Splash';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MenuHomeScreen from '../screens/MenuHomeScreen';
import Profile from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import TradingScreen from '../screens/TradingScreen';
import PreviewScreen from '../screens/PreviewScreen';
import MyWallet from '../screens/MyWallet';
import CompanyScreen from '../screens/CompanyScreen';
import MyWatchList from '../screens/MyWatchList';
import TradeHistory from '../screens/TradeHistory';
import BuySalePreview from '../screens/BuySalePreview';
import {connect, useDispatch} from 'react-redux';
import PendingPosition from '../screens/PendingPosition';
import CompanySyntaxDetails from '../screens/CompanySyntaxDetails';
import NewsWebView from '../screens/NewsWebView';
import MarketStatusScreen from '../screens/MarketStatusScreen';
import AboutUs from '../screens/AboutUs';
import MyAchievements from '../screens/MyAchievements';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AppNavigator = (props) => {

const [loading, setLoading] = useState(true)
const [initialRoute, setInitialRoute] = useState("WelcomeScreen")

useEffect(() => {
    
    if(props.authToken)
    {
        setInitialRoute('HomeScreen')
    }
    else{
        setInitialRoute('WelcomeScreen')

    }
    setLoading(false)
},[])

if (loading) {
    return <Splash  />;
}
    return(
        <NavigationContainer
        linking={props.linking}
        >

            <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{gestureEnabled: false}}>
            
                <Stack.Screen
                    name="SplashScreen"
                    component={Splash}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="WelcomeScreen"
                    component={WelcomeScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="SignupScreen"
                    component={SignupScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="UpdatePasswordScreen"
                    component={UpdatePasswordScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="HomeScreen"
                    component={MenuHome}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="CurrencyTypeScreen"
                    component={CurrencyTypeScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="ProfileScreen"
                    component={Profile}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="EditProfileScreen"
                    component={EditProfileScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Portfolio"
                    component={PortFolioScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="TradingScreen"
                    component={TradingScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="PreviewScreen"
                    component={PreviewScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="MyWallet"
                    component={MyWallet}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="CompanyScreen"
                    component={CompanyScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="MyWatchList"
                    component={MyWatchList}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="TradeHistory"
                    component={TradeHistory}
                    options={{headerShown: false}}
                />

                <Stack.Screen
                    name="BuySalePreview"
                    component={BuySalePreview}
                    options={{headerShown: false}}
                />

                <Stack.Screen
                    name="PendingPosition"
                    component={PendingPosition}
                    options={{headerShown: false}}
                />

                <Stack.Screen
                    name="CompanySyntaxDetails"
                    component={CompanySyntaxDetails}
                    options={{headerShown: false}}
                />

                <Stack.Screen
                    name="NewsWebView"
                    component={NewsWebView}
                    options={{headerShown: false}}
                />

                <Stack.Screen
                    name="MarketStatusScreen"
                    component={MarketStatusScreen}
                    options={{headerShown: false}}
                />

                <Stack.Screen
                    name="AboutUs"
                    component={AboutUs}
                    options={{headerShown: false}}
                />

                <Stack.Screen
                    name="MyAchievements"
                    component={MyAchievements}
                    options={{headerShown: false}}
                />

                
            </Stack.Navigator>
        </NavigationContainer>
    )
}

function MenuHome({route}){
    return(
        <Drawer.Navigator
        drawerContent={props => <MenuHomeScreen {...props}/>}
        initialRouteName="Home"
        >
            <Drawer.Screen name="Dashboard" component={MyTabs} options={{headerShown: false}}/>
        </Drawer.Navigator>
    )
}

const MyTabs = (props) =>{
    return(
        <Tab.Navigator
        screenOptions={screenOptionIcon}
        // tabBarOptions = {tabBarOptionTitle}
        >
            <Tab.Screen name="Home" component={HomeScreen} options = {{headerShown: false}}/>
            <Tab.Screen name="Portfolio" component={PortFolioScreen} options = {{headerShown: false}}/>
            <Tab.Screen name="Search" component={SearchScreen} options = {{headerShown: false}}/>
        </Tab.Navigator>
    )
}

const screenOptionIcon = ({route}) => ({
    tabBarActiveTintColor: R.colors.activeBottomTabColor,
    tabBarInactiveTintColor:R.colors.inactiveBottomTabColor,
    tabBarIcon: ({focused, color, size}) => {
        switch (route.name){
            case "Home":
                return(
                    <Image
                    source={
                        focused
                        ? R.images.active_Home
                        : R.images.Inactive_Home
                    }
                    style={{height:28, width:28}}
                    />
                );
            break;
            case "Portfolio":
                return(
                    <Image
                    source={
                        focused
                        ? R.images.active_Portfolio
                        : R.images.Inactive_Portfolio
                    }
                    style={{height:28, width:28}}
                    />
                );
            break;
            case "Search":
                return(
                    <Image
                    source={
                        focused
                        ? R.images.active_Search
                        : R.images.Inactive_Search
                    }
                    style={{height:28, width:28}}
                    />
                );
            break;
        }
    }

})

// const tabBarOptionTitle = {
//     activeTintColor: R.colors.activeBottomTabColor,
//     inactiveTintColor: R.colors.inactiveBottomTabColor,
// }

const mapStateToProps = ({auth}) => ({
    loggedIn: auth.loggedIn,
    authToken: auth.authToken
})

export default connect(mapStateToProps) (AppNavigator);