import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import MainStack from './src/navigation/MainStack';
import {Provider} from 'react-redux';
import {ToastProvider} from 'react-native-toast-notifications';
import {PersistGate} from 'redux-persist/integration/react';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {colors} from './src/utils/colors';
import SettingProvider from './src/utils/SettingProvider';
import configureStore from './src/redux/store';
import CTToast from './src/components/CTToast';
import { errorIcon, success } from './src/assets/icons';
const {store, persistor} = configureStore();

const App = () => {
  const {width} = Dimensions.get('window');

  const toastConfig = {
    error: ({text1, text2, props}) => (
      <CTToast
        toastBg={colors.white}
        toastIcon={errorIcon}
        toastTintBg={colors.errorColor}
        text1={text1}
      />
    ),
    info: ({text1, text2, props}) => (
      <CTToast
        toastBg={colors.white}
        toastIcon={errorIcon}
        toastTintBg={colors.lightBlue}
        text1={text1}
      />
    ),
    success: ({text1, text2, props}) => (
      <CTToast
        toastBg={colors.white}
        toastIcon={success}
        toastTintBg={colors.successColor}
        text1={text1}
      />
    ),
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SettingProvider>
          <MainStack />
          <Toast config={toastConfig} />
        </SettingProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
