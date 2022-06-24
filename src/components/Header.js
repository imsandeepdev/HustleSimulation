
import * as React from 'react'
import { Pressable, View, StyleSheet, Text, Image } from 'react-native'
import R from '../res/R';

const Header = (props) => {
    return (
        <View style={styles.mainView}>
            <Pressable
                onPress={props.backAction}
                style={({ pressed }) => [{
                    width: R.fontSize.UltraXLarge,
                    opacity: pressed ? (props.activeOpacity ?? 0.5) : 1
                }]}
            >
                <Image source={props.leftSource} style={styles.backButton} resizeMode={'contain'}/>
            </Pressable>
            <Text style={{fontSize:R.fontSize.XXLarge, fontWeight:'bold',flex:1,textAlign:'center',alignItems:'center'}} numberOfLines={1}>{props.title}</Text>
            <Pressable 
            onPress={props.rightAction}
            style={({pressed}) => [{
                width:R.fontSize.UltraXLarge,
                opacity: pressed ? (props.activeOpacity ?? 0.5) : 1
                }]}>
                {
                    props.rightContent
                }
            </Pressable>
            {/* {
                props.rightContent
                
            } */}
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        marginHorizontal: R.fontSize.XLarge,
        height: R.fontSize.Size50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent:'center'
    },
    backButton: {
        height: R.fontSize.EXLarge,
        width:R.fontSize.EXLarge,
    },
})

export default Header