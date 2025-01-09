// file: screens/Profile.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import DropdownMenu from "../components/DropdownMenu";

export default function Profile({ navigation }) {
  const [userInfo, setUserInfo] = useState({ email: "", role: "" });

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  useEffect(() => {
    const fetchUserInfoFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const decoded = jwtDecode(token);
          setUserInfo({
            email: decoded.email || "",
          });
        }
      } catch (err) {
        console.log("Error decoding token:", err);
      }
    };
    fetchUserInfoFromToken();
  }, []);

  return (
      <View style={styles.container}>
        {/* The same dropdown menu for quick nav */}
        <DropdownMenu navigation={navigation} />

        <Text style={styles.title}>User Profile</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Email: {userInfo.email}</Text>
        </View>
        <Button title="Log Out" onPress={handleLogout} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
