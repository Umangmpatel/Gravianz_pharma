import {
  Alert,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import AuthContainer from "../../components/AuthContainer";
import { colors } from "../../utils/colors";
import { fonts } from "../../constants/fonts";
import fontSizes from "../../constants/fontSizes";
import CTTextInput from "../../components/CTTextInput";
import CTTitleComponent from "../../components/CTTitleComponent";
import CTButton from "../../components/CTButton";
import CTSpacer from "../../components/CTSpacer";
import { AlertDialog, SuccessDialog } from "../../components/ToastMessage";
import { createDoctor, rootLoader } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import { StackActions, useNavigation } from "@react-navigation/native";
import { leftArrowIcon } from "../../assets/icons";
import { RESET_USER } from "../../utils/reduxConstant";

const AddchemistScreen = ({ route }) => {
  const navigation = useNavigation();
  const { doctorDetails = {} } = route.params || {};
  const { userInfo } = useSelector((state) => state.auth);
  const {
    doctorName = "",
    Speciality = "",
    HospitalName = "",
    MarketArea = "",
    Frequency = "",
    contactNumber = "",
  } = doctorDetails;
  const dispatch = useDispatch();
  const [ShopName, setShopName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [ChemistName, setChemistName] = useState("");
  const [MobileNumber, setMobileNumber] = useState("");
  const [ShopNameError, setShopNameError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");
  const [areaError, setAreaError] = useState("");
  const [MobileNumberError, setMobileNumberError] = useState("");
  const [ChemistNameError, setChemistNameError] = useState("");
  const ShopNameRef = useRef("");
  const stateRef = useRef();
  const cityRef = useRef();
  const areaRef = useRef();
  const ChemistNameRef = useRef();
  const MobileNumberRef = useRef("");

  const checkValidation = () => {
    if (ShopName.trim() === "") {
      AlertDialog("Please enter your shop name.");
      setShopNameError("Please enter your shop name");
      return false;
    }
    const firstChar = state.trim().charAt(0);
    if (state.trim() === "") {
      AlertDialog("Please enter your state name.");
      setStateError("Please enter your state name");
      return false;
    } else if (firstChar !== firstChar.toUpperCase()) {
      AlertDialog("First letter of state must be capital.");
      setStateError("First letter must be capital");
      return false;
    }

    const firstCityChar = city.trim().charAt(0);
    if (city.trim() === "") {
      AlertDialog("Please enter your city name.");
      setCityError("Please enter your city name");
      return false;
    } else if (firstCityChar !== firstCityChar.toUpperCase()) {
      AlertDialog("First letter of city must be capital.");
      setStateError("First letter must be capital");
      return false;
    }
    const firstAreaChar = area.trim().charAt(0);
    if (area.trim() === "") {
      AlertDialog("Please enter your area name.");
      setAreaError("Please enter your area name");
      return false;
    } else if (firstAreaChar !== firstAreaChar.toUpperCase()) {
      AlertDialog("First letter of area must be capital.");
      setStateError("First letter must be capital");
      return false;
    }

    if (ChemistName.trim() === "") {
      AlertDialog("Please enter your chemist name.");
      setChemistNameError("Please enter your chemist name");
      return false;
    }

    if (MobileNumber.trim() === "") {
      AlertDialog("Please enter your mobile number.");
      setMobileNumberError("Please enter mobile number");
      return false;
    } else if (!/^\d{10}$/.test(MobileNumber)) {
      AlertDialog("Please enter a valid 10-digit mobile number.");
      setMobileNumberError("Please enter valid 10-digit number");
      return false;
    }

    return true; // Return true if all validations pass
  };

  const handleAddCustomer = async () => {
    Keyboard.dismiss();
    const isValid = checkValidation();
    if (isValid) {
      try {
        let data = {
          user_id: userInfo.id,
          doctor_name: doctorName,
          speciality: Speciality,
          hospital_name: HospitalName,
          market_area: MarketArea,
          frequency: Frequency,
          contact_number: contactNumber,
          chemist_name: ChemistName,
          shop_name: ShopName,
          state: state,
          city: city,
          mobile_no: MobileNumber,
        };
        dispatch(rootLoader(true));
        const hResult = await createDoctor(data);
        if (hResult.success) {
          SuccessDialog(hResult.message);
          setTimeout(() => {
            navigation.pop(2);
          }, 500);
        } else {
          if (hResult.code == 101) {
            Alert.alert(
              "Session Expired",
              "Your login detected on another device",
              [
                {
                  text: "Yes",
                  onPress: () => {
                    navigation.dispatch(StackActions.replace("AuthStack"));
                    dispatch({ type: RESET_USER });
                  },
                },
              ]
            );
          }
          AlertDialog(hResult.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(rootLoader(false));
      }
    }
  };
  return (
    <AuthContainer>
      <View style={styles.containerStyle}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View
            style={{
              height: 40,
              width: "33%",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                justifyContent: "center",
                backgroundColor: colors.secondary,
                borderRadius: 10,
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
          <CTTitleComponent title={"Add chemist"} style={styles.customStyle} />
          <View style={{ width: "33%" }}></View>
        </View>
        {/* <CTTitleComponent title={"Add chemist"} style={styles.customStyle} /> */}
        <View style={{ height: 20 }} />
        <CTTextInput
          ref={ShopNameRef}
          title={"Shop Name"}
          placeholder={"Enter shop name"}
          value={ShopName}
          onChangeText={(value) => {
            setShopNameError("");
            setShopName(value.trimStart());
          }}
          errorMsg={ShopNameError}
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
          title={"Market Area"}
          placeholder={"Enter market area"}
          value={area}
          onChangeText={(value) => {
            setAreaError("");
            setArea(value.trimStart());
          }}
          errorMsg={areaError}
          onSubmitEditing={() =>
            setTimeout(() => ChemistNameRef.current.focus(), 500)
          }
          returnKeyType="next"
        />

        <CTSpacer height={30} />
        <CTTextInput
          ref={ChemistNameRef}
          title={"Chemist Name"}
          placeholder={"Enter chemist name"}
          value={ChemistName}
          onChangeText={(value) => {
            setChemistNameError("");
            setChemistName(value.trimStart());
          }}
          errorMsg={ChemistNameError}
          onSubmitEditing={() =>
            setTimeout(() => MobileNumberRef.current.focus(), 500)
          }
          returnKeyType="next"
        />
        <CTSpacer height={30} />
        <CTTextInput
          ref={MobileNumberRef}
          title={"Mobile Number"}
          placeholder={"Enter mobile number"}
          value={MobileNumber}
          onChangeText={(value) => {
            setMobileNumberError("");
            setMobileNumber(value.trimStart());
          }}
          maxLength={10}
          keyboardType="phone-pad"
          errorMsg={MobileNumberError}
          returnKeyType="next"
        />

        <CTSpacer height={30} />

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <CTSpacer height={30} />
          <CTButton
            containerStyle={{ width: "100%" }}
            title={"Add Customer"}
            onPress={handleAddCustomer}
          />
        </View>
      </View>
    </AuthContainer>
  );
};

export default AddchemistScreen;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    padding: 20,
  },
  customStyle: {
    alignSelf: "center",
    color: colors.textSecondary,
    fontSize: fontSizes.f25,
  },
  decText: {
    color: colors.textSecondary,
    fontFamily: fonts.SoraRegular,
    fontSize: fontSizes.f12,
    marginTop: 10,
  },
});
