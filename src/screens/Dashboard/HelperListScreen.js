import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Keyboard,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { add, leftArrowIcon, success } from "../../assets/icons";
import { colors } from "../../utils/colors";
import CTSpacer from "../../components/CTSpacer";
import fontSizes from "../../constants/fontSizes";
import { fonts } from "../../constants/fonts";
import RBSheet from "react-native-raw-bottom-sheet";
import AuthContainer from "../../components/AuthContainer";
import CTTitleComponent from "../../components/CTTitleComponent";
import CTTextInput from "../../components/CTTextInput";
import CTButton from "../../components/CTButton";
import { createHelper, helperList, rootLoader } from "../../actions";
import { useDispatch } from "react-redux";
import { AlertDialog, SuccessDialog } from "../../components/ToastMessage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DeviceInfo from "react-native-device-info";
import { StackActions } from "@react-navigation/native";
import { RESET_USER } from "../../utils/reduxConstant";
const HelperList = ({ navigation }) => {
    const refRBSheet = useRef();
    const [name, setName] = useState();
    const [moblileNo, setMoblileNo] = useState();
    const nameRef = useRef();
    const moblileNoRef = useRef();
    const [nameErrorMsg, setNameErrorMsg] = useState();
    const [mobileNoErrorMsg, setMoblieNoErrorMsg] = useState();
    const dispatch = useDispatch();
    const [getList, setList] = useState([]);
    const insets = useSafeAreaInsets();
    const [listGet, setListGet] = useState(false);
    const { height } = Dimensions.get("window");
    const isTablet = DeviceInfo.isTablet();
    const sheetHeight = isTablet ? height * 0.5 - 35 : height * 0.5;
    useEffect(() => {
        getHelperPerson();
    }, []);

    const getHelperPerson = async () => {
        try {
            dispatch(rootLoader(true));
            const hResult = await helperList();
            if (hResult.success) {
                setList(hResult.data);
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
            }
        } catch {
            console.log("error from get helperList", err);
        } finally {
            setListGet(true);
            dispatch(rootLoader(false));
        }
    };

    const checkValidation = () => {
        if (name.trim() === "") {
            AlertDialog("Please enter your full name.");
            setNameErrorMsg("Please enter your full name");
            return false;
        }
        if (moblileNo.trim() === "") {
            AlertDialog("Please enter your contact number.");
            setMoblieNoErrorMsg("Please enter contact number");
            return false;
        } else if (!/^\d{10}$/.test(moblileNo)) {
            AlertDialog("Please enter a valid 10-digit contact number.");
            setMoblieNoErrorMsg("Please enter valid 10-digit number");
            return false;
        }

        return true;
    };

    const onHelperAdd = async () => {
        Keyboard.dismiss();
        const isValid = checkValidation();
        if (isValid) {
            try {
                refRBSheet.current.close();
                dispatch(rootLoader(true));
                let data = {
                    name: name,
                    mobile_no: moblileNo,
                };
                const hResult = await createHelper(data);
                if (hResult.success) {
                    SuccessDialog(hResult.message);
                    setList([
                        ...getList,
                        {
                            id: hResult.data.id,
                            name: hResult.data.name,
                            mobile_no: hResult.data.mobile_no,
                        },
                    ]);
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
            } catch (err) {
                console.log("error from add helper", err);
            } finally {
                dispatch(rootLoader(false));
            }
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Name : {item.name}</Text>
            <Text style={styles.itemText}>Mobile no : {item.mobile_no}</Text>
        </View>
    );

    return (
        <>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.white,
                    paddingBottom: insets.bottom,
                }}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.secondary}
                />
                <SafeAreaView style={{ backgroundColor: colors.secondary }} />
                <View style={styles.header}>
                    <View
                        style={{
                            height: 40,
                            width: 40,
                            justifyContent: "center",
                            marginLeft: 15,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                height: 40,
                                width: 40,
                                justifyContent: "center",
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
                    <Text style={styles.headerText}>Helper</Text>
                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={() => {
                            refRBSheet.current.open();
                        }}
                    >
                        <Image source={add} style={styles.headerImage} />
                    </TouchableOpacity>
                </View>
                <CTSpacer height={15} />
                {getList.length > 0 ? (
                    <FlatList
                        data={getList}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                ) : listGet ? (
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ alignSelf: "center" }}>No helper found</Text>
                    </View>
                ) : null}
            </View>
            <RBSheet
                ref={refRBSheet}
                height={sheetHeight}
                openDuration={250}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingHorizontal: 20,
                    },
                }}
            >
                <AuthContainer>
                    <View style={styles.containerStyle}>
                        <CTTitleComponent title={"Add Helper"} style={styles.customStyle} />
                        <View style={{ height: 20 }} />
                        <CTTextInput
                            ref={nameRef}
                            title={"Enter Name"}
                            placeholder={"Enter name"}
                            value={name}
                            onChangeText={(value) => {
                                setNameErrorMsg("");
                                setName(value.trimStart());
                            }}
                            errorMsg={nameErrorMsg}
                            returnKeyType="next"
                        />
                        <CTSpacer height={30} />
                        <CTTextInput
                            ref={moblileNoRef}
                            title={"Enter Mobile Number"}
                            placeholder={"Enter Mobile Number"}
                            value={moblileNo}
                            onChangeText={(value) => {
                                setMoblieNoErrorMsg("");
                                setMoblileNo(value.trimStart());
                            }}
                            errorMsg={mobileNoErrorMsg}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                        <CTSpacer height={30} />
                        <CTButton
                            containerStyle={{ width: "100%" }}
                            title={"Add Helper"}
                            onPress={onHelperAdd}
                        />
                    </View>
                </AuthContainer>
            </RBSheet>
        </>
    );
};

export default HelperList;

const styles = StyleSheet.create({
    header: {
        height: 50,
        backgroundColor: colors.secondary,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    headerIcon: {
        height: 40,
        width: 40,
        justifyContent: "center",
        marginHorizontal: 15,
    },
    headerImage: {
        height: 20,
        width: 20,
        alignSelf: "center",
    },
    headerText: {
        color: colors.white,
        fontWeight: "bold",
        fontSize: 20,
        alignSelf: "center",
        marginLeft: 5,
    },
    listContainer: {
        padding: 15,
    },
    itemContainer: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 15,
        marginVertical: 10,
        borderColor: "#ccc",
    },
    doctorCard: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2, // Shadow for Android
        shadowColor: "#000", // Shadow for iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    doctorName: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.black,
        marginBottom: 5,
    },
    doctorDetail: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 3,
    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        color: colors.gray,
        marginTop: 20,
    },
    containerStyle: {
        flex: 1,
        padding: 20,
    },
    customStyle: {
        alignSelf: "center",
        color: colors.textSecondary,
        fontSize: fontSizes.f22,
    },
    decText: {
        color: colors.textSecondary,
        fontFamily: fonts.SoraRegular,
        fontSize: fontSizes.f12,
        marginTop: 10,
    },
});
