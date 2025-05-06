import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    PermissionsAndroid,
    Platform,
    Dimensions,
    Alert,
} from "react-native";
import Modal from "react-native-modal";
import { colors } from "../utils/colors";
import { fonts } from "../constants/fonts";
import fontSizes from "../constants/fontSizes";
import CTSpacer from "./CTSpacer";
import { useDispatch, useSelector } from "react-redux";
import { helperList, masterCreate, rootLoader } from "../actions";
import CTButton from "./CTButton";
import Geolocation from "react-native-geolocation-service";
import { StackActions, useNavigation } from "@react-navigation/native";
import DeviceInfo from "react-native-device-info";
import { RESET_USER } from "../utils/reduxConstant";

const SelfModal = ({ isVisible, setIsVisible, categoryId, DrId }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const [getList, setList] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [address, setAddress] = useState("");
    const { height } = Dimensions.get("window");
    const isTablet = DeviceInfo.isTablet();
    const sheetHeight = isTablet ? height * 0.5 - 35 : height * 0.5;
    useEffect(() => {
        getHelperPerson();
        getLatLong();
    }, []);

    const requestLocationPermission = async () => {
        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else if (Platform.OS === "ios") {
            try {
                const status = await Geolocation.requestAuthorization("whenInUse");
                return status === "granted";
            } catch (err) {
                console.warn("iOS permission error:", err);
                return false;
            }
        }
        return false;
    };

    const getAddressFromLatLong = async (lat, lon) => {
        try {
            const apiKey = "23fa5c3115704032a67b6ab0d5cda7ec";
            const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const formattedAddress = data.features[0].properties.formatted || "";
                setAddress(formattedAddress);
                console.log("Fetched Address:", formattedAddress);
            } else {
                console.warn("No address found for the given coordinates");
                setAddress("");
            }
        } catch (err) {
            console.error("Error fetching address:", err);
            setAddress("");
        }
    };

    const getLatLong = async () => {
        try {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                console.warn("Location permission not granted");
                return;
            }
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("Current Location:", latitude, longitude);
                    setLatitude(latitude.toString());
                    setLongitude(longitude.toString());
                    getAddressFromLatLong(latitude, longitude);
                },
                (error) => {
                    console.error("Location error:", error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                }
            );
        } catch (err) {
            console.error("Error in getLatLong:", err);
        }
    };

    const getHelperPerson = async () => {
        try {
            dispatch(rootLoader(true));
            const hResult = await helperList();
            if (hResult.success) {
                const selfItem = {
                    id: 0,
                    name: "Self",
                    mobile_no: "",
                };
                const updatedList = [selfItem, ...hResult.data];
                setList(updatedList);
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
        } catch (err) {
            console.log("error from get helperList", err);
        } finally {
            dispatch(rootLoader(false));
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => setSelectedId(item.id)}
            style={styles.itemContainer}
        >
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity
                style={{
                    height: 20,
                    width: 20,
                    borderColor: colors.secondary,
                    borderWidth: 1,
                    borderRadius: 10,
                    justifyContent: "center",
                }}
            >
                {selectedId === item.id && (
                    <View
                        style={{
                            height: 10,
                            width: 10,
                            backgroundColor: colors.secondary,
                            borderRadius: 5,
                            alignSelf: "center",
                        }}
                    />
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async () => {
        try {
            setIsVisible(false);
            dispatch(rootLoader(true));
            const data = {
                user_id: parseInt(userInfo?.id),
                helper_id: selectedId,
                doctor_id: DrId,
                category_id: categoryId,
                product_id: 9,
                activity_datetime: getCurrentDateTime(),
                lat: latitude || "",
                long: longitude || "",
                address: address || "",
            };
            const hResult = await masterCreate(data);
            if (hResult.success) {
                navigation.pop(2);
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
                dispatch(rootLoader(false));
            }
        } catch (err) {
            console.log("error from master", err);
        } finally {
            dispatch(rootLoader(false));
        }
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsVisible(false)}
            style={styles.modal}
            swipeDirection="down"
            onDismiss={() => setIsVisible(false)}
            onBackButtonPress={() => setIsVisible(false)}
            statusBarTranslucent
            animationInTiming={300}
            animationOutTiming={300}
            useNativeDriver={true}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating
            onSwipeComplete={() => setIsVisible(false)}
        >
            <View
                style={{
                    backgroundColor: colors.white,
                    borderTopLeftRadius: 28,
                    paddingHorizontal: 20,
                    borderTopRightRadius: 28,
                    width: "100%",
                    maxHeight: sheetHeight,
                }}
            >
                <View style={styles.lineContainer} />
                <CTSpacer height={10} />
                <FlatList
                    data={getList}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
                <CTSpacer height={25} />
                <CTButton
                    containerStyle={{ width: "100%" }}
                    title={"Submit"}
                    onPress={handleSubmit}
                />
                <CTSpacer height={25} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    modalContent: {},
    lineContainer: {
        height: 4,
        width: 32,
        backgroundColor: colors.textSecondary,
        borderRadius: 100,
        marginVertical: 15,
        alignSelf: "center",
    },
    titleStyle: {
        fontFamily: fonts.SoraSemiBold,
        fontSize: fontSizes.f20,
        color: colors.black_31,
        alignSelf: "center",
        textAlign: "center",
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    buttonText: {
        fontFamily: fonts.SoraSemiBold,
        color: colors.white,
        fontSize: fontSizes.f18,
        alignSelf: "center",
    },
    itemContainer: {
        borderRadius: 12,
        width: "100%",
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    doctorCard: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: "#000",
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

export default SelfModal;
