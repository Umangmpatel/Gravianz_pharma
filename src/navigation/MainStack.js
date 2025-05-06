import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardStack from './DashboardStack';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchRef } from '../utils/navigationService';
import AuthStack from './AuthStack';
import HomeBottomStack from './HomeBottomStack';

const Stack = createNativeStackNavigator();

const MainStack = () => {
    const navOptions = { headerShown: false };
    const { userInfo } = useSelector(state => state.auth);
    dispatchRef.current = useDispatch();
    console.log("userInfo", userInfo);
    
    const initialRoute = userInfo ? 'DashboardStack' : 'AuthStack';
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{ gestureEnabled: true }}>
                <Stack.Screen
                    name="AuthStack"
                    component={AuthStack}
                    options={navOptions}
                />
                <Stack.Screen
                    name="DashboardStack"
                    component={DashboardStack}
                    options={navOptions}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MainStack;

const styles = StyleSheet.create({});
