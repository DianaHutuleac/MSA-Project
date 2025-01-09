import React from 'react';
import MapView from 'react-native-maps';
import PinComponent from './PinComponent';

export default function MapWithMarkers({ markers, addPinMode, onMapPress }) {
    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={{
                latitude: 45.7489,
                longitude: 21.2087,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
            onPress={onMapPress}
        >
            {markers.map((pin) => (
                <PinComponent
                    key={pin.id}
                    coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
                    story={pin.story}
                    likes={pin.numberOfLikes}
                />
            ))}
        </MapView>
    );
}
