import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { activityList, rootLoader } from "../../actions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { colors } from "../../utils/colors";
import { leftArrowIcon } from "../../assets/icons";
import CTSpacer from "../../components/CTSpacer";
import { StackActions } from "@react-navigation/native";
import { RESET_USER } from "../../utils/reduxConstant";

const ActivityList = ({ route, navigation }) => {
  const { userId } = route.params;
  const dispatch = useDispatch();
  const [userList, setUserList] = useState([]);
  const insets = useSafeAreaInsets();
  const [listGet, setListGet] = useState(false);

  useEffect(() => {
    if (userId) {
      getActivityList(userId);
    }
  }, [userId]);

  const getActivityList = async (userId) => {
    try {
      const data = {
        user_id: userId,
      };
      dispatch(rootLoader(true));
      const hResult = await activityList(data);
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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.doctorDetail}>Doctor name: {item.doctor_name}</Text>
      <Text style={styles.doctorDetail}>
        Category name: {item.category_name || "-"}
      </Text>
      <Text style={styles.doctorDetail}>
        Date and time: {item.activity_datetime || "-"}
      </Text>
      <Text style={styles.doctorDetail}>Address: {item.address || "-"}</Text>
      <Text style={styles.doctorDetail}>
        Helper name: {item.helper_name == 0 ? "self" : item.helper_name || "-"}
      </Text>
    </View>
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
        <Text style={styles.headerText}>User Activity</Text>
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
          <Text style={{ alignSelf: "center" }}>No activity found</Text>
        </View>
      ) : null}
    </View>
  );
};

export default ActivityList;

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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 5,
  },
});
