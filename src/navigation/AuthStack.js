import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/AuthFlow/LoginScreen';
import SignupScreen from '../screens/AuthFlow/SignupScreen';
import OtpScreen from '../screens/AuthFlow/OtpScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    const navOptions = { headerShown: false };

    return (
        // <NavigationContainer>
        <Stack.Navigator
            initialRouteName="LoginScreen"
            screenOptions={{ gestureEnabled: true }}>
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={navOptions}
            />
            <Stack.Screen
                name="SignupScreen"
                component={SignupScreen}
                options={navOptions}
            />
            <Stack.Screen
                name="OtpScreen"
                component={OtpScreen}
                options={navOptions}
            />
        </Stack.Navigator>
        // </NavigationContainer>
    );
};

export default AuthStack;

const styles = StyleSheet.create({});
