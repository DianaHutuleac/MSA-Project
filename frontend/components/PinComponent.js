import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

const PinComponent = ({ coordinate, story }) => {
    return (
        <Marker
            coordinate={coordinate}
            pinColor="#F26CA7"
            title={"Story Pin"}
            description={story}
        />
    );
};

const styles = StyleSheet.create({
    calloutContainer: {
        maxWidth: 250,
        height: 'auto',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        elevation: 5,
    },
    scrollView: {
        flex: 1,
    },
    storyText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});

export default PinComponent;
