import {
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenHeight } from '../utils/constant';
import { colors } from '../utils/colors';
const AuthContainer = ({ children }) => {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={[styles.container, { paddingBottom: insets.bottom }]}>
            <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
            <SafeAreaView style={{ backgroundColor: colors.secondary }} />

            <KeyboardAvoidingView
                style={[styles.container]}
                contentContainerStyle={{ height: screenHeight }}
                behavior={Platform.OS === 'ios' ? 'padding' : ''}
            // keyboardVerticalOffset={200}
            >
                <ScrollView
                    contentContainerStyle={[styles.scrollContainer]}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    keyboardShouldPersistTaps="handled"
                    bounces={false}>
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
            {/* <KeyboardAwareScrollView
                style={styles.container}
                enableResetScrollToCoords={true}
                enableAutomaticScroll={true}
                enableOnAndroid={true}
                bounces={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {children}
            </KeyboardAwareScrollView> */}
            {/* <SafeAreaView /> */}
        </View>
    );
};

export default AuthContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
        flexGrow: 1,
    },
    scrollContainer: { flexGrow: 1 },
});
