import React, { useState, useContext } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function PinComponent({ coordinate, story, likes = 0, pinId }) {
    const { token } = useContext(AuthContext);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);

    const handleLikePress = async () => {
        if (!token) {
            console.error('No token found');
            return;
        }
        console.log(token);
        try {
            if (!isLiked) {
                const response = await axios.put(`http://localhost:8080/pins/${pinId}/like`,
                null,
                {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 200) {
                    setIsLiked(true);
                    setLikeCount(likeCount + 1);
                }
            } else {
                const response = await axios.put(`http://localhost:8080/pins/${pinId}/unlike`, 
                null,
                {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 200) {
                    setIsLiked(false);
                    setLikeCount(likeCount - 1);
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    return (
        <Marker coordinate={coordinate} pinColor="#F26CA7" onCalloutPress={handleLikePress}>
            <Callout tooltip={true}>
                <View style={styles.calloutContainer}>
                    <Text style={styles.storyText}>{story}</Text>
                    <View style={styles.likesContainer}>
                        <TouchableOpacity onPress={handleLikePress}>
                            <Ionicons
                                name={isLiked ? 'heart' : 'heart-outline'}
                                size={20}
                                color={isLiked ? '#F26CA7' : '#888'}
                            />
                        </TouchableOpacity>
                        <Text style={styles.likesText}>{likeCount}</Text>
                    </View>
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
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    likesText: {
        fontWeight: '600',
        marginLeft: 5,
    },
});
