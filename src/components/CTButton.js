import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../utils/colors';
import { fonts } from '../constants/fonts';
import fontSizes from '../constants/fontSizes';

const CTButton = ({ containerStyle, title, onPress, buttonStyle, disabled }) => {
    return (
        <View style= { [styles.shadowContainer, containerStyle]} >
        <TouchableOpacity
        onPress={ onPress }
    activeOpacity = { 0.8}
    disabled = {!!disabled
}
      >
    <View style={ [styles.button, buttonStyle] }>
        <Text style={ styles.buttonText }> { title } </Text>
            </View>
            </TouchableOpacity>
            </View>
  );
};

export default CTButton;

const styles = StyleSheet.create({
    shadowContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 6,
        backgroundColor: colors.secondary,
    },
    buttonText: {
        fontFamily: fonts.SoraSemiBold,
        color: colors.background,
        fontSize: fontSizes.f18,
        alignSelf: 'center',
    },
});
