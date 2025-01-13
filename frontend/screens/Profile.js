import React, { useContext, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import DropdownMenu from "../components/menus/DropdownMenu";
import ChallengeModal from "../components/modals/ChallengeModal";
import axios from "axios";
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

    // Format the selected date-time manually (YYYY-MM-DDTHH:mm:ss)
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

  return (
    <View style={styles.container}>
      <DropdownMenu navigation={navigation} />
      <Text style={styles.title}>{userInfo.role === "ROLE_ADMIN" ? "Admin Profile" : "User Profile"}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Email: {userInfo.email}</Text>
      </View>
      {userInfo.role === "ROLE_ADMIN" && (
        <Button title="Add New Challenge" onPress={() => setIsModalVisible(true)} />
      )}
      <Button title="Log Out" onPress={handleLogout} />

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
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
