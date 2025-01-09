// file: screens/Home.js
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import PinComponent from '../components/PinComponent';
import DropdownMenu from '../components/DropdownMenu'; // import the new menu

export default function Home({ navigation }) {
    // Example marker data
    const [markers, setMarkers] = useState([
        {
            id: 1,
            coordinate: { latitude: 45.7519, longitude: 21.2234 },
            story: 'Our first house: full of patches and surprises. Just like us. Nothing is straight here. Life isn’t always about happiness, it’s also about building and fixing things. And being with both of you.',
        },
        {
            id: 2,
            coordinate: { latitude: 45.7525, longitude: 21.23 },
            story: 'User Story 2 here. Another sample.',
        },
    ]);

    return (
        <View style={styles.container}>
            {/* Use the dropdown menu here (on top of everything). */}
            <DropdownMenu navigation={navigation} />

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
});
