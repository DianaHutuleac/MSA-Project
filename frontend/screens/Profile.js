import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import DropdownMenu from "../components/menus/DropdownMenu";
import ChallengeModal from "../components/modals/ChallengeModal";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the logout icon
import { jwtDecode } from "jwt-decode";

export default function Profile({ navigation }) {
  const { logout, token } = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [challengeTheme, setChallengeTheme] = useState("");
  const [startDateTime, setStartDateTime] = useState(new Date());

  const userInfo = token ? jwtDecode(token) : { email: "", role: "" };

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  const handleCreateChallenge = async () => {
    if (!challengeTheme) {
      alert("Please fill in all fields");
      return;
    }

    const localDateTime = `${startDateTime.getFullYear()}-${String(
      startDateTime.getMonth() + 1
    ).padStart(2, "0")}-${String(startDateTime.getDate()).padStart(2, "0")}T${String(
      startDateTime.getHours()
    ).padStart(2, "0")}:${String(startDateTime.getMinutes()).padStart(2, "0")}:00`;

    console.log("Local DateTime:", localDateTime);

    try {
      const response = await axios.post(
        "http://localhost:8080/challenges",
        {
          theme: challengeTheme,
          startDate: localDateTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Challenge created successfully: " + response.data.theme);
      setIsModalVisible(false);
      setChallengeTheme("");
      setStartDateTime(new Date());
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("Failed to create challenge. Please try again.");
    }
  };

  const handleViewMyPins = () => {
    navigation.navigate("MyPins");
  };

  return (
    <View style={styles.container}>
      <DropdownMenu navigation={navigation} />
      <Text style={styles.title}>
        {userInfo.role === "ROLE_ADMIN" ? "Admin Profile" : "User Profile"}
      </Text>

      <TouchableOpacity style={styles.myPinsButton} onPress={handleViewMyPins}>
        <Ionicons name="location-outline" size={24} color="#333" />
        <Text style={styles.myPinsText}>My Pins</Text>
      </TouchableOpacity>

      {userInfo.role === "ROLE_ADMIN" && (
        <TouchableOpacity
          style={styles.addChallengeButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#333" />
          <Text style={styles.addChallengeText}>Add New Challenge</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Challenge Modal */}
      <ChallengeModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        challengeTheme={challengeTheme}
        setChallengeTheme={setChallengeTheme}
        startDateTime={startDateTime}
        setStartDateTime={setStartDateTime}
        onCreate={handleCreateChallenge}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fffff9",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 20,
  },
  addChallengeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3e3e3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  addChallengeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  myPinsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3e3e3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  myPinsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
});
