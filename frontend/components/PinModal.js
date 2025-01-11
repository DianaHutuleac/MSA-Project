import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PinModal({
  story,
  isLiked,
  likeCount,
  modalVisible,
  onClose,
  onLikePress,
  onSendComment,
}) {
  const [commentText, setCommentText] = useState('');

  const handleSendComment = () => {
    onSendComment(commentText);
    setCommentText('');
  };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Show the story in a bigger area */}
          <Text style={styles.modalStoryText}>{story}</Text>

          {/* Like row */}
          <View style={styles.likeRow}>
            <TouchableOpacity onPress={onLikePress} style={styles.likeButton}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={isLiked ? '#F26CA7' : '#888'}
              />
              <Text style={styles.likeText}>{likeCount}</Text>
            </TouchableOpacity>
          </View>

          {/* Comment input */}
          <View style={styles.commentSection}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <Button title="Send" onPress={handleSendComment} />
          </View>

          {/* Close button */}
          <Button title="Close" onPress={onClose} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dim background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalStoryText: {
    fontSize: 16,
    marginBottom: 15,
  },
  likeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  commentSection: {
    marginBottom: 15,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
