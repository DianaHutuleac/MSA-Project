import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownMenu from "../components/menus/DropdownMenu";
import PinModal from "../components/modals/PinModal";

export default function MyPins({ navigation }) {
  const { token, userId } = useContext(AuthContext);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  // For modal usage:
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await axios.get(
          `http://172.20.10.4:8080/pins/all-pins-for-user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPins(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pins:", error);
        setLoading(false);
      }
    };
    fetchPins();
  }, [userId, token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  // Pressing a pin sets selectedPin & opens the modal
  const handlePinPress = (pin) => {
    console.log("User tapped pin:", pin);
    setSelectedPin(pin);
    setModalVisible(true);
  };

  // Helper to format date
  const formatDate = (isoDateString) => {
    // You can do something more fancy if you like
    const date = new Date(isoDateString);
    return date.toLocaleString(); // e.g. "1/15/2025, 21:44:56 PM"
  };

  return (
    <SafeAreaView style={styles.container}>
      <DropdownMenu navigation={navigation} />
      <Text style={styles.title}>My Pins</Text>

      {pins.length > 0 ? (
        <FlatList
          data={pins}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.pinItem}
              onPress={() => handlePinPress(item)}
            >
              <Text style={styles.storyText}>{item.story}</Text>
              {/* Date */}
              <Text style={styles.infoText}>
                Created: {formatDate(item.createdAt)}
              </Text>
              {/* Coordinates */}
              <Text style={styles.infoText}>
                Lat: {item.latitude.toFixed(5)}, Lng:{" "}
                {item.longitude.toFixed(5)}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noPinsText}>No pins found</Text>
      )}

      {/* Re-usable PinModal */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fffff9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  pinItem: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#2F4F4F", // dark background
    // optional shadow or elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  storyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // white text
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#fff", // also white text
    marginBottom: 4,
  },

  noPinsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
});
