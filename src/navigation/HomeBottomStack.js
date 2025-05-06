import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  PermissionsAndroid,
  SafeAreaView,
  Platform,
  Alert,
  Linking,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { colors } from "../utils/colors";
import {
  employee,
  menuIcon,
  setting,
  checklist,
  medicalIcom,
  salary,
  procurement,
  plashHolder,
  businessman,
} from "../assets/icons";
import CTSpacer from "../components/CTSpacer";
import fontSizes from "../constants/fontSizes";
import { useDispatch, useSelector } from "react-redux";
import DeviceInfo, { isTablet } from "react-native-device-info";
import { DeleteAccount, Logout, rootLoader } from "../actions";
import { StackActions } from "@react-navigation/native";
import CTBottomModal from "../components/CTBottomModal";
import { AlertDialog, SuccessDialog } from "../components/ToastMessage";
import { RESET_USER } from "../utils/reduxConstant";
import Geolocation from "react-native-geolocation-service";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeBottomStack = ({ navigation }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { width } = Dimensions.get("window");
  const drawerWidth = width / 1.5;
  const drawerAnimation = useRef(new Animated.Value(-drawerWidth)).current;
  const { userInfo } = useSelector((state) => state.auth);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const minItemWidth = 160;
  const numColumns = Math.floor(width / minItemWidth);
  const insets = useSafeAreaInsets();
  const isTablet = DeviceInfo.isTablet();
  useEffect(() => {
    requestLocationPermission();
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

  const data = [
    { id: 1, name: "Customer", image: medicalIcom },
    ...(userInfo.is_admin == 0
      ? [{ id: 2, name: "File DCR", image: checklist }]
      : []),
    ...(userInfo.is_admin == 1
      ? [{ id: 3, name: "MR List", image: employee }]
      : []),
    { id: 5, name: "Category List", image: procurement },
    ...(userInfo.is_admin == 1
      ? [{ id: 6, name: "Add Helper", image: businessman }]
      : []),
  ];

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -drawerWidth : 0;
    Animated.timing(drawerAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogoutUser = async () => {
    try {
      setIsLogoutModalVisible(false);
      dispatch(rootLoader(true));
      const hRequest = {
        id: parseInt(userInfo.id),
        token: userInfo?.token,
      };
      setTimeout(async() => {
        const hResult = await Logout(hRequest);
        if (hResult.success) {
          navigation.dispatch(StackActions.replace("AuthStack"));
          dispatch({ type: RESET_USER });
          SuccessDialog("Account logout successfully");
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
      }, 1000);
    
    } catch (err) {
      console.log("error from logout", err);
    } finally {
      dispatch(rootLoader(false));
    }
  };

  const handleDeleteUser = async () => {
    try {
      setIsDeleteModalVisible(false);
      dispatch(rootLoader(true));
      const hRequest = { id: userInfo.id };
   setTimeout(async() => {
    const hResult = await DeleteAccount(hRequest);
    if (hResult.success) {
      navigation.dispatch(StackActions.replace("AuthStack"));
      dispatch({ type: RESET_USER });
      SuccessDialog("Account deleted successfully");
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
   }, 1000);
    } catch (err) {
      console.log("error from delete", err);
    } finally {
      dispatch(rootLoader(false));
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { width: (width - 60) / numColumns }]}
      onPress={() => {
        if (item.id === 1) navigation.navigate("CustomerScreen");
        else if (item.id === 2) navigation.navigate("FileDcrScreen");
        else if (item.id === 3) navigation.navigate("MrListScreen");
        else if (item.id === 5) navigation.navigate("CategoryList");
        else if (item.id === 6) navigation.navigate("HelperList");
      }}
    >
      <View style={styles.iconWrapper}>
        <Image source={item.image} style={styles.iconImage} />
      </View>
      <CTSpacer height={5} />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );
  const openURLInBrowser = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      AlertDialog('Error', error.message);
    }
  };

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
          <TouchableOpacity style={styles.headerIcon} onPress={toggleDrawer}>
            <Image source={menuIcon} style={styles.headerImage} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Home</Text>
          <View style={styles.headerIcon} />
        </View>

        <View style={styles.contentWrapper}>
          <CTSpacer height={10} />
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
            bounces={false}
            key={numColumns}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: drawerAnimation }],
              width: drawerWidth,
            },
          ]}
        >
          <SafeAreaView style={styles.drawerContent}>
            <View
              style={[
                styles.profileContainer,
                isTablet && styles.profileContainerTablet,
              ]}
            >
              <Image
                source={plashHolder}
                style={[
                  styles.profileImage,
                  isTablet && styles.profileImageTablet,
                ]}
              />
              <Text
                style={[
                  styles.profileName,
                  isTablet && styles.profileNameTablet,
                ]}
              >
                {userInfo?.name || "Name"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() =>{
                openURLInBrowser('https://gravianzpharma.com/terms-conditions');
              }}
            >
              <Text
                style={[
                  styles.drawerItemText,
                  isTablet && styles.drawerItemTextTablet,
                ]}
              >
                Terms and conditions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                openURLInBrowser('https://gravianzpharma.com/privacy-policy');
              }}
            >
              <Text
                style={[
                  styles.drawerItemText,
                  isTablet && styles.drawerItemTextTablet,
                ]}
              >
                Privacy policy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => setIsDeleteModalVisible(true)}
            >
              <Text
                style={[
                  styles.drawerItemText,
                  isTablet && styles.drawerItemTextTablet,
                ]}
              >
                Delete account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.logoutButton,
                isTablet && styles.logoutButtonTablet,
              ]}
              onPress={() => setIsLogoutModalVisible(true)}
            >
              <Text
                style={[styles.logoutText, isTablet && styles.logoutTextTablet]}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Animated.View>

        {isDrawerOpen && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={toggleDrawer}
          />
        )}
      </View>

      <CTBottomModal
        isVisible={isLogoutModalVisible}
        title="Are you sure you want to log out?"
        setIsVisible={setIsLogoutModalVisible}
        onYesPress={handleLogoutUser}
      />
      <CTBottomModal
        isVisible={isDeleteModalVisible}
        title="Are you sure you want to delete account?"
        setIsVisible={setIsDeleteModalVisible}
        onYesPress={handleDeleteUser}
      />
    </>
  );
};

