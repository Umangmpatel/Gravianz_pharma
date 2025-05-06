import {Alert, Linking} from 'react-native';
import {dispatchRef} from './navigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkValidEmail = email => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

let isPopUpVisiable = true;
export const tokenExpire = data => {
  if (!isPopUpVisiable) {
    return null;
  }
  isPopUpVisiable = false;
  dispatchRef.current(rootLoader(false));
  Alert.alert('Alert', data.message, [
    {
      text: 'Support',
      onPress: async () => {
        isPopUpVisiable = true;
        console.log('token Expire data ==> ', data.data);
        await AsyncStorage.clear();
        dispatchRef.current({type: RESET_USER_REDUCER, payload: null});
        dispatchRef.current({type: RESET_SUBSCRIPTION, payload: null});
        if (data.data) {
          Linking.openURL(data.data);
        }
      },
    },
    {
      text: 'Yes',
      onPress: async () => {
        isPopUpVisiable = true;
        await AsyncStorage.clear();
        dispatchRef.current({type: RESET_USER_REDUCER, payload: null});
        dispatchRef.current({type: RESET_SUBSCRIPTION, payload: null});
      },
    },
    // { text: "No", style: "cancel" }
  ]);
};
