import {
  Alert,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import CTSpacer from "../../components/CTSpacer";
import { colors } from "../../utils/colors";
import { activityList, rootLoader, UserList } from "../../actions";
import { useDispatch } from "react-redux";
import { call, leftArrowIcon } from "../../assets/icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackActions } from "@react-navigation/native";
import { RESET_USER } from "../../utils/reduxConstant";

const MrListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userList, setUserList] = useState([]);
  const insets = useSafeAreaInsets();
  const [listGet, setListGet] = useState(false);
  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async () => {
    try {
      dispatch(rootLoader(true));
      const hResult = await UserList();
      if (hResult.success) {
        setUserList(hResult.data);
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
      console.log("error from getUserList", err);
    } finally {
      setListGet(true);
      dispatch(rootLoader(false));
    }
  };

  const makeCall = (mobile) => {
    const url = `tel:${mobile}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Phone dialer is not supported on this device");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate("ActivityList", { userId: item.id });
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View style={{ width: "90%" }}>
          <Text style={styles.itemText}>{item.name}</Text>
          <CTSpacer height={3} />
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              alignSelf: "flex-start",
            }}
          >
            {" "}
            {[item.city, item.state].filter(Boolean).join(", ")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            makeCall(item.mobile);
          }}
          style={{
            height: 35,
            width: 35,
            backgroundColor: colors.secondary,
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 5,
          }}
        >
          <Image
            source={call}
            style={{
              height: 30,
              width: 30,
              resizeMode: "contain",
              alignSelf: "center",
            }}
          />
        </TouchableOpacity>
      </View>
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
            width: "30%",
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
        <Text style={styles.headerText}>User List</Text>
        <View style={{ width: "33%" }}></View>
      </View>
      <CTSpacer height={10} />
      {userList.length > 0 ? (
        <FlatList
          data={userList}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : listGet ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ alignSelf: "center" }}>No user found</Text>
        </View>
      ) : null}
    </View>
  );
};

export default MrListScreen;

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
    flexDirection: "column",
  },
  itemText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "bold",
    marginLeft: 3,
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
