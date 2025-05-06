import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { StackActions } from '@react-navigation/native';
import Api from '../utils/Api';

const SplashView = ({ navigation }) => {
    const dispatch = useDispatch();
    const { userInfo, userToken } = useSelector(state => state.auth);

    useEffect(() => {
        const checkUserDetails = async () => {
            if (userInfo) {
                const request = {
                    Authorization: `Bearer ${userToken}`,
                };
                console.log('Common Header :', JSON.stringify(request));
                Api.defaultHeader(request);
                await navigation.dispatch(StackActions.replace('DashboardStack'));
                setTimeout(() => {
                    SplashScreen.hide();
                }, 1000);
            } else {
                navigation.dispatch(StackActions.replace('AuthStack'));
                setTimeout(() => {
                    SplashScreen.hide();
                }, 1000);
            }
        };

        checkUserDetails();
    }, []);

    return <></>;

    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //   <TouchableOpacity
    //     onPress={() => {
    //       console.log('---');
    //       showMessage({
    //         message: 'Simple message',
    //         type: 'success',
    //       });
    //       dispatch({type: 'USER_LOGIN_DETAILS', payload: 'data'});
    //     }}>
    //     <Text>{userInfo ? userInfo : 'hhh'}</Text>
    //   </TouchableOpacity>
    // </View>
};

export default SplashView;

const styles = StyleSheet.create({});
