import * as React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Platform} from 'react-native';
import R from '../res/R';

const CustomTextInput = React.forwardRef((props,ref) => {

const Android = Platform.OS==='android'
    return(
        <View style={{marginVertical:5, marginHorizontal: props.marginHorizontal, marginTop: props.marginTop ?? 10, height:40}}>
           <Text style={{color:R.colors.black, fontSize:15, fontWeight:'400', position:Platform.OS==='android' ? 'absolute':'relative', bottom: Platform.OS==='android' ? 30 : 0, left: Platform.OS==='android' ? 4 : 0}}>{props.Texttitle}</Text>
           <View style={{flexDirection:'row',alignItems:'center'}}>
                <TextInput
                    ref={ref}
                    style={{ fontSize:15, fontWeight:'500', color:R.colors.textinputTextColor, flex:1}}
                    value={props.value}
                    onChangeText={props.onChangeText}
                    placeholderTextColor={R.colors.placeholderTextColor}
                    placeholder={props.placeholder}
                    secureTextEntry={props.secureTextEntry}
                    keyboardType={props.keyboardType ?? 'default'}
                    maxLength={props.maxLength}
				    onSubmitEditing={props.onSubmitEditing}
                    editable={props.editable}
                    returnKeyType={props.returnKeyType}
                    autoFocus={props.autoFocus}
                />
                <TouchableOpacity
                onPress={props.rightonPress}
                style={{marginHorizontal:10,alignItems:'center',justifyContent:'center'}}
                >
                <Image source={props.rightSource} resizeMode={'contain'} style={{height:20, width:25}}/>
                </TouchableOpacity>
            </View>
            <View  style={{borderBottomWidth:1,borderBottomColor:R.colors.placeholderTextColor, bottom: Platform.OS==='android' ? 5 : 0}} />
        </View>
    )
})

export default CustomTextInput;