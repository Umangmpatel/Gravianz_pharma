// import {
//     Image,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import React, { useState } from 'react';
// import { colors } from '../utils/colors';
// import { secureTextOff, secureTextOn } from '../assets/icons';
// import { fonts } from '../constants/fonts';
// import fontSizes from '../constants/fontSizes';

// const CTTextInput = React.forwardRef(
//     (
//         {
//             value,
//             onChangeText,
//             placeholder,
//             secureText,
//             secureTextOption,
//             setSecureText,
//             containerStyle,
//             textInputStyle,
//             title,
//             errorMsg,
//             onSubmitEditing,
//             ...other
//         },
//         ref
//     ) => {
//         const [borderColor, setBorderColor] = useState(colors.textSecondary);

//         const onFocus = () => {
//             setBorderColor(colors.textPrimary);
//         };
//         const onBlur = () => {
//             setBorderColor(colors.textSecondary);
//         };

//         return (
//             <>
//                 {title && <Text style={styles.inputTitle}>{title}</Text>}
//                 <View
//                     style={[
//                         styles.containerStyle,
//                         {
//                             borderColor: errorMsg ? colors.error : borderColor,
//                             ...containerStyle,
//                         },
//                     ]}>
//                     <TextInput
//                         ref={ref} // Forward the ref to TextInput
//                         style={[styles.textInput, { ...textInputStyle }]}
//                         value={value}
//                         onChangeText={onChangeText}
//                         placeholder={placeholder}
//                         placeholderTextColor={colors.textSecondary}
//                         secureTextEntry={secureText}
//                         onFocus={onFocus}
//                         onBlur={onBlur}
//                         onSubmitEditing={onSubmitEditing}
//                         {...other}
//                     />
//                     {secureTextOption && (
//                         <TouchableOpacity
//                             style={{ padding: 10 }}
//                             onPress={() => setSecureText(!secureText)}>
//                             <Image
//                                 source={secureText ? secureTextOff : secureTextOn}
//                                 style={styles.secureIcon}
//                                 resizeMode="contain"
//                             />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//                 {errorMsg && <Text style={styles.errorStyle}>{errorMsg}</Text>}
//             </>
//         );
//     }
// );

// const styles = StyleSheet.create({
//     containerStyle: {
//         width: '100%',
//         paddingVertical: 15,
//         flexDirection: 'row',
//         backgroundColor: colors.white,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingHorizontal: 12,
//         borderRadius: 5,
//         marginTop: 7,
//         borderWidth: 1,
//         height: 55,
//     },
//     textInput: {
//         flex: 1,
//         paddingVertical: 0,
//         backgroundColor: 'transparent',
//         fontFamily: fonts.SoraSemiBold,
//         fontSize: fontSizes.f15,
//         color: colors.textSecondary,
//         height: 55,
//     },
//     secureIcon: { width: 20, height: 20 },
//     inputTitle: {
//         color: colors.textSecondary,
//         fontFamily: fonts.SoraRegular,
//         fontSize: fontSizes.f14,
//     },
//     errorStyle: {
//         color: colors.error,
//         fontFamily: fonts.SoraRegular,
//         fontSize: fontSizes.f12,
//         marginTop: 3,
//     },
// });

// export default CTTextInput;
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { colors } from '../utils/colors';
import { secureTextOff, secureTextOn } from '../assets/icons';
import { fonts } from '../constants/fonts';
import fontSizes from '../constants/fontSizes';
import DeviceInfo from 'react-native-device-info';

  const isTablet = DeviceInfo.isTablet();
const CTTextInput = React.forwardRef(
    (
        {
            value,
            onChangeText,
            placeholder,
            secureText,
            secureTextOption,
            setSecureText,
            containerStyle,
            textInputStyle,
            title,
            errorMsg,
            maxLength,
            onSubmitEditing,
            returnKeyType = 'next', // Default to 'next'
            ...other
        },
        ref
    ) => {
        const [borderColor, setBorderColor] = useState(colors.textSecondary);

        const onFocus = () => {
            setBorderColor(colors.textPrimary);
        };
        const onBlur = () => {
            setBorderColor(colors.textSecondary);
        };

        return (
            <>
                {title && <Text style={styles.inputTitle}>{title}</Text>}
                <View
                    style={[
                        styles.containerStyle,
                        {
                            borderColor: errorMsg ? colors.error : borderColor,
                            ...containerStyle,
                        },
                    ]}>
                    <TextInput
                        ref={ref}
                        style={[styles.textInput, { ...textInputStyle }]}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor={colors.textSecondary}
                        secureTextEntry={secureText}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onSubmitEditing={onSubmitEditing}
                        returnKeyType={returnKeyType} // Pass returnKeyType
                        maxLength={maxLength}
                        {...other}
                    />
                    {secureTextOption && (
                        <TouchableOpacity
                            style={{ padding: 10 }}
                            onPress={() => setSecureText(!secureText)}>
                            <Image
                                source={secureText ? secureTextOff : secureTextOn}
                                style={styles.secureIcon}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    )}
                </View>
                {errorMsg && <Text style={styles.errorStyle}>{errorMsg}</Text>}
            </>
        );
    }
);

const styles = StyleSheet.create({
    containerStyle: {
        width: '100%',
        paddingVertical: 15,
        flexDirection: 'row',
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        borderRadius: 5,
        marginTop: 7,
        borderWidth: 1,
        height:isTablet ?100: 55,
    },
    textInput: {
        flex: 1,
        paddingVertical: 0,
        backgroundColor: 'transparent',
        fontFamily: fonts.SoraSemiBold,
        fontSize: fontSizes.f15,
        color: colors.textSecondary,
        height:isTablet?100: 55,
    },
    secureIcon: { width: 20, height: 20 },
    inputTitle: {
        color: colors.textSecondary,
        fontFamily: fonts.SoraRegular,
        fontSize: fontSizes.f14,
    },
    errorStyle: {
        color: colors.error,
        fontFamily: fonts.SoraRegular,
        fontSize: fontSizes.f12,
        marginTop: 3,
    },
});

export default CTTextInput;