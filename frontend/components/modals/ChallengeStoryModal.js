import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the X icon

export default function ChallengeStoryModal({
  visible,
  onClose,
  onSave,
  coordinates,
  activeChallenge,
  storyText,
  setStoryText,
}) {
  const handleSave = () => {
    if (!storyText.trim()) {
      alert("Story cannot be empty!");
      return;
    }
    if (!coordinates || coordinates.length !== 2) {
      alert("Coordinates are missing or invalid!");
      return;
    }
    if (!activeChallenge || !activeChallenge.id) {
      alert("No active challenge is available!");
      return;
    }

    onSave({
      story: storyText,
      latitude: coordinates[1],
      longitude: coordinates[0],
      challengeId: activeChallenge.id,
    });

    setStoryText("");
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* KeyboardAvoidingView for the keyboard */}
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* ScrollView for large text */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            {activeChallenge ? (
              <>
                <Text style={styles.modalTitle}>Active Challenge</Text>
                <Text style={styles.challengeText}>
                  {activeChallenge.theme}
                </Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  onChangeText={setStoryText}
                  value={storyText}
                  placeholder="Write your story for this challenge..."
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                  >
                    <Text style={styles.saveButtonText}>Submit Story</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : activeChallenge === "Not Found" ? (
              <Text style={styles.loadingText}>No Challenges Available.</Text>
            ) : (
              <Text style={styles.loadingText}>Loading Challenge...</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    // No center alignment, let ScrollView handle it
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10, // Ensures it appears above all other content
    padding: 5, // Add some padding for a larger touchable area
  },
  challengeText: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "500",
    color: "#555",
  },
  textInput: {
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    textAlignVertical: "top",
    minHeight: 80,
    maxHeight: 200,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#7E007B",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderColor: "#d9534f",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#d9534f",
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
