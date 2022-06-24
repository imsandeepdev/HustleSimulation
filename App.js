/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Provider } from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import AppNavigator from './src/navigator/AppNavigator';
import SignupScreen from './src/screens/SignupScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { store, persistor } from './src/store';



const App = () => {
  
  return (
    <Provider store={store}>
  		<PersistGate persistor={persistor}>
         <AppNavigator/>
      </PersistGate>
    </Provider>
  );
};


export default App;
