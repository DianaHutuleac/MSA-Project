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
        <Modal transparent={true} visible={visible} animationType="slide">
            <KeyboardAvoidingView
                style={styles.modalBackdrop}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Add offset
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Enter your story</Text>
                        <TextInput
                            style={styles.textInput}
                            multiline
                            onChangeText={setStoryText}
                            value={storyText}
                            placeholder="What's the story behind this pin?"
                        />
                        <Text style={styles.label}>Visibility Duration:</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={visibilityDuration}
                                onValueChange={(itemValue) => setVisibilityDuration(itemValue)}
                            >
                                <Picker.Item label="1 Day" value="DAY" />
                                <Picker.Item label="1 Week" value="WEEK" />
                                <Picker.Item label="1 Month" value="MONTH" />
                                <Picker.Item label="Permanent" value="PERMANENT" />
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
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
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
        minHeight: 40,
        maxHeight: 120,
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
        backgroundColor: '#88c399',
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
