import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DropdownMenu({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const handleProfilePress = () => {
    setMenuVisible(false);
    navigation.navigate("Profile");
  };

  const handleHomePress = () => {
    setMenuVisible(false);
    navigation.navigate("Home");
  };

  return (
    <>
      {/* The hamburger button */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Ionicons name="menu" size={30} color="#fff" />
      </TouchableOpacity>

      {/* The dropdown */}
      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={handleHomePress}>
            <Ionicons
              name="home-outline"
              size={20}
              color="#2F4F4F"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleProfilePress}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color="#2F4F4F"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1000,
    backgroundColor: "#2F4F4F",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  dropdownMenu: {
    position: "absolute",
    top: 100, // Adjust to position below the button
    left: 20, // Align with the button
    backgroundColor: "rgba(255, 255, 255, 0.95)", // Neutral semi-transparent background
    borderRadius: 8,
    paddingVertical: 5,
    width: 150,
    borderColor: "#ccc", // Light gray border
    borderWidth: 1,
    shadowColor: "#000", // Subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android
    zIndex: 1100,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "transparent", // Transparent to match the dropdown
  },
  menuItemText: {
    color: "#2F4F4F", // Dark gray text for better visibility
    fontSize: 16,
  },
});
