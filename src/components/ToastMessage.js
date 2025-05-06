import Toast from 'react-native-toast-message';

export const AlertDialog = async title => {
    await Toast.hide();
    Toast.show({
        type: 'error',
        text1: title,
        position: 'bottom',
        swipeable: false,
        visibilityTime: 3000,
    });
};
export const InfoDialog = async title => {
    await Toast.hide();
    Toast.show({
        type: 'info',
        text1: title,
        position: 'bottom',
        swipeable: false,
        visibilityTime: 3000,
    });
};
export const SuccessDialog = async title => {
    await Toast.hide();
    Toast.show({
        type: 'success',
        text1: title,
        position: 'bottom',
        swipeable: false,
        visibilityTime: 3000,
    });
};