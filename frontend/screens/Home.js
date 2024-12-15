import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function Home({ navigation }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const openListener = navigation.addListener('drawerOpen', () => {
      setIsDrawerOpen(true);
    });

    const closeListener = navigation.addListener('drawerClose', () => {
      setIsDrawerOpen(false);
    });

    // Cleanup listeners on unmount
    return () => {
      openListener();
      closeListener();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {!isDrawerOpen && ( // Only show button when drawer is closed
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
        <Marker
          coordinate={{ latitude: 45.7519, longitude: 21.2234 }}
          pinColor="gold"
          title="Pin of the Week"
          description="This is the most liked story of the week!"
        />
        <Marker
          coordinate={{ latitude: 45.7530, longitude: 21.2105 }}
          pinColor="red"
          title="Challenge"
          description="Participate in the current challenge here!"
        />
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
