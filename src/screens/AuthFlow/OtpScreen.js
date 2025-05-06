import React, { useState } from "react";
import { Keyboard, SafeAreaView, StatusBar, Text, View } from "react-native";
import CTSpacer from "../../components/CTSpacer";
import { colors } from "../../utils/colors";
import { fonts } from "../../constants/fonts";
import fontSizes from "../../constants/fontSizes";
import CTTitleComponent from "../../components/CTTitleComponent";
import OTPTextInput from 'react-native-otp-textinput';
import CTButton from "../../components/CTButton";
import { rootLoader, verifyOtp } from "../../actions";
import { useDispatch } from "react-redux";
import { AlertDialog, SuccessDialog } from "../../components/ToastMessage";
import { StackActions } from "@react-navigation/native";
const OtpScreen = ({navigation}) =>{
    const dispatch = useDispatch();
    const [otp, setOtp] = useState('');

    const handleChange = (code) => {
        setOtp(code);
    };

    const handleOtp = async()=>{
        let valid = true;
        Keyboard.dismiss();
        if (!otp.trim()) {
            AlertDialog("please enter the OTP.");
            valid = false;
        } else if (otp.length !== 6) {
            AlertDialog("otp must be 6 digits.");
            valid = false;
        }

        if (!valid) return;

        dispatch(rootLoader(true));
        let data = {
           otp:otp
        };
        const hResult = await verifyOtp(data);
        if (hResult.success) {
            SuccessDialog(hResult.message);
            dispatch(rootLoader(false));            
            navigation.dispatch(StackActions.replace('DashboardStack'))
        } else {
            dispatch(rootLoader(false));
            AlertDialog(hResult.message);
        }   
    }

    return (
        <View style={{flex:1,}}>
          <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
               <SafeAreaView style={{ backgroundColor: colors.secondary }} />
            <View style={{ height: 30 }} />
            <View style={{padding:20,flex:1}}>
            <CTTitleComponent title={'Verification Code'} />
            <Text style={{
                  color: colors.textSecondary,
                    fontFamily: fonts.SoraRegular,
                    fontSize: fontSizes.f12,
                    marginTop: 10,
            }}>
                {'We have sent the Verification \n code to your email address'}
            </Text>
            <CTSpacer height={30} />
            <View style={{ alignSelf: 'center', marginTop: 20 }}>
                <OTPTextInput
                    inputCount={6}
                    textInputStyle={{
                        width: 30,
                        height: 45,
                        borderWidth: 0,
                        borderBottomWidth: 3,
                        color: 'black',
                        borderColor: 'black',
                    }}
                    tintColor={colors.secondary}
                    offTintColor={colors.textSecondary}
                    containerStyle={{ marginVertical: 10 }}
                    handleTextChange={handleChange}
                    autoFocusOnLoad
                />
            </View>
            <View style={{ flex: 1  }}>
                <CTSpacer height={80} />
                <CTButton
                    containerStyle={{ width: '100%',alignSelf:'center' }}
                    title={'Confirm'}
                    onPress={handleOtp}
                />
            </View>
            </View>
          
        </View>
    );
};
export default OtpScreen;