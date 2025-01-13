import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function ChallengeStoryModal({
  visible,
  onClose,
  onSave,
  coordinates,
  activeChallenge, // Pass activeChallenge as a prop
}) {
  const [storyText, setStoryText] = useState("");

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

    setStoryText(""); // Reset input
    onClose(); // Close modal
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          {activeChallenge ? (
            <>
              <Text style={styles.modalTitle}>Active Challenge</Text>
              <Text style={styles.challengeText}>{activeChallenge.theme}</Text>
              <TextInput
                style={styles.textInput}
                multiline
                onChangeText={setStoryText}
                value={storyText}
                placeholder="Write your story for this challenge..."
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Submit Story</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.loadingText}>Loading Challenge...</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
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
    minHeight: 100,
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
