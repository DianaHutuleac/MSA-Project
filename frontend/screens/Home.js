import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import DropdownMenu from '../components/menus/DropdownMenu';
import AddPinButton from '../components/buttons/AddPinButton';
import MapWithMarkers from '../components/MapWithMarkers';
import StoryModal from '../components/modals/StoryModal';
import { AuthContext } from '../context/AuthContext';
import ChallengeStoryButton from '../components/buttons/ChallengeStoryButton';
import ChallengeStoryModal from '../components/modals/ChallengeStoryModal';

export default function Home({ navigation }) {
  const { token, userId } = useContext(AuthContext);
  const [markers, setMarkers] = useState([]);
  const [addPinMode, setAddPinMode] = useState(false);
  const [newPinCoordinate, setNewPinCoordinate] = useState(null);
  const [storyModalVisible, setStoryModalVisible] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [visibilityDuration, setVisibilityDuration] = useState('PERMANENT');
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [modalType, setModalType] = useState(null); // Tracks the type of modal to show

  useEffect(() => {
    if (token) {
      console.log("Token changed, fetching pins"); // Debug log

      fetchAllPins(token);
    }
  }, [token]);

  const fetchAllPins = async (jwtToken) => {
    console.log("Fetching pins with token:", jwtToken); // Debug log
    try {
      const response = await axios.get("http://localhost:8080/pins", {
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
    
  const fetchActiveChallenge = async () => {
    try {
      const response = await axios.get("http://localhost:8080/challenges/active", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setActiveChallenge(response.data);
      }
    } catch (error) {
      console.error("Error fetching active challenge:", error);
    }
  };
  

  const handleAddPinPress = () => {
    setAddPinMode(true);
    setModalType('normal'); // Prepare for a normal pin
    setStoryModalVisible(false); // Ensure modal is not visible initially
    Alert.alert('Pin Placement', 'Tap on the map to place your new pin');
  };

  const handleAddChallengePinPress = async () => {
    await fetchActiveChallenge(); // Ensure active challenge is loaded
    setAddPinMode(true);
    setModalType('challenge'); // Prepare for a challenge pin
    setStoryModalVisible(false); // Ensure modal is not visible initially
    Alert.alert('Challenge Pin', 'Tap on the map to place your challenge pin');
  };


  const handleMapPress = (e) => {
    if (addPinMode) {
      const { latitude, longitude } = e; // Directly access latitude and longitude from the event
      if (latitude !== undefined && longitude !== undefined) {
        setNewPinCoordinate([longitude, latitude]);
        setAddPinMode(false); // Disable pin mode after selecting coordinates
        setStoryModalVisible(true); // Open the appropriate modal
      } else {
        console.error('Invalid map press event:', e);
        Alert.alert('Error', 'Could not retrieve coordinates from map press.');
      }
    }
  };


  const handleSavePin = async (pinData) => {
    try {
      const response = await axios.post('http://localhost:8080/pins', pinData, {
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
      resetModal();
    } catch (error) {
      console.error('Error saving pin:', error);
      Alert.alert('Error', 'Could not save pin.');
    }
  };
  
  const resetModal = () => {
    setNewPinCoordinate(null);
    setStoryText('');
    setVisibilityDuration('PERMANENT');
    setModalType(null);
    setStoryModalVisible(false); // Close the modal
  };

  const handlePinSubmit = () => {
    const pinData = {
      userId,
      story: storyText,
      latitude: newPinCoordinate[1],
      longitude: newPinCoordinate[0],
      visibilityDuration: modalType === 'challenge' ? 'CHALLENGE' : visibilityDuration,
      ...(modalType === 'challenge' && { challengeId: activeChallenge.id }),
    };
    handleSavePin(pinData);
  };

  return (
    <View style={styles.container}>
      <DropdownMenu navigation={navigation} />
      <AddPinButton onPress={handleAddPinPress} />
      <ChallengeStoryButton onPress={handleAddChallengePinPress} />
      <MapWithMarkers
        markers={markers}
        onMapPress={handleMapPress}
        onPinPress={(pin) => Alert.alert('Pin Details', pin.story)}
      />
      {modalType === 'normal' && (
        <StoryModal
        visible={storyModalVisible}
          storyText={storyText}
          setStoryText={setStoryText}
          visibilityDuration={visibilityDuration}
          setVisibilityDuration={setVisibilityDuration}
          onSave={handlePinSubmit}
          onCancel={resetModal}
        />
      )}
      {modalType === 'challenge' && (
          <ChallengeStoryModal
          visible={storyModalVisible}
          onClose={resetModal}
          onSave={handlePinSubmit}
          coordinates={newPinCoordinate}
          activeChallenge={activeChallenge} // Pass activeChallenge here
          storyText={storyText}
          setStoryText={setStoryText}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
