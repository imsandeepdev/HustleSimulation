import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    View
} from 'react-native';
import R from '../res/R';

const behavior = Platform.OS === "ios" ? "padding" : undefined

const FullViewStoryScreen = (props) => {
    return (
        <React.Fragment>
            <StatusBar translucent={true} 
            backgroundColor={'transparent'} barStyle='dark-content' />
            <SafeAreaView style={styles.mainContainer}>
                <KeyboardAvoidingView style={styles.root} behavior={behavior} keyboardVerticalOffset={50}>
                    {props.children}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    root: {
        flex: 1
    },
})

export default FullViewStoryScreen;
