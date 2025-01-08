import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

const PinComponent = ({ coordinate, story }) => {
    return (
        <Marker coordinate={coordinate} pinColor="#F26CA7">
            <Callout>
                <View style={styles.calloutContainer}>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.storyText}>{story}</Text>
                    </ScrollView>
                </View>
            </Callout>
        </Marker>
    );
};

const styles = StyleSheet.create({
    calloutContainer: {
        maxWidth: 250,
        maxHeight: 150, // Restrict the height of the Callout
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
