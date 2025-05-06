import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { fonts } from '../constants/fonts';
import { colors } from '../utils/colors';
import fontSizes from '../constants/fontSizes';

const CTTitleComponent = ({ title, ...other }) => {
    return <Text style={styles.textStyle}   {...other}>{title}</Text>;
};

export default CTTitleComponent;

const styles = StyleSheet.create({
    textStyle: {
        fontFamily: fonts.SoraBold,
        color: colors.textSecondary,
        fontSize: fontSizes.f35,
    },
});
