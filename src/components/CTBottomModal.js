import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../utils/colors';
import { fonts } from '../constants/fonts';
import fontSizes from '../constants/fontSizes';
import CTSpacer from './CTSpacer';
import DeviceInfo from 'react-native-device-info';

const CTBottomModal = ({ isVisible, setIsVisible, onYesPress, title }) => {
    const isTablet = DeviceInfo.isTablet();
     const {height} = Dimensions.get('window')
    const sheetHeight = isTablet ? height * 0.3-100 : height * 0.4-100;
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => {
                setIsVisible(false);
            }}
            style={styles.modal}
            swipeDirection="down"
            onDismiss={() => setIsVisible(false)}
            onBackButtonPress={() => setIsVisible(false)}
            statusBarTranslucent
            animationInTiming={300}
            animationOutTiming={300}
            useNativeDriver={true}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating
            onSwipeComplete={() => {
                setIsVisible(false);
            }}>
            <View style={{
                backgroundColor: colors.white,
                borderTopLeftRadius: 28,
                paddingHorizontal: 20,
                borderTopRightRadius: 28,
                alignItems: 'center',
                height: sheetHeight          }}>
                <View style={styles.lineContainer} />

                <CTSpacer height={10} />
                <Text style={styles.titleStyle}>{title}</Text>

                <CTSpacer height={30} />

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            setIsVisible(false);
                        }}
                        style={styles.btnMainStyle}>
                        <Text style={styles.cancelStyle}>Cancel</Text>
                    </TouchableOpacity>
                    <View style={{ width: 20 }} />

                    <TouchableOpacity
                        onPress={onYesPress}
                        style={[styles.btnMainStyle, { backgroundColor: colors.secondary }]}>
                        <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                </View>

                <CTSpacer height={25} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        justifyContent: 'flex-end', // Aligns modal to the bottom
        margin: 0, // Removes default margins
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 28,
        paddingHorizontal: 20,
        borderTopRightRadius: 28,
        alignItems: 'center',
    },
    lineContainer: {
        height: 4,
        width: 32,
        backgroundColor: colors.textSecondary,
        borderRadius: 100,
        marginVertical: 15,
    },
    titleStyle: {
        fontFamily: fonts.SoraSemiBold,
        fontSize: fontSizes.f20,
        color: colors.black_31,
        alignSelf: 'center',
        textAlign: 'center',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    btnMainStyle: {
        flex: 1,
        backgroundColor: '#FFE1E1',
        // height: 60,
        paddingVertical: 11,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelStyle: {
        fontFamily: fonts.SoraSemiBold,
        fontSize: fontSizes.f18,
        color: colors.red,
    },
    buttonText: {
        fontFamily: fonts.SoraSemiBold,
        color: colors.white,
        fontSize: fontSizes.f18,
        alignSelf: 'center',
    },
});

export default CTBottomModal;
