// file: components/PinComponent.js
import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';

export default function PinComponent({ coordinate, story }) {
    return (
        <Marker coordinate={coordinate} pinColor="#F26CA7">
            {/* The custom callout bubble */}
            <Callout tooltip={false}>
                <View style={styles.calloutContainer}>
                    <Text style={styles.storyText}>{story}</Text>
                </View>
            </Callout>
        </Marker>
    );
}

const styles = StyleSheet.create({
    calloutContainer: {
        maxWidth: 250,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        elevation: 5,
    },
    storyText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});
