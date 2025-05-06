import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { fonts } from '../constants/fonts';
import { colors } from '../utils/colors';
import fontSizes from '../constants/fontSizes';

const CTToast = ({ toastBg, toastTintBg, toastIcon, text1 }) => {
    return (
        <View style={styles.mainContainer}>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: toastBg,
                    },
                ]}>
                <View>
                    <Image
                        source={toastIcon}
                        resizeMode="contain"
                        style={styles.imgStyle}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.textStyle]}>{text1}</Text>
                    <View style={{ height: 2 }}></View>
                </View>
            </View>
            <View style={[styles.bttomBg, { backgroundColor: toastTintBg }]}></View>
        </View>
    );
};

export default CTToast;

const styles = StyleSheet.create({
    mainContainer: {
        width: '86%',
        alignSelf: 'center',
    },
    container: {
        paddingVertical: 15,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    imgStyle: {
        height: 20,
        width: 20,
        marginHorizontal: 8,
    },
    textStyle: {
        fontFamily: fonts.SoraRegular,
        color: colors.textSecondary,
        fontSize: fontSizes.f12,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 10,
    },
    bttomBg: {
        height: 5,
    },
});
