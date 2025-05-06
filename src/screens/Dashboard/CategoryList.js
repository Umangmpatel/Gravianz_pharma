import {
    StyleSheet,
    Text,
    View,
    FlatList,
    StatusBar,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { productCategories, rootLoader } from "../../actions";
import { useDispatch } from "react-redux";
import { colors } from "../../utils/colors";
import CTSpacer from "../../components/CTSpacer";
import { StackActions, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { leftArrowIcon } from "../../assets/icons";
import { RESET_USER } from "../../utils/reduxConstant";

const CategoryList = ({ navigation }) => {
    const route = useRoute();
    const { DrId = null, navigationFrom = "Category" } = route.params || {};
    const insets = useSafeAreaInsets();

    const dispatch = useDispatch();
    const [categoryList, setCategoryList] = useState([]);
    const [listGet, setListGet] = useState(false);
    useEffect(() => {
        getCategoryList();
    }, []);

    const getCategoryList = async () => {
        dispatch(rootLoader(true));
        const hResult = await productCategories();
        if (hResult.success) {
            setCategoryList(hResult.data);
            dispatch(rootLoader(false));
        } else {
            if (hResult.code == 101) {
                              Alert.alert('Session Expired', 'Your login detected on another device', [
                                {
                                  text: 'Yes',
                                  onPress: () => {
                                     navigation.dispatch(StackActions.replace('AuthStack'));
                                    dispatch({ type: RESET_USER });
                                  },
                                },
                              ]);
                            }
            dispatch(rootLoader(false));
        }
        setListGet(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
                navigation.navigate("ProductList", {
                    categoryId: item.id,
                    DrId: DrId,
                    navigationFrom: navigationFrom,
                });
            }}
        >
            <Text style={styles.itemText}>{item.category_name}</Text>
        </TouchableOpacity>
    );

    return (
        <View
            style={{
                flex: 1,
                color: colors.white,
                paddingBottom: insets.bottom,
            }}
        >
            <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
            <SafeAreaView style={{ backgroundColor: colors.secondary }} />
            <View style={styles.header}>
                     <View style={{
                                  height: 40,
                                  width: '30%',
                                  justifyContent: "center",
                                  marginLeft: 15,
                                }}>
                                  <TouchableOpacity
                                    style={{
                                      height: 40,
                                      width: 40,
                                      justifyContent: "center",
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
                <Text style={styles.headerText}>Category List</Text>
                  <View style={{width:'33%'}}></View>
            </View>
            <CTSpacer height={10} />
            {categoryList.length > 0 ? (
                <FlatList
                    data={categoryList}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            ) : listGet ? (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{ alignSelf: "center" }}>No category found</Text>
                </View>
            ) : null}
        </View>
    );
};

export default CategoryList;

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
        width: '100%'
    },
    headerText: {
        color: colors.white,
        fontWeight: "bold",
        fontSize: 20,
        alignSelf: "center",
    },
});
