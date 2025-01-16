import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChallengeStoryButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.addPinButton} onPress={onPress}>
      <Ionicons name="medal-outline" size={30} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addPinButton: {
    position: "absolute",
    bottom: 160,
    right: 20,
    backgroundColor: "#7E007B",
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
