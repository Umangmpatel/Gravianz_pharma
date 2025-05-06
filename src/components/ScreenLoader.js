import React from 'react';
import { View, Text,  ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../utils/colors';
import { screenHeight } from '../utils/constant';

export function CTNativeLoader({
    title,
    visible = false,
    bgTransparency = 0.5,
    aiSize = 'small',
    titleStyle,
    containerStyle,
}) {
    return (
        <Modal
            animationIn="fadeIn"
            animationOut="fadeOut"
            useNativeDriver
            isVisible={visible}
            onBackButtonPress={false}
            style={{ margin: 0 }}
            backdropOpacity={bgTransparency}
            deviceHeight={screenHeight}
            statusBarTranslucent
            coverScreen={false}>
            <View
                style={{
                    // backgroundColor: `rgba(0,0,0,${bgTransparency})`,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...containerStyle,
                }}>
                <View
                    style={{
                        // backgroundColor: colors.lineColor,
                        padding: 15,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator size={aiSize} color={colors.white} />
                    {title && (
                        <Text
                            style={{ paddingLeft: 8, color: colors.lineColor, ...titleStyle }}>
                            {title}
                        </Text>
                    )}
                </View>
            </View>
        </Modal>
    );
}
