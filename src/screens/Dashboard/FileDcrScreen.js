import {
  Alert,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getDoctorByUser, rootLoader } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import CTSpacer from "../../components/CTSpacer";
import { colors } from "../../utils/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { leftArrowIcon } from "../../assets/icons";
import { StackActions } from "@react-navigation/native";
import { RESET_USER } from "../../utils/reduxConstant";

const FileDcrScreen = ({ navigation }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [listGet, setListGet] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    getDocByUser();
  }, []);

  const getDocByUser = async () => {
    dispatch(rootLoader(true));
    try {
      const hResult = await getDoctorByUser(
        {
          "User-Id": userInfo.id,
        },
        parseInt(userInfo.id)
      );
      if (hResult.success) {
        setDoctorList(hResult.data);
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
      console.log("error", err);
    } finally {
      setListGet(true);
      dispatch(rootLoader(false));
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("CategoryList", {
          navigationFrom: "FileDCR",
          DrId: item.id,
        });
      }}
      style={styles.itemContainer}
    >
      <Text style={styles.itemText}>{item.doctor_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <SafeAreaView style={{ backgroundColor: colors.secondary }} />
      <View style={styles.header}>
        <View
          style={{
            height: 40,
            width: "33%",
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
        <Text style={styles.headerText}>Doctor List</Text>
        <View style={{ width: "33%" }}></View>
      </View>
      <CTSpacer height={10} />
      {doctorList.length > 0 ? (
        <FlatList
          data={doctorList}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : listGet ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ alignSelf: "center" }}>No doctors found</Text>
        </View>
      ) : null}
    </View>
  );
};

export default FileDcrScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: colors.white,
  },
  itemContainer: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
    borderColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    height: 50,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
  },
});
