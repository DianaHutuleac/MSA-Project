import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    Modal,
    TextInput,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // import AsyncStorage
import PinComponent from '../components/PinComponent';
import DropdownMenu from '../components/DropdownMenu';
import {jwtDecode} from "jwt-decode";

export default function Home({ navigation }) {
    const [markers, setMarkers] = useState([]);
    const [addPinMode, setAddPinMode] = useState(false);
    const [newPinCoordinate, setNewPinCoordinate] = useState(null);

    // States for the story modal
    const [storyModalVisible, setStoryModalVisible] = useState(false);
    const [storyText, setStoryText] = useState('');
    const [visibilityDuration, setVisibilityDuration] = useState('PERMANENT');
    const [userId, setUserId] = useState(1);
    // We'll store the token in state so we can use it in axios calls
    const [token, setToken] = useState(null);

    // ---------------- LOAD TOKEN & FETCH PINS ON MOUNT ----------------
    useEffect(() => {
        const loadTokenAndPins = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                if (storedToken) {
                    setToken(storedToken);

                    const decoded = jwtDecode(storedToken);
                    // e.g. const userId = decoded.sub or decoded.userId
                    setUserId(decoded.userId);

                    fetchAllPins(storedToken);
                } else {
                    console.log('No JWT token found, user might not be logged in');
                }
            } catch (err) {
                console.log('Error loading token from AsyncStorage:', err);
            }
        };

        loadTokenAndPins();
    }, []);

    const fetchAllPins = async (jwtToken) => {
        try {
            const response = await axios.get('http://10.0.2.2:8080/pins', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            setMarkers(response.data);
        } catch (error) {
            console.error('Error fetching pins:', error);
            Alert.alert('Error', 'Could not load pins from server.');
        }
    };

    // ---------------- ADD PIN FLOW ----------------
    const handleAddPinPress = () => {
        setAddPinMode(true);
        Alert.alert('Pin Placement', 'Tap on the map to place your new pin');
    };

    const handleMapPress = (e) => {
        if (addPinMode) {
            const coordinate = e.nativeEvent.coordinate;
            setNewPinCoordinate(coordinate);
            setAddPinMode(false);
            setStoryModalVisible(true);
        }
    };

    // Save pin to server
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
                userId: userId,
                story: storyText,
                visibilityDuration: visibilityDuration,
                latitude: newPinCoordinate.latitude,
                longitude: newPinCoordinate.longitude,
            };

            const response = await axios.post(
                'http://10.0.2.2:8080/pins',
                pinCreateDto,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // include the token here
                    },
                }
            );
            const createdPin = response.data;

            // Add new pin to state
            setMarkers((prev) => [...prev, createdPin]);

            // Reset
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

            <TouchableOpacity style={styles.addPinButton} onPress={handleAddPinPress}>
                <Ionicons name="add" size={30} color="#333" />
            </TouchableOpacity>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 45.7489,
                    longitude: 21.2087,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                onPress={handleMapPress}
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

            <Modal
                transparent={true}
                visible={storyModalVisible}
                animationType="slide"
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Enter your story</Text>
                        <TextInput
                            style={styles.textInput}
                            multiline
                            numberOfLines={4}
                            onChangeText={setStoryText}
                            value={storyText}
                            placeholder="What's the story behind this pin?"
                        />

                        <Text style={styles.label}>Visibility Duration:</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={visibilityDuration}
                                onValueChange={(itemValue) => setVisibilityDuration(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="1 Day" value="DAY" />
                                <Picker.Item label="1 Week" value="WEEK" />
                                <Picker.Item label="1 Month" value="MONTH" />
                                <Picker.Item label="Permanent" value="PERMANENT" />
                            </Picker>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSavePin}
                            >
                                <Text style={{ color: '#fff' }}>Save Pin</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setStoryModalVisible(false);
                                    setStoryText('');
                                    setNewPinCoordinate(null);
                                    setVisibilityDuration('PERMANENT');
                                }}
                            >
                                <Text style={{ color: '#fff' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    addPinButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: '#fffff0',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '600',
    },
    textInput: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        marginBottom: 10,
        textAlignVertical: 'top',
    },
    label: {
        marginBottom: 5,
        fontWeight: '600',
    },
    pickerWrapper: {
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        marginBottom: 15,
    },
    picker: {
        width: '100%',
        height: 40,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
});
