import React from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function StoryModal({
  visible,
  storyText,
  setStoryText,
  visibilityDuration,
  setVisibilityDuration,
  onSave,
  onCancel,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      {/*
        The KeyboardAvoidingView that shifts content up
        without changing width/height.
      */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/*
          Dark overlay to center the "card" modal container.
        */}
        <View style={styles.modalOverlay}>
          {/*
            The main "card" container with a fixed width & maxHeight,
            just like in your PinModal.
          */}
          <View style={styles.modalContainer}>
            {/*
              ScrollView so users can scroll if the text is very long.
            */}
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalTitle}>Enter your story</Text>

              <TextInput
                style={styles.textInput}
                multiline
                onChangeText={setStoryText}
                value={storyText}
                placeholder="What's the story behind this pin?"
                placeholderTextColor="#A9A9A9"
              />

              <Text style={styles.label}>Visibility Duration:</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={visibilityDuration}
                  onValueChange={(itemValue) => setVisibilityDuration(itemValue)}
                >
                  <Picker.Item label="1 Day" value="DAY" color="#A9A9A9"/>
                  <Picker.Item label="1 Week" value="WEEK" color="#A9A9A9"/>
                  <Picker.Item label="1 Month" value="MONTH" color="#A9A9A9"/>
                  <Picker.Item label="Permanent" value="PERMANENT" color="#A9A9A9"/>
                </Picker>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                  <Text style={styles.saveButtonText}>Save Pin</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /*
    Dark overlay behind the modal, 
    centered just like in your PinModal.
  */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /*
    Main "card" container with a controlled width
    and maxHeight to prevent over-expanding.
  */
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,

    // A bit of elevation + shadow for Android/iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  /*
    Scroll area for the text content + inputs
  */
  scrollArea: {
    marginTop: 10,
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
    color: '#333',
  },
  textInput: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
    maxHeight: 200,
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
    color: '#666',
  },
  pickerWrapper: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#2F4F4F',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: '#d9534f',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#d9534f',
    fontWeight: '600',
  },
});
