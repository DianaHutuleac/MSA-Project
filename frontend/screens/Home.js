import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import PinComponent from '../components/PinComponent';

export default function Home({ navigation }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Example marker data
  const [markers, setMarkers] = useState([
    {
      id: 1,
      coordinate: { latitude: 45.7519, longitude: 21.2234 },
      story: 'User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1User Story 1',
    },
    {
      id: 2,
      coordinate: { latitude: 45.7525, longitude: 21.2300 },
      story: 'User Story 2',
    },
  ]);

  useEffect(() => {
    const openListener = navigation.addListener('drawerOpen', () => {
      setIsDrawerOpen(true);
    });

    const closeListener = navigation.addListener('drawerClose', () => {
      setIsDrawerOpen(false);
    });

    return () => {
      openListener();
      closeListener();
    };
  }, [navigation]);

  return (
      <View style={styles.container}>
        {!isDrawerOpen && (
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.openDrawer()}
            >
              <Ionicons name="menu" size={30} color="black" />
            </TouchableOpacity>
        )}

        <MapView
            style={styles.map}
            initialRegion={{
              latitude: 45.7489,
              longitude: 21.2087,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
            zoomEnabled={true}
            scrollEnabled={true}
            showsCompass={true}
        >
          {markers.map((marker) => (
              <PinComponent
                  key={marker.id}
                  coordinate={marker.coordinate}
                  story={marker.story}
              />
          ))}
        </MapView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    backgroundColor: '#fffff0',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});