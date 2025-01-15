import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// We'll receive props like:
//   visible, onClose, pin, token, userId
// so this component can fetch comments/likes info and display them
export default function PinModal({
  visible,
  onClose,
  pin,
  token,
  userId,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  // Fetch likes/comments whenever the modal becomes visible or the pin changes
  useEffect(() => {
    if (visible && pin?.id) {
      fetchPinLikeInfo(pin.id, token);
      fetchCommentsForPin(pin.id, token);
    }
  }, [visible, pin]);

  const fetchPinLikeInfo = async (pinId, token) => {
    try {
      const response = await axios.get(
        `http://172.20.10.4:8080/pins/${pinId}/like-info`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setIsLiked(response.data.liked);
        setLikeCount(response.data.numberOfLikes);
      }
    } catch (error) {
      console.error('Error fetching like info:', error);
    }
  };

  const fetchCommentsForPin = async (pinId, token) => {
    try {
      const response = await axios.get(
        `http://172.20.10.4:8080/comments/comments-for-pin/${pinId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLikePress = async () => {
    if (!token || !pin?.id) return;

    try {
      if (!isLiked) {
        const response = await axios.put(
          `http://172.20.10.4:8080/pins/${pin.id}/like`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setIsLiked(true);
          setLikeCount(likeCount + 1);
        }
      } else {
        const response = await axios.put(
          `http://172.20.10.4:8080/pins/${pin.id}/unlike`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setIsLiked(false);
          setLikeCount(likeCount - 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) {
      console.error('Comment cannot be empty');
      return;
    }
    if (!pin?.id) return;

    try {
      const response = await axios.post(
        `http://172.20.10.4:8080/comments`,
        {
          content: commentText,
          userId: userId,
          pinId: pin.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        setComments((prev) => [...prev, response.data]);
        setCommentText('');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Dark overlay to center the modal */}
        <View style={styles.modalOverlay}>
          {/* Actual modal card */}
          <View style={styles.modalContainer}>
            {/* Only render content if we have a pin */}
            {pin && (
              <>
                {/* Close Button in top-right */}
                <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>

                {/* Scrollable area for story + comments */}
                <ScrollView
                  style={styles.scrollArea}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text style={styles.sectionTitle}>Story</Text>
                  <View style={styles.box}>
                    <Text style={styles.storyText}>{pin.story}</Text>
                  </View>

                  <Text style={styles.sectionTitle}>Comments</Text>
                  <View style={styles.box}>
                    {comments.length > 0 ? (
                      comments.map((c) => (
                        <Text style={styles.commentItem} key={c.id}>
                          {c.content}
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.noCommentsText}>No comments yet</Text>
                    )}
                  </View>
                </ScrollView>

                {/* The row with "like" + comment input at the bottom */}
                <View style={styles.interactRow}>
                  <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
                    <Ionicons
                      name={isLiked ? 'heart' : 'heart-outline'}
                      size={24}
                      color={isLiked ? '#F26CA7' : '#888'}
                    />
                    <Text style={styles.likeText}>{likeCount}</Text>
                  </TouchableOpacity>

                  <TextInput
                    style={styles.commentInput}
                    placeholder="Write a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                  />
                  <TouchableOpacity onPress={handleSendComment} style={styles.sendIcon}>
                    <Ionicons name="send" size={24} color="#2F4F4F" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Example styles
const styles = StyleSheet.create({
  // The dark background behind the modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // Center the modal container
    justifyContent: 'center',
    alignItems: 'center',
  },

  // The main "card" of the modal
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    // remove overflow:'hidden' so scrolling can expand
    // overflow: 'visible',
    // Some shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 10,
  },

  // This is the main scroll area for story + comments
  scrollArea: {
    // No huge margin that pushes content off-screen
    marginTop: 10, // space for the close icon
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
    marginTop: 20,
  },

  box: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    // basic shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80,
  },

  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },

  commentItem: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  noCommentsText: {
    fontSize: 15,
    color: '#777',
    padding: 10,
    textAlign: 'center',
  },

  // The bottom row (like + comment input + send)
  interactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  likeText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
    maxHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  sendIcon: {
    marginLeft: 8,
  },
});