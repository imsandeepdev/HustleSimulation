
import React from 'react';
import { Pressable, View, StyleSheet, Text } from 'react-native';
import R from '../res/R';


const Button = (props) => {
    return (
        <Pressable
            onPress={props.onPress}
            style={({ pressed }) => [{
                marginTop: props.marginTop,
                marginBottom: props.marginBottom,
                width: props.width ?? '100%',
                opacity: pressed ? (props.activeOpacity ?? 0.5) : 1
            }]}
        >
            <View style={[styles.buttonView, {
                backgroundColor:props.backgroundColor,
                height: props.height, marginHorizontal: props.marginHorizontal
            }]}>
                <Text style={{ fontWeight: '800', color:props.buttonTextColor, fontSize:R.fontSize.XLarge, textAlign:'center' }}>
                    {props.title}
                </Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonView: {
        borderColor: R.colors.buttonBorderColor,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    textStyle: {
        color: R.colors.buttonTextColor,
        fontSize: 16
    }
})
export default Button