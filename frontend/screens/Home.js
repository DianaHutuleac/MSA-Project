import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import DropdownMenu from '../components/DropdownMenu';
import AddPinButton from '../components/AddPinButton';
import MapWithMarkers from '../components/MapWithMarkers';
import StoryModal from '../components/StoryModal';
import { AuthContext } from '../context/AuthContext';

export default function Home({ navigation }) {
  const { token, userId } = useContext(AuthContext);
  const [markers, setMarkers] = useState([]);
  const [addPinMode, setAddPinMode] = useState(false);
  const [newPinCoordinate, setNewPinCoordinate] = useState(null);
  const [storyModalVisible, setStoryModalVisible] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [visibilityDuration, setVisibilityDuration] = useState('PERMANENT');

  useEffect(() => {
    if (token) {
      console.log("Token changed, fetching pins"); // Debug log

      fetchAllPins(token);
    }
  }, [token]);

  const fetchAllPins = async (jwtToken) => {
    console.log("Fetching pins with token:", jwtToken); // Debug log
    try {
      const response = await axios.get("http://10.0.2.2:8080/pins", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const fetchedMarkers = response.data.map((pin) => ({
        id: pin.id,
        coordinates: [pin.longitude, pin.latitude],
        story: pin.story,
        likeCount: pin.numberOfLikes || 0,
      }));
      console.log("Fetched Markers:", fetchedMarkers); // Debug log
      setMarkers(fetchedMarkers);
    } catch (error) {
      console.error("Error fetching pins:", error);
      Alert.alert("Error", "Could not load pins.");
    }
  };
  

  const handleAddPinPress = () => {
    setAddPinMode(true);
    Alert.alert('Pin Placement', 'Tap on the map to place your new pin');
  };

  const handleMapPress = (e) => {
    if (addPinMode) {
      const { latitude, longitude } = e; // Directly access latitude and longitude from the event
      if (latitude !== undefined && longitude !== undefined) {
        setNewPinCoordinate([longitude, latitude]);
        setAddPinMode(false);
        setStoryModalVisible(true);
      } else {
        console.error('Invalid map press event:', e);
        Alert.alert('Error', 'Could not retrieve coordinates from map press.');
      }
    }
  };
  
  

  const handleSavePin = async () => {
    console.log('User ID:', userId); // Debug log
    console.log('Auth Token:', token); // Debug log
    console.log('New Pin Coordinates:', newPinCoordinate); // Debug log
  
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
        userId, // Ensure this is passed correctly
        story: storyText,
        visibilityDuration,
        latitude: newPinCoordinate[1],
        longitude: newPinCoordinate[0],
      };
  
      console.log('Pin Create DTO:', pinCreateDto); // Debug log
  
      const response = await axios.post('http://10.0.2.2:8080/pins', pinCreateDto, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const createdPin = {
        id: response.data.id,
        coordinates: [response.data.longitude, response.data.latitude],
        story: response.data.story,
        isLiked: false,
        likeCount: response.data.numberOfLikes || 0,
      };
  
      setMarkers((prev) => [...prev, createdPin]);
      setNewPinCoordinate(null);
      setStoryText('');
      setVisibilityDuration('PERMANENT');
      setStoryModalVisible(false);
    } catch (error) {
      console.error('Error creating pin:', error);
      Alert.alert('Error', 'Could not save pin to server.');
    }
  };
  

  const handlePinPress = (pin) => {
    Alert.alert('Pin Details', pin.story);
  };

  return (
    <View style={styles.container}>
      <DropdownMenu navigation={navigation} />
      <AddPinButton onPress={handleAddPinPress} />
      <MapWithMarkers
        markers={markers}
        onMapPress={handleMapPress}
        onPinPress={handlePinPress}
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
