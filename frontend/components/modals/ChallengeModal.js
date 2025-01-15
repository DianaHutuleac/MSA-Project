import React from "react";
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  Button, 
  TextInput, 
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ChallengeModal({
  isVisible,
  onClose,
  challengeTheme,
  setChallengeTheme,
  startDateTime,
  setStartDateTime,
  onCreate,
}) {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Challenge</Text>
            <TextInput
              style={styles.input}
              placeholder="Challenge Theme"
              value={challengeTheme}
              onChangeText={setChallengeTheme}
            />
            <View style={styles.selectDateTimeContainer}>
              <DateTimePicker
                value={startDateTime}
                mode="datetime"
                display={Platform.OS === "ios" ? "compact" : "default"}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setStartDateTime(selectedDate);
                  }
                }}
              />
              <Text style={styles.infoText}>
                Selected Date & Time: {startDateTime.toLocaleString()}
              </Text>
            </View>
            <Button title="Create Challenge" onPress={onCreate} />
            <Button title="Cancel" onPress={onClose} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dark backdrop
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  selectDateTimeContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
});
