import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { colors } from '../../utils/colors';
import { fonts } from '../../constants/fonts';
import fontSizes from '../../constants/fontSizes';
import CTButton from '../../components/CTButton';
import { checkValidEmail } from '../../utils/Functions';
import { StackActions } from '@react-navigation/native';
import CTSpacer from '../../components/CTSpacer';
import AuthContainer from '../../components/AuthContainer';
import CTTextInput from '../../components/CTTextInput';
import CTTitleComponent from '../../components/CTTitleComponent';
import { AlertDialog, SuccessDialog } from '../../components/ToastMessage';
import { rootLoader, userLogin } from '../../actions';
import { useDispatch } from 'react-redux';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [secureText, setSecureText] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [buttonDisable, setButtonDisable] = useState(false);
  const txt1 = useRef();
  const txt2 = useRef();

  const checkValidation = () => {
    if (email === '') {
      AlertDialog('Please enter your email address.');
      setEmailErrorMsg('Please enter valid email');
      return false;
    } else if (!checkValidEmail(email)) {
      AlertDialog('Please enter a valid email address.');
      setEmailErrorMsg('Please enter valid email');
      return false;
    } else if (password === '') {
      AlertDialog('Please enter your password. ');
      setPasswordErrorMsg('Please enter valid password');
      return false;
    } else if (password.length < 6) {
      AlertDialog('Password must be at least 6 characters.');
      setPasswordErrorMsg('Please enter valid password');
      return false;
    } else {
      return true;
    }
  };

  const onLoginPress = async () => {
    Keyboard.dismiss();
    const isValid = checkValidation();
    if (isValid) {
      setButtonDisable(true);
      try {
        let data = {
          email: email,
          password: password,
        };
        dispatch(rootLoader(true));
        const hResult = await dispatch(userLogin(data));
        if (hResult.status) {
          SuccessDialog(hResult.message);
          navigation.dispatch(StackActions.replace('DashboardStack'));
        } else {
          AlertDialog(hResult.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(rootLoader(false));
        setButtonDisable(false);
      }
    }
  };

  return (
    <AuthContainer>
      <View style={styles.containerStyle}>
        <SafeAreaView />
        <View style={{ height: 30 }} />
        <CTTitleComponent title={'Sign in to your\nAccount'} />
        <Text style={styles.decText}>
          Enter your email and password to log in{' '}
        </Text>
        <CTSpacer height={30} />
        <CTTextInput
          ref={txt1}
          title={'EMAIL'}
          placeholder={'Enter email'}
          value={email}
          onChangeText={value => {
            setEmailErrorMsg('');
            setEmail(value.trimStart());
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          errorMsg={emailErrorMsg}
          onSubmitEditing={() => setTimeout(() => txt2.current.focus(), 100)}
          returnKeyType="next"
        />
        <CTSpacer height={30} />
        <CTTextInput
          ref={txt2}
          title={'PASSWORD'}
          value={password}
          placeholder={'Enter password'}
          secureText={secureText}
          setSecureText={setSecureText}
          secureTextOption={true}
          onChangeText={value => {
            setPasswordErrorMsg('');
            setPassword(value.trimStart());
          }}
          errorMsg={passwordErrorMsg}
          returnKeyType="done"
        />
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <CTSpacer height={30} />
          <CTButton
            containerStyle={{ width: '100%' }}
            title={'Log In'}
            onPress={onLoginPress}
            disabled={buttonDisable}
          />
        </View>
        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate('SignupScreen')}>
            Sign up
          </Text>
        </Text>
      </View>
    </AuthContainer>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    padding: 20,
  },
  decText: {
    color: colors.textSecondary,
    fontFamily: fonts.SoraRegular,
    fontSize: fontSizes.f12,
    marginTop: 10,
  },
  signupText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.textSecondary,
    alignSelf: 'center',
  },
  signupLink: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
});