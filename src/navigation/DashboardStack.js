import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeBottomStack from "./HomeBottomStack";
import AddCustomerScreen from "../screens/Dashboard/AddCustomerScreen";
import AddchemistScreen from "../screens/Dashboard/AddchemistScreen";
import CustomerScreen from "../screens/Dashboard/CustomerScreen";
import CategoryList from "../screens/Dashboard/CategoryList";
import ProductList from "../screens/Dashboard/ProductList";
import FileDcrScreen from "../screens/Dashboard/FileDcrScreen";
import HelperList from "../screens/Dashboard/HelperListScreen";
import MrListScreen from "../screens/Dashboard/MrListScreen";
import ActivityList from "../screens/Dashboard/ActivityList";

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
    const navOptions = { headerShown: false };

    return (
        // <NavigationContainer>
        <Stack.Navigator
            initialRouteName="HomeBottomStack"
            screenOptions={{ gestureEnabled: true }}
        >
            <Stack.Screen
                name="HomeBottomStack"
                component={HomeBottomStack}
                options={navOptions}
            />
            <Stack.Screen
                name="AddCustomerScreen"
                component={AddCustomerScreen}
                options={navOptions}
            />
            <Stack.Screen
                name="CustomerScreen"
                component={CustomerScreen}
                options={navOptions}
            />
            <Stack.Screen
                name="AddchemistScreen"
                component={AddchemistScreen}
                options={navOptions}
            />
            <Stack.Screen
                name="CategoryList"
                component={CategoryList}
                options={navOptions}
            />
            <Stack.Screen
                name="ProductList"
                component={ProductList}
                options={navOptions}
            />
            <Stack.Screen
                name="FileDcrScreen"
                component={FileDcrScreen}
                options={navOptions}
            />
            <Stack.Screen
                name="HelperList"
                component={HelperList}
                options={navOptions}
            />
            <Stack.Screen
                name="MrListScreen"
                component={MrListScreen}
                options={navOptions}
            />
            <Stack.Screen
                name="ActivityList"
                component={ActivityList}
                options={navOptions}
            />
        </Stack.Navigator>
        // </NavigationContainer>
    );
};

export default DashboardStack;

const styles = StyleSheet.create({});
