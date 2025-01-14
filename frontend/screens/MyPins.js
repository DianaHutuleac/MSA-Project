import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function MyPins() {
  const { token, userId } = useContext(AuthContext);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/pins/all-pins-for-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Pins</Text>
      {pins.length > 0 ? (
        <FlatList
          data={pins}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.pinItem}>
              <Text style={styles.pinStory}>{item.story}</Text>
              <Text style={styles.pinDetails}>
                Latitude: {item.latitude}, Longitude: {item.longitude}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noPinsText}>No pins found</Text>
      )}
    </View>
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
    padding: 10,
    backgroundColor: "#e3e3e3",
    borderRadius: 8,
  },
  pinStory: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  pinDetails: {
    fontSize: 14,
    color: "#555",
  },
  noPinsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
});
