import React, { useContext, useState } from "react";
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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setToken} = useContext(AuthContext);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    try {
      // 1) Call the new /auth/register endpoint
      const response = await axios.post(
          "http://172.20.10.4:8080/auth/register",
          {
            email,
            password,
          }
      );

      // 2) The response should contain { token, user: { ... } }
      const data = response.data;
      console.log("Register success:", data);

      // 3) If you want to automatically log them in:
      if (data && data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        setToken(data.token); // Update context immediately
      }

      // 4) Navigate to the main screen or some other screen
      navigation.replace("Home");
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
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
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
