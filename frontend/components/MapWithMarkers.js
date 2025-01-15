import React, { useState, useContext, useRef, useEffect } from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PinModal from './modals/PinModal';

export default function MapWithMarkers({ markers, onMapPress }) {
  const { token, userId } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [winnerPin, setWinnerPin] = useState(null);

  useEffect(() => {
    fetchLastProcessedWinner();
  }, []);

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    
    if (data.type === 'mapPress') {
      onMapPress(data);
    } else if (data.type === 'pinClick') {
      console.log(data);
      setSelectedPin(data);
    } else if (data.type === 'moreClick') {
      setModalVisible(true);
    }
  }; 

  const fetchLastProcessedWinner = async () => {
    try {
      // Endpoint must match your backend route
      // e.g. GET /challenges/last-processed/winner
      const response = await axios.get(
        'http://172.20.10.4:8080/challenges/last-processed/winner',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setWinnerPin(response.data); // store the PinResponseDto
    } catch (error) {
      console.error('Error fetching last processed winner:', error);
      // Optional: Alert user or silently fail
      // Alert.alert('Error', 'Could not fetch last processed challenge winner.');
    }
  };

  const winnerIdString = winnerPin ? winnerPin.id.toString() : 'null';

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
          const map = L.map('map', {zoomControl: false}).setView([45.755, 21.230], 14);

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

          const challengePin = L.divIcon({
            html: \`
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="#7E007B"
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

          const goldWinnerPin = L.divIcon({
            html: \`
              <svg width="60" height="60" viewBox="0 0 24 24" fill="gold"
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.68636 2 6 4.68636 6 8C6 
                         11.8236 9.65227 16.2513 11.5091 
                         18.5645C11.7441 18.8627 12.2559 
                         18.8627 12.4909 18.5645C14.3477 
                         16.2513 18 11.8236 18 8C18 4.68636 
                         15.3136 2 12 2ZM12 10.2C10.5652 
                         10.2 9.4 9.03484 9.4 7.6C9.4 6.16516 
                         10.5652 5 12 5C13.4348 5 14.6 
                         6.16516 14.6 7.6C14.6 9.03484 13.4348 
                         10.2 12 10.2Z"/>
              </svg>
            \`,
            className: '',
            iconSize: [60, 60],
            iconAnchor: [30, 60],
            popupAnchor: [0, -60],
          });


          const markersData = ${JSON.stringify(markers)};
          const WINNER_ID = "${winnerIdString}";

          markersData.forEach(marker => {
            const pinIcon = marker.challengeId ? challengePin : pinkPin;

            if (marker.id.toString() === WINNER_ID) {
              pinIcon = goldWinnerPin;
            }
            
            const pin = L.marker(
              [marker.coordinates[1], marker.coordinates[0]],
              { icon: pinIcon }
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

        <PinModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedPin(null);
          }}
          pin={selectedPin}
          token={token}
          userId={userId}
        />
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
    height: '60%',
    borderRadius: 10,
    padding: 20,
  },
  storyScrollView: {
    maxHeight: 200, // Adjust height to fit the modal
    backgroundColor: '#f9f9f9', // Light background for contrast
    borderRadius: 12, // Rounded corners
    padding: 15, // Space inside the box
    shadowColor: '#000', // Subtle shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  modalStoryText: {
    fontSize: 16,
    lineHeight: 24, // Increase line spacing for better readability
    color: '#333', // Dark gray for the text
    fontFamily: 'System', // You can change this to a custom font if desired
  },  
  closeIcon: {
    position: 'absolute',
    top: 1,
    right: 1,
    zIndex: 1,
  },
  interactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
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
  
  commentSection: {
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
    textAlign: 'center', // Center the title
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    flex: 1,
    minHeight: 50, // Increased minimum height
    maxHeight: 120, // Slightly higher maximum height
    multiline: true,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9', // Matches the aesthetic of the story and comment sections
  },
  commentList: {
    maxHeight: 100, // Limit height to avoid overflowing
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  commentItem: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10, // Spacing between comments
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

