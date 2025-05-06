import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {fonts} from '../constants/fonts';
import {colors} from '../utils/colors';
import CTSpacer from './CTSpacer';
import fontSizes from '../constants/fontSizes';

const CTInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  height = 60,
  placeholderTextColor = '#796E7B7A',
  txtverical = 'center',
  multiline = false,
  ...other
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.labelText}>{label}</Text>}
      <CTSpacer height={7} />
      <TextInput
        style={[
          styles.textInput,
          {
            height,
            textAlignVertical: txtverical,
            borderColor: isFocused ? colors.app_theme : colors.borderColor,
            borderWidth: isFocused ? 1 : 0,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        multiline={multiline}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...other}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  labelText: {
    color: colors.gray,
    fontFamily: fonts.SoraRegular,
    fontSize: fontSizes.f14,
  },
  textInput: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 10,
    paddingTop: 10,
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontSizes.f15,
    color: colors.textColor,
    borderWidth: 1,
  },
});

export default CTInput;
