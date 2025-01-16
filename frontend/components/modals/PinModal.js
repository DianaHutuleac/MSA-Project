import React, { useState, useEffect, useContext } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function PinModal({ visible, onClose, pin, token, userId }) {
  const { userRole } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  // -- EDITING STATES --
  const [isEditing, setIsEditing] = useState(false);
  const [editStory, setEditStory] = useState("");

  const canEditOrDelete =
    pin && (String(pin.userId) === String(userId) || userRole === "ROLE_ADMIN");

  useEffect(() => {
    if (visible && pin?.id) {
      fetchPinLikeInfo(pin.id, token);
      fetchCommentsForPin(pin.id, token);
      // Reset editing when a new pin is loaded
      setIsEditing(false);
      setEditStory(pin.story || "");
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
      console.error("Error fetching like info:", error);
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
      console.error("Error fetching comments:", error);
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
      console.error("Error toggling like:", error);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) {
      console.error("Comment cannot be empty");
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
        setCommentText("");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  // -- DELETE PIN --
  const handleDeletePin = async () => {
    if (!token || !pin?.id) return;
    try {
      await axios.delete(`http://172.20.10.4:8080/pins/${pin.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // After deleting, close the modal. Parent can refresh pins if needed.
      onClose();
    } catch (error) {
      console.error("Error deleting pin:", error);
    }
  };

  // -- TOGGLE EDIT MODE --
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setEditStory(pin.story || ""); // reset to current story
  };

  // -- CONFIRM UPDATE PIN --
  const handleConfirmUpdate = async () => {
    if (!token || !pin?.id) return;
    try {
      const response = await axios.put(
        `http://172.20.10.4:8080/pins/${pin.id}`,
        {
          story: editStory,
          // optionally also pass visibilityDuration if you want to edit that
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        // update the local story
        pin.story = editStory;
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating pin:", error);
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Dark overlay to center the modal */}
        <View style={styles.modalOverlay}>
          {/* Actual modal card */}
          <View style={styles.modalContainer}>
            {/* Only render content if we have a pin */}
            {pin && (
              <>
                {/* Top-right icons row */}
                {canEditOrDelete && (
                  <View style={styles.topIconsRow}>
                    {isEditing ? (
                      <TouchableOpacity onPress={handleConfirmUpdate}>
                        <Ionicons
                          name="checkmark-done-outline"
                          size={20}
                          color="#333"
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={handleEditToggle}>
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color="#333"
                        />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={handleDeletePin}
                      style={{ marginLeft: 12 }}
                    >
                      <Ionicons name="trash-outline" size={20} color="#333" />
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.topIconsRow, { top: 10, right: 10 }]}
                >
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
                    {isEditing ? (
                      <TextInput
                        style={[
                          styles.storyText,
                          { borderWidth: 1, borderColor: "#ddd" },
                        ]}
                        multiline
                        value={editStory}
                        onChangeText={setEditStory}
                      />
                    ) : (
                      <Text style={styles.storyText}>{pin.story}</Text>
                    )}
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
                  <TouchableOpacity
                    onPress={handleLikePress}
                    style={styles.likeButton}
                  >
                    <Ionicons
                      name={isLiked ? "heart" : "heart-outline"}
                      size={24}
                      color={isLiked ? "#F26CA7" : "#888"}
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
                  <TouchableOpacity
                    onPress={handleSendComment}
                    style={styles.sendIcon}
                  >
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  // Row for the edit, delete, and close icons
  topIconsRow: {
    position: "absolute",
    top: 10,
    right: 40,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },

  scrollArea: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
    marginTop: 20,
  },

  box: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80,
  },

  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },

  commentItem: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  noCommentsText: {
    fontSize: 15,
    color: "#777",
    padding: 10,
    textAlign: "center",
  },

  interactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  likeText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
    maxHeight: 120,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  sendIcon: {
    marginLeft: 8,
  },
});
