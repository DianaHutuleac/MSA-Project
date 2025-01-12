import React, { useState, useContext } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PinModal from './PinModal';

export default function PinComponent({ coordinate, story, likes = 0, pinId }) {
  const { token } = useContext(AuthContext);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [modalVisible, setModalVisible] = useState(false);

  if (!coordinate || !story || !pinId) {
    console.error('Invalid props provided to PinComponent');
    return null;
  }

  const handleLikePress = async () => {
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const url = `http://10.0.2.2:8080/pins/${pinId}/${isLiked ? 'unlike' : 'like'}`;
      const response = await axios.put(url, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleMorePress = () => {
    console.log("test");
    setTimeout(() => setModalVisible(true), 100); // Add a 100ms delay
  };

  const handleCloseModal = () => {

    setModalVisible(false);
  };

  const handleSendComment = async (commentText) => {
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      // Uncomment and configure when backend is ready
      // await axios.post(
      //   `http://10.0.2.2:8080/pins/${pinId}/comments`,
      //   { text: commentText },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      console.log('Comment sent:', commentText);
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };

  return (
    <Marker coordinate={coordinate} pinColor="#F26CA7" onCalloutPress={handleMorePress}>
      <Callout tooltip={true}>
        <View style={styles.calloutContainer}>
          <Text style={styles.storyText}>{story}</Text>
          <View style={styles.interactContainer}>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color="#888"
              style={styles.moreIcon}
            />
          </View>
        </View>
      </Callout>

      <PinModal
        story={story}
        isLiked={isLiked}
        likeCount={likeCount}
        modalVisible={modalVisible}
        onClose={handleCloseModal}
        onLikePress={handleLikePress}
        onSendComment={handleSendComment}
      />
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
    marginBottom: 10,
  },
  interactContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },
  moreIcon: {
    marginLeft: 5,
  },
});
