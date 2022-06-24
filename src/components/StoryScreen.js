import * as React from 'react';
import {StyleSheet, SafeAreaView, StatusBar, 
KeyboardAvoidingView, Platform} from 'react-native';
import {
	showNavigationBar
} from 'react-native-navigation-bar-color';
import R from '../res/R';

const behavior = Platform.OS === 'ios' ? 'padding' : undefined 


const StoryScreen = (props) => {

    React.useEffect(() => {
		showNavigationBar()
	}, [])

    return(
        <React.Fragment>
            <StatusBar
                barStyle={props.statusBarStyle ?? R.colors.barStyle}
                backgroundColor={props.statusBarColor ?? R.colors.backgroundColor}
                translucent={false}
           />    
           <SafeAreaView style={[styles.statusBar, props.statusBarIosStyle]}/>
            <SafeAreaView style={styles.mainContainer}>
                <KeyboardAvoidingView style={styles.root} behavior={behavior} keyboardVerticalOffset={50}>
                    {props.children}
                </KeyboardAvoidingView>
            </SafeAreaView>
            <SafeAreaView  style={[styles.bottomBarIos, props.bottomBarIosStyle]} />
        </React.Fragment>
    )
}

const styles= StyleSheet.create({
    statusBar: {
        flex:0,
        backgroundColor: R.colors.backgroundColor
    },
    mainContainer: {
        flex:1,
        backgroundColor: R.colors.backgroundColor
    },
    root:{
        flex:1
    },
    bottomBarIos: {
        flex:0,
        backgroundColor:R.colors.backgroundColor
    }
})

export default StoryScreen;