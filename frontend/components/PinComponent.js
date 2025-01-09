// components/PinComponent.js
import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';

export default function PinComponent({ coordinate, story, likes = 0 }) {
    return (
        <Marker coordinate={coordinate} pinColor="#F26CA7">
            <Callout>
                <View style={styles.calloutContainer}>
                    <Text style={styles.storyText}>{story}</Text>
                    <Text style={styles.likesText}>Likes: {likes}</Text>
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
    },
    storyText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    likesText: {
        fontWeight: '600',
    },
});
