import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddPinButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.addPinButton} onPress={onPress}>
      <Ionicons name="add" size={30} color="#333" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addPinButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#fffff0",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
