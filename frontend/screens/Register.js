import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground
} from "react-native";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    // Handle registration logic here (e.g., API call)
    console.log("Email:", email);
    console.log("Password:", password);

    // Navigate to the app after successful registration
    navigation.replace("DrawerNavigator");
  };

  return (
    <ImageBackground
      source={require('../assets/background_map.jpeg')} 
      style={styles.background}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        
        <Image
            source={require('../assets/logo.png')} // Replace with your logo image path
            style={styles.logo}
          />
        

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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFF0',
    opacity: 0.3,
  },
  input: {
    width: "80%",
    padding: 15,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#000",
    borderRadius: 5,
    backgroundColor: "#",
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 25,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#FFFFF0', // Button background color
    borderWidth: 0.2,
    borderRadius: 100,
    padding: 15,
    marginVertical: 10,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    textDecorationLine: "underline"
  },
});
