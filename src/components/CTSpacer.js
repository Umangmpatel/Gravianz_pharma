import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const CTSpacer = ({ height = 10, width }) => {
    return <View style={{ height: width ? 0 : height, width: 0 }} />;
};

export default CTSpacer;

const styles = StyleSheet.create({});
