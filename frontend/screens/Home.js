import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropdownMenu from '../components/DropdownMenu';
import AddPinButton from '../components/AddPinButton';
import MapWithMarkers from '../components/MapWithMarkers';
import StoryModal from '../components/StoryModal';
import { jwtDecode } from 'jwt-decode';

export default function Home({ navigation }) {
    const [markers, setMarkers] = useState([]);
    const [addPinMode, setAddPinMode] = useState(false);
    const [newPinCoordinate, setNewPinCoordinate] = useState(null);
    const [storyModalVisible, setStoryModalVisible] = useState(false);
    const [storyText, setStoryText] = useState('');
    const [visibilityDuration, setVisibilityDuration] = useState('PERMANENT');
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    // Fetch token and pins on mount
    useEffect(() => {
        const loadTokenAndPins = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                if (storedToken) {
                    setToken(storedToken);
                    const decoded = jwtDecode(storedToken);
                    console.log(decoded);
                    setUserId(decoded.userId);
                    fetchAllPins(storedToken);
                } else {
                    console.log('No JWT token found');
                }
            } catch (error) {
                console.log('Error loading token:', error);
            }
        };
        loadTokenAndPins();
    }, []);

    const fetchAllPins = async (jwtToken) => {
        try {
            const response = await axios.get('http://localhost:8080/pins', {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setMarkers(response.data);
        } catch (error) {
            console.error('Error fetching pins:', error);
            Alert.alert('Error', 'Could not load pins.');
        }
    };

    const handleAddPinPress = () => {
        setAddPinMode(true);
        Alert.alert('Pin Placement', 'Tap on the map to place your new pin');
    };

    const handleMapPress = (e) => {
        if (addPinMode) {
            setNewPinCoordinate(e.nativeEvent.coordinate);
            setAddPinMode(false);
            setStoryModalVisible(true);
        }
    };

    const handleSavePin = async () => {
        if (!storyText.trim()) {
            Alert.alert('Error', 'Please enter a story');
            return;
        }
        if (!newPinCoordinate) {
            Alert.alert('Error', 'No coordinate for the pin');
            return;
        }
        if (!token) {
            Alert.alert('Error', 'No auth token found. Please log in first.');
            return;
        }

        try {
            const pinCreateDto = {
                userId,
                story: storyText,
                visibilityDuration,
                latitude: newPinCoordinate.latitude,
                longitude: newPinCoordinate.longitude,
            };

            const response = await axios.post('http://localhost:8080/pins', pinCreateDto, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const createdPin = response.data;
            setMarkers((prev) => [...prev, createdPin]);

            // Reset state
            setNewPinCoordinate(null);
            setStoryText('');
            setVisibilityDuration('PERMANENT');
            setStoryModalVisible(false);
        } catch (error) {
            console.error('Error creating pin:', error);
            Alert.alert('Error', 'Could not save pin to server.');
        }
    };

    return (
        <View style={styles.container}>
            <DropdownMenu navigation={navigation} />
            <AddPinButton onPress={handleAddPinPress} />
            <MapWithMarkers
                markers={markers}
                onMapPress={handleMapPress}
            />
            <StoryModal
                visible={storyModalVisible}
                storyText={storyText}
                setStoryText={setStoryText}
                visibilityDuration={visibilityDuration}
                setVisibilityDuration={setVisibilityDuration}
                onSave={handleSavePin}
                onCancel={() => {
                    setStoryModalVisible(false);
                    setNewPinCoordinate(null);
                    setVisibilityDuration('PERMANENT');
                    setStoryText('');
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
