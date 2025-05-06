import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ImageViewer from "react-native-image-zoom-viewer";
import { productList, rootLoader } from "../../actions";
import { colors } from "../../utils/colors";
import { close1 } from "../../assets/icons";
import SelfModal from "../../components/SelfModal";
import { RESET_USER } from "../../utils/reduxConstant";
import { StackActions } from "@react-navigation/native";

const ProductList = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { categoryId, DrId, navigationFrom } = route.params || {};
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selection, setSelection] = useState(false);
    const [dataLoad, setDataLoad] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(false);
    useEffect(() => {
        if (categoryId) {
            getProductList();
        }
    }, [categoryId]);

    const getProductList = async () => {
        const data = {
            category_id: categoryId,
        };

        dispatch(rootLoader(true));
        const hResult = await productList(data);

        if (hResult.success && hResult.data?.length > 0) {
            const formattedImages = hResult.data
                .filter((item) => item.pdf_image)
                .map((item) => ({
                    url: item.pdf_image,
                }));

            setImages(formattedImages);
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
        setDataLoad(true);
        dispatch(rootLoader(false));
    };

    const handleImageTap = () => {
        if (navigationFrom === "FileDCR" && currentIndex === images.length - 1) {
            setShowCloseButton(false); // Hide on last image for FileDCR
        } else {
            setShowCloseButton((prev) => !prev); // Toggle visibility for all other cases
        }
    };

    // Hide close button when swiping to a new image
    const handleImageChange = (index) => {
        setCurrentIndex(index);
        // Hide close button if not on the first image or on the last image
        if (index !== 0 || index === images.length - 1) {
            setShowCloseButton(false);
        }
    };

    return (
        <>
            <View style={styles.container}>
                {images.length > 0 ? (
                    <>
                        <ImageViewer
                            imageUrls={images}
                            backgroundColor="black"
                            enableImageZoom={true}
                            loadingRender={() => (
                                <ActivityIndicator
                                    size="large"
                                    color={colors.white}
                                    style={styles.loader}
                                />
                            )}
                            // onChange={(index) => setCurrentIndex(index)}
                            onChange={handleImageChange}
                            onClick={handleImageTap}
                        />
                        {showCloseButton && (
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.endMessage}
                            >
                                <Image
                                    source={close1}
                                    style={{ height: 30, width: 30, resizeMode: "contain" }}
                                />
                            </TouchableOpacity>
                        )}
                        {currentIndex === images.length - 1 &&
                            navigationFrom === "FileDCR" && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelection(true);
                                    }}
                                    style={styles.endMessage}
                                >
                                    <Image
                                        source={close1}
                                        style={{ height: 30, width: 30, resizeMode: "contain" }}
                                    />
                                </TouchableOpacity>
                            )}
                    </>
                ) : dataLoad ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No images available</Text>
                    </View>
                ) : null}
            </View>
            <SelfModal
                isVisible={selection}
                setIsVisible={setSelection}
                categoryId={categoryId}
                DrId={DrId}
                navigation={navigation}
            />
        </>
    );
};

export default ProductList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    closeButtonText: {
        color: colors.secondary,
        fontSize: 16,
        fontWeight: "bold",
    },
    closeButton: {
        position: "absolute",
        top: 20,
        right: 15,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 5,
        zIndex: 10,
    },
    endMessage: {
        position: "absolute",
        top: 20,
        right: 15,
        alignItems: "center",
        padding: 10,
        height: 40,
        justifyContent: "center",
        width: 40,
        borderColor: colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "white",
    },
    endText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 18,
        color: "#666",
    },
});