export default HomeBottomStack;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
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
    fontSize: fontSizes.f25,
  },
  contentWrapper: {
    flex: 1,
    margin: 15,
    borderRadius: 12,
    borderColor: colors.textSecondary,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  itemContainer: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  iconWrapper: {
    height: 100,
    width: 100,
    borderColor: colors.secondary,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    height: 70,
    width: 70,
  },
  itemText: {
    color: colors.textSecondary,
    fontWeight: "bold",
    marginTop: 5,
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.white,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 1000,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  drawerContent: {
    flex: 1,
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileContainerTablet: {
    marginBottom: 30,
  },
  profileImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    resizeMode: "contain",
  },
  profileImageTablet: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: fontSizes.f16,
    color: colors.textSecondary,
    marginTop: 10,
    fontWeight: "bold",
  },
  profileNameTablet: {
    fontSize: fontSizes.f16,
  },
  drawerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary + "33",
  },
  drawerItemText: {
    fontSize: fontSizes.f16,
    color: colors.textSecondary,
    marginLeft: Platform.OS == "ios" ? 15 : 0,
  },
  drawerItemTextTablet: {
    fontSize: fontSizes.f12,
  },
  logoutButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary + "33",
    alignItems: "center",
  },
  logoutButtonTablet: {
    bottom: 40,
    paddingVertical: 20,
  },
  logoutText: {
    fontSize: fontSizes.f16,
    color: colors.textSecondary,
    fontWeight: "bold",
  },
  logoutTextTablet: {
    fontSize: fontSizes.f14,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
});
