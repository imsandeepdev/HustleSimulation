
import * as React from 'react'
import {PixelRatio, Dimensions} from 'react-native'

const {width, height} = Dimensions.get('window')
const scale = width/414

export function normalize(size) {
    const newSize = size * scale
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
}

const fontSize ={
    Size2: normalize(2),
    Size4: normalize(4),
    Size5: normalize(5),
    Size6: normalize(6),
    Size8: normalize(8),
    extraSmall: normalize(10),
    small: normalize(12),
    medium: normalize(14),
    large: normalize(16),
    XLarge: normalize(18),
    XXLarge: normalize(20),
    XXXLarge: normalize(22),
    EXLarge: normalize(24),
    EXXLarge: normalize(26),
    EXXXLarge: normalize(28),
    UltraXLarge: normalize(30),
    Size35: normalize(35),

    Size40: normalize(40),
    Size42: normalize(42),

    Size45: normalize(45),
    Size50: normalize(50),
    Size60: normalize(60),
    Size70: normalize(70),
    Size80: normalize(80),
    Size90: normalize(90),
    Size110: normalize(110),
    Size100: normalize(100),
    Size120: normalize(120),
    Size130: normalize(130),

    Size150: normalize(150),
    Size160: normalize(160),
    Size170: normalize(170),
    Size180: normalize(180),

    Size200: normalize(200),
    Size300: normalize(300),

}

export default fontSize