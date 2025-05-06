import { Image, Keyboard, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { colors } from "../../utils/colors";
import fontSizes from "../../constants/fontSizes";
import AuthContainer from "../../components/AuthContainer";
import CTTitleComponent from "../../components/CTTitleComponent";
import { fonts } from "../../constants/fonts";
import CTTextInput from "../../components/CTTextInput";
import CTSpacer from "../../components/CTSpacer";
import CTButton from "../../components/CTButton";
import { AlertDialog } from "../../components/ToastMessage";
import { leftArrowIcon } from "../../assets/icons";

const AddCustomerScreen = ({ navigation }) => {
  const [doctorName, setDoctorName] = useState("");
  const [Speciality, setSpeciality] = useState("");
  const [HospitalName, setHospitalName] = useState("");
  const [MarketArea, setMarketArea] = useState("");
  const [Frequency, setFrequency] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [doctorNameError, setDoctorNameError] = useState("");
  const [SpecialityError, setSpecialityError] = useState("");
  const [HospitalNameError, setHospitalNameError] = useState("");
  const [MarketAreaError, setMarketAreaError] = useState("");
  const [FrequencyError, setFrequencyError] = useState("");
  const [contactError, setContactError] = useState("");
  const doctorNameRef = useRef("");
  const SpecialityRef = useRef("");
  const HospitalNameRef = useRef();
  const MarketAreaRef = useRef();
  const FrequencyRef = useRef("");
  const contactNumberRef = useRef("");

  const checkValidation = () => {
    if (doctorName.trim() === "") {
      AlertDialog("Please enter your doctor name.");
      setDoctorNameError("Please enter your doctor name");
      return false;
    }

    if (Speciality.trim() === "") {
      AlertDialog("Please enter your speciality name.");
      setSpecialityError("Please enter your speciality name");
      return false;
    }

    if (HospitalName.trim() === "") {
      AlertDialog("Please enter your hospital name.");
      setHospitalNameError("Please enter your hospital name");
      return false;
    }

    if (MarketArea.trim() === "") {
      AlertDialog("Please enter your marketarea name.");
      setMarketAreaError("Please enter your marketarea name");
      return false;
    }

    if (Frequency.trim() === "") {
      AlertDialog("Please enter your Frequency name.");
      setFrequencyError("Please enter your Frequency name");
      return false;
    }

    if (contactNumber.trim() === "") {
      AlertDialog("Please enter your contact number.");
      setContactError("Please enter contact number");
      return false;
    } else if (!/^\d{10}$/.test(contactNumber)) {
      AlertDialog("Please enter a valid 10-digit contact number.");
      setContactError("Please enter valid 10-digit number");
      return false;
    }

    return true; // Return true if all validations pass
  };

  const handleAddCustomer = async () => {
    Keyboard.dismiss();
    const isValid = checkValidation();
    if (isValid) {
      // navigation.navigate("AddchemistScreen")
      navigation.navigate("AddchemistScreen", {
        doctorDetails: {
          doctorName,
          Speciality,
          HospitalName,
          MarketArea,
          Frequency,
          contactNumber,
        },
      });
    }
  };

  return (
    <AuthContainer>
      <View style={styles.containerStyle}>
       <View style={{flexDirection:'row',width:'100%'}}>
           <View style={{
                  height: 40,
                  width: '33%',
                  justifyContent: "center",
                }}>
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: 40,
                      justifyContent: "center",
                      backgroundColor:colors.secondary,
                      borderRadius:10
                    }}
                    onPress={() => navigation.goBack()}
                  >
                    <Image source={leftArrowIcon} style={{
                      height: 20,
                      width: 20,
                      alignSelf: "center",
                      resizeMode:'contain'
                    }} />
                  </TouchableOpacity>
                </View>
          <CTTitleComponent title={"Add Doctor"} style={styles.customStyle} />
          <View style={{width:'33%'}}></View>
       </View>
        <View style={{ height: 20 }} />
        <CTTextInput
          ref={doctorNameRef}
          title={"Doctor Name"}
          placeholder={"Enter doctor name"}
          value={doctorName}
          onChangeText={(value) => {
            setDoctorNameError("");
            setDoctorName(value.trimStart());
          }}
          errorMsg={doctorNameError}
          onSubmitEditing={() =>
            setTimeout(() => SpecialityRef.current.focus(), 500)
          }
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <CTTextInput
          ref={SpecialityRef}
          title={"Speciality"}
          placeholder={"Enter Speciality"}
          value={Speciality}
          onChangeText={(value) => {
            setSpecialityError("");
            setSpeciality(value.trimStart());
          }}
          errorMsg={SpecialityError}
          maxLength={10}
          onSubmitEditing={() =>
            setTimeout(() => HospitalNameRef.current.focus(), 500)
          }
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <CTTextInput
          ref={HospitalNameRef}
          title={"Hospital Name"}
          placeholder={"Enter hospital name"}
          value={HospitalName}
          onChangeText={(value) => {
            setHospitalNameError("");
            setHospitalName(value.trimStart());
          }}
          errorMsg={HospitalNameError}
          onSubmitEditing={() =>
            setTimeout(() => MarketAreaRef.current.focus(), 500)
          }
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <CTTextInput
          ref={MarketAreaRef}
          title={"Market Area"}
          placeholder={"Enter market area"}
          value={MarketArea}
          onChangeText={(value) => {
            setMarketAreaError("");
            setMarketArea(value.trimStart());
          }}
          errorMsg={MarketAreaError}
          onSubmitEditing={() =>
            setTimeout(() => FrequencyRef.current.focus(), 500)
          }
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <CTTextInput
          ref={FrequencyRef}
          title={"Contact Frequency"}
          placeholder={"Enter frequency"}
          value={Frequency}
          onChangeText={(value) => {
            setFrequencyError("");
            setFrequency(value.trimStart());
          }}
          errorMsg={FrequencyError}
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
          returnKeyType="next"
        />
        <CTSpacer height={30} />

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <CTSpacer height={30} />
          <CTButton
            containerStyle={{ width: "100%" }}
            title={"Next"}
            onPress={handleAddCustomer}
          />
        </View>
      </View>
    </AuthContainer>
  );
};

export default AddCustomerScreen;

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
