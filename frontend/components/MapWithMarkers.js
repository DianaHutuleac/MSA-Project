import React, { useState, useContext, useRef, useEffect } from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function MapWithMarkers({ markers, onMapPress }) {
  const { token } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    
    if (data.type === 'mapPress') {
      onMapPress(data);
    } else if (data.type === 'pinClick') {
      console.log(data);
      setSelectedPin(data);
      fetchPinLikeInfo(data.id, token);
    } else if (data.type === 'moreClick') {
      setModalVisible(true);
    }
  };

  const fetchPinLikeInfo = async (pinId, token) => {
    if (token) {
      try {
        const response = await axios.get(
          `http://localhost:8080/pins/${pinId}/like-info`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          console.log(response.data);
          setIsLiked(response.data.liked); // Set whether the pin is liked
          setLikeCount(response.data.numberOfLikes); // Set the like count
        }
      } catch (error) {
        console.error('Error fetching like info:', error);
      }
    }
  };
  

  const handleSendComment = () => {
    console.log('Comment:', commentText);
    setCommentText('');
  };

  const handleLikePress = async () => {
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      if (!isLiked) {
        const response = await axios.put(
          `http://localhost:8080/pins/${selectedPin.id}/like`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setIsLiked(true);
          setLikeCount(likeCount + 1);
        }
      } else {
        const response = await axios.put(
          `http://localhost:8080/pins/${selectedPin.id}/unlike`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setIsLiked(false);
          setLikeCount(likeCount - 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Leaflet Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html {
            margin: 0; padding: 0; height: 100%; width: 100%;
          }
          #map {
            height: 100%; width: 100%;
          }
          button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([45.755, 21.230], 14);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          const pinkPin = L.divIcon({
            html: \`
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="#F26CA7"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C8.68636 2 6 4.68636 6 8C6 11.8236 9.65227 16.2513 11.5091 18.5645C11.7441 18.8627 12.2559 18.8627 12.4909 18.5645C14.3477 16.2513 18 11.8236 18 8C18 4.68636 15.3136 2 12 2ZM12 10.2C10.5652 10.2 9.4 9.03484 9.4 7.6C9.4 6.16516 10.5652 5 12 5C13.4348 5 14.6 6.16516 14.6 7.6C14.6 9.03484 13.4348 10.2 12 10.2Z"></path>
              </svg>
            \`,
            className: '',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          });

          const markersData = ${JSON.stringify(markers)};

          markersData.forEach(marker => {
            const pin = L.marker(
              [marker.coordinates[1], marker.coordinates[0]],
              { icon: pinkPin }
            ).addTo(map);

            pin.bindPopup(\`
              <div style="text-align: left; max-width: 400px;">
                <div style="max-height: 150px; overflow-y: auto; margin-bottom: 10px;">
                  \${marker.story}
                </div>
                <div style="display: flex; align-items: center; justify-content: flex-end;">
                  <button onclick="morePin('\${marker.id}')">
                    <span style="font-size: 10px; color: #555;">React 💌</span>
                  </button>
                </div>
              </div>
            \`);

            pin.on('click', () => {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  ...marker,
                  type: 'pinClick'
                })
              );
            });
          });

          window.morePin = (id) => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'moreClick',
              id
            }));
          };

          map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapPress',
              latitude: lat,
              longitude: lng
            }));
          });
        </script>
      </body>
    </html>
  `;

  return (
    <>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        onMessage={handleWebViewMessage}
        style={styles.map}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedPin && (
              <>
                <Text style={styles.modalStoryText}>{selectedPin.story}</Text>
                <View style={styles.likeRow}>
                  <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
                    <Ionicons
                      name={isLiked ? 'heart' : 'heart-outline'}
                      size={24}
                      color={isLiked ? '#F26CA7' : '#888'}
                    />
                    <Text style={styles.likeText}>{likeCount}</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <Button title="Send" onPress={handleSendComment} />
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalStoryText: {
    fontSize: 16,
    marginBottom: 15,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
