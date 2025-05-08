import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import { colors } from "../../utils/colors";
import { fonts } from "../../constants/fonts";
import fontSizes from "../../constants/fontSizes";
import CTButton from "../../components/CTButton";
import { checkValidEmail } from "../../utils/Functions";
import { StackActions } from "@react-navigation/native";
import CTSpacer from "../../components/CTSpacer";
import AuthContainer from "../../components/AuthContainer";
import CTTextInput from "../../components/CTTextInput";
import CTTitleComponent from "../../components/CTTitleComponent";
import { AlertDialog, SuccessDialog } from "../../components/ToastMessage";
import { rootLoader, userSignup } from "../../actions";
import { useDispatch } from "react-redux";
import { leftArrowIcon } from "../../assets/icons";

const SignupScreen = ({ navigation }) => {
  const [secureText, setSecureText] = useState(true);
  const [secureConText, setSecureConText] = useState(true);
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [contactError, setContactError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");
  const [areaError, setAreaError] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const dispatch = useDispatch();
  const [buttonDisable, setButtonDisable] = useState(false);
  const fullNameRef = useRef();
  const contactNumberRef = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const areaRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const checkValidation = () => {
    // Full Name validation
    if (fullName.trim() === "") {
      AlertDialog("Please enter your full name.");
      setFullNameError("Please enter your full name");
      return false;
    }

    // Contact Number validation
    if (contactNumber.trim() === "") {
      AlertDialog("Please enter your contact number.");
      setContactError("Please enter contact number");
      return false;
    } else if (!/^\d{10}$/.test(contactNumber)) {
      AlertDialog("Please enter a valid 10-digit contact number.");
      setContactError("Please enter valid 10-digit number");
      return false;
    }
    const firstChar = state.trim().charAt(0);
    // State validation
    if (state.trim() === "") {
      AlertDialog("Please enter your state.");
      setStateError("Please enter state");
      return false;
    } else if (firstChar !== firstChar.toUpperCase()) {
      AlertDialog("First letter of state must be capital.");
      setStateError("First letter must be capital");
      return false;
    }

    const firstCityChar = city.trim().charAt(0);
    // City validation
    if (city.trim() === "") {
      AlertDialog("Please enter your city.");
      setCityError("Please enter city");
      return false;
    } else if (firstCityChar !== firstCityChar.toUpperCase()) {
      AlertDialog("First letter of city must be capital.");
      setStateError("First letter must be capital");
      return false;
    }

    const firstAreaChar = area.trim().charAt(0);
    // Area validation
    if (area.trim() === "") {
      AlertDialog("Please enter your area.");
      setAreaError("Please enter area");
      return false;
    } else if (firstAreaChar !== firstAreaChar.toUpperCase()) {
      AlertDialog("First letter of area must be capital.");
      setStateError("First letter must be capital");
      return false;
    }

    // Email validation
    if (email.trim() === "") {
      AlertDialog("Please enter your email address.");
      setEmailErrorMsg("Please enter email");
      return false;
    } else if (!checkValidEmail(email)) {
      AlertDialog("Please enter a valid email address.");
      setEmailErrorMsg("Please enter valid email");
      return false;
    }

    // Password validation
    if (password === "") {
      AlertDialog("Please enter your password.");
      setPasswordErrorMsg("Please enter password");
      return false;
    } else if (password.length < 6) {
      AlertDialog("Password must be at least 6 characters.");
      setPasswordErrorMsg("Password must be at least 6 characters");
      return false;
    }

    // Confirm Password validation
    if (confirmPassword === "") {
      AlertDialog("Please confirm your password.");
      setConfirmPasswordError("Please confirm password");
      return false;
    } else if (password !== confirmPassword) {
      AlertDialog("Passwords do not match.");
      setConfirmPasswordError("Passwords do not match");
      return false;
    }

    return true;
  };

  const onSignupPress = async () => {
    Keyboard.dismiss();
    const isValid = checkValidation();
    if (isValid) {
      setButtonDisable(true);
      try {
        let data = {
          name: fullName,
          mobile: contactNumber,
          email: email,
          state: state,
          city: city,
          address: area,
          password: password,
          con_password: confirmPassword,
        };
        dispatch(rootLoader(true));
        const hResult = await dispatch(userSignup(data));
        if (hResult.success) {
          SuccessDialog(hResult.message);
          navigation.navigate("OtpScreen");
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
        <View style={{ height: 10 }} />
        <View style={{ flexDirection: "row", }}>
          <View
            style={{
              marginTop:5,
              width: "30%",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                justifyContent: "center",
                backgroundColor: colors.secondary,
              }}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={leftArrowIcon}
                style={{
                  height: 20,
                  width: 20,
                  alignSelf: "center",
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </View>
          <CTTitleComponent title={"Sign up"} style={styles.customStyle} />
        </View>
        <View style={{ height: 20 }} />
        <CTTextInput
          ref={fullNameRef}
          title={"Full Name"}
          placeholder={"Enter full name"}
          value={fullName}
          onChangeText={(value) => {
            setFullNameError("");
            setFullName(value.trimStart());
          }}
          errorMsg={fullNameError}
          onSubmitEditing={() =>
            setTimeout(() => contactNumberRef.current.focus(), 500)
          }
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <CTTextInput
          ref={contactNumberRef}
          title={"Contact Number"}
          placeholder={"Enter contact number"}
          value={contactNumber}
          onChangeText={(value) => {
            setContactError("");
            setContactNumber(value.trimStart());
          }}
          keyboardType="phone-pad"
          errorMsg={contactError}
          maxLength={10}
          onSubmitEditing={() =>
            setTimeout(() => stateRef.current.focus(), 500)
          }
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <CTTextInput
          ref={stateRef}
          title={"State"}
          placeholder={"Enter state"}
          value={state}
          onChangeText={(value) => {
            setStateError("");
            setState(value.trimStart());
          }}
          errorMsg={stateError}
          onSubmitEditing={() => setTimeout(() => cityRef.current.focus(), 500)}
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <CTTextInput
          ref={cityRef}
          title={"City"}
          placeholder={"Enter city"}
          value={city}
          onChangeText={(value) => {
            setCityError("");
            setCity(value.trimStart());
          }}
          errorMsg={cityError}
          onSubmitEditing={() => setTimeout(() => areaRef.current.focus(), 500)}
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <CTTextInput
          ref={areaRef}
          title={"Contact Area"}
          placeholder={"Enter area"}
          value={area}
          onChangeText={(value) => {
            setAreaError("");
            setArea(value.trimStart());
          }}
          errorMsg={areaError}
          onSubmitEditing={() =>
            setTimeout(() => emailRef.current.focus(), 500)
          }
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <CTTextInput
          ref={emailRef}
          title={"Email"}
          placeholder={"Enter email"}
          value={email}
          onChangeText={(value) => {
            setEmailErrorMsg("");
            setEmail(value.trimStart());
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          errorMsg={emailErrorMsg}
          onSubmitEditing={() =>
            setTimeout(() => passwordRef.current.focus(), 500)
          }
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <CTTextInput
          ref={passwordRef}
          title={"Password"}
          value={password}
          placeholder={"Enter password"}
          secureText={secureText}
          setSecureText={setSecureText}
          secureTextOption={true}
          onChangeText={(value) => {
            setPasswordErrorMsg("");
            setPassword(value.trimStart());
          }}
          errorMsg={passwordErrorMsg}
          onSubmitEditing={() =>
            setTimeout(() => confirmPasswordRef.current.focus(), 500)
          }
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <CTTextInput
          ref={confirmPasswordRef}
          title
          twist={"Confirm Password"}
          placeholder={"Enter confirm password"}
          value={confirmPassword}
          secureText={secureConText}
          setSecureText={setSecureConText}
          secureTextOption={true}
          onChangeText={(value) => {
            setConfirmPasswordError("");
            setConfirmPassword(value.trimStart());
          }}
          errorMsg={confirmPasswordError}
          returnKeyType="done"
        />

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <CTSpacer height={30} />
          <CTButton
            containerStyle={{ width: "100%" }}
            title={"Sign up"}
            onPress={onSignupPress}
            disabled={buttonDisable}
          />
        </View>
      </View>
    </AuthContainer>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    padding: 20,
  },
  customStyle: {
    alignSelf: "center",
    color: colors.textSecondary,
    fontSize: fontSizes.f35,
  },
  decText: {
    color: colors.textSecondary,
    fontFamily: fonts.SoraRegular,
    fontSize: fontSizes.f12,
    marginTop: 10,
  },
});
