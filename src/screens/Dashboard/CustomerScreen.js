import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { add, leftArrow, leftArrowIcon } from "../../assets/icons";
import { colors } from "../../utils/colors";
import { getDoctorList, rootLoader, tokenExpire } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import CTSpacer from "../../components/CTSpacer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DeviceInfo from "react-native-device-info";
import { StackActions } from "@react-navigation/native";
import { RESET_USER } from "../../utils/reduxConstant";

const CustomerScreen = ({ navigation }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [doctorData, setDoctorData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [listGet, setListGet] = useState(false);
  const isTablet = DeviceInfo.isTablet();
  const deviceType = DeviceInfo.getDeviceType();
  console.log("Is Tablet:", isTablet);
  console.log("Device Type:", deviceType);
  console.log("Platform:", Platform.OS);
  useEffect(() => {
    getDorctoreList();
  }, []);
  const getDorctoreList = async () => {
    setLoadMore(false);
    let data = {
      page: page,
      user_id: userInfo.id,
    };
    {
      page == 1 && dispatch(rootLoader(true));
    }
    const hResult = await getDoctorList(data);
    if (hResult.success) {
      const currentPage = hResult?.pagination?.current_page ?? null;
      const currentData = hResult.data || [];
      const totalPages = hResult.pagination?.total_pages;
      if (currentPage == 1) {
        setDoctorData(hResult.data);
      } else {
        setDoctorData((prevList) => [...prevList, ...hResult.data]);
      }
      // if (currentData.length > 9){
      //   setLoadMore(true)
      // }
      if (currentPage < totalPages) {
        setLoadMore(true);
      } else {
        setLoadMore(false);
      }

      setPage((prevPage) => prevPage + 1);
      dispatch(rootLoader(false));
      setLoading(false);
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
      setLoading(false);
      dispatch(rootLoader(false));
    }
    setListGet(true);
  };

  const renderDoctorItem = ({ item }) => (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        flexDirection: isTablet ? "row" : "column",
        justifyContent: isTablet ? "space-between" : "flex-start",
      }}
    >
      {/* Doctor Section */}
      <View style={{ flex: isTablet ? 1 : 0, marginRight: isTablet ? 20 : 0 }}>
        <Text style={styles.sectionTitle}>Doctor</Text>
        <Text style={styles.doctorDetail}>Name: {item.doctor_name}</Text>
        <Text style={styles.doctorDetail}>Speciality: {item.speciality}</Text>
        <Text style={styles.doctorDetail}>
          Hospital Name: {item.hospital_name}
        </Text>
        <Text style={styles.doctorDetail}>Market Area: {item.market_area}</Text>
        <Text style={styles.doctorDetail}>Frequency: {item.frequency}</Text>
        <Text style={styles.doctorDetail}>
          Contact Number: {item.contact_number}
        </Text>
      </View>

      {/* Chemist Section */}
      <View style={{ flex: isTablet ? 1 : 0 }}>
        <CTSpacer height={isTablet ? 0 : 15} />
        <Text style={styles.sectionTitle}>Chemist</Text>
        <Text style={styles.doctorDetail}>Name: {item.chemist_name}</Text>
        <Text style={styles.doctorDetail}>
          Shop Name: {item.shop_name || "-"}
        </Text>
        <Text style={styles.doctorDetail}>State: {item.state || "-"}</Text>
        <Text style={styles.doctorDetail}>City: {item.city || "-"}</Text>
      </View>
    </View>
  );
  const _handleLoadMore = () => {
    if (loading || !loadMore) return;
    setLoading(true);
    getDorctoreList();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
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
        <Text style={styles.headerText}>Customer</Text>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => {
            navigation.navigate("AddCustomerScreen");
          }}
        >
          <Image source={add} style={styles.headerImage} />
        </TouchableOpacity>
      </View>
      <CTSpacer height={15} />
      {doctorData.length > 0 ? (
        <FlatList
          data={doctorData}
          renderItem={renderDoctorItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          onEndReachedThreshold={0.5}
          onEndReached={_handleLoadMore}
          bounces={false}
          ListFooterComponent={
            loading ? (
              <View style={{}}>
                <ActivityIndicator
                  size="large"
                  color={colors.secondary}
                  style={{ marginVertical: 15 }}
                />
              </View>
            ) : null
          }
        />
      ) : listGet ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ alignSelf: "center" }}>No Customer found</Text>
        </View>
      ) : null}
    </View>
  );
};

export default CustomerScreen;

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  listContainer: {
    padding: 15,
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
  section: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 5,
  },
});
