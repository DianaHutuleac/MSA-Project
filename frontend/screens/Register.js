import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import axios from "axios"; // 1) Import axios

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2) Use async/await to make the POST request
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    try {
      // 3) Make a POST request to your backend
      const response = await axios.post(
        "http://localhost:8080/user/register",
        {
          email: email,
          password: password,
        }
      );
      // The server should return a UserGetDto in response.data (e.g. { id, email, ... })
      console.log("Register success:", response.data);

      // Navigate to the next screen — or show a success message
      navigation.replace("DrawerNavigator");
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Error", "Something went wrong during registration");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background_map.jpeg")}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={require("../assets/logo.png")} style={styles.logo} />

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Login")}
            >
              Login here
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFF0",
    opacity: 0.3,
  },
  input: {
    width: "80%",
    padding: 15,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#000",
    borderRadius: 5,
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 25,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#FFFFF0",
    borderWidth: 0.2,
    borderRadius: 100,
    padding: 15,
    marginVertical: 10,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },
  link: {
    color: "#010056",
    fontWeight: "bold",
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
});
