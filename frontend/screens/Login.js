import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      navigation.replace("DrawerNavigator");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background_map.jpeg')} 
      style={styles.background}
    >
      <View style={styles.overlay} />

      <View style={styles.container}>

        <Image
              source={require('../assets/logo.png')} 
              style={styles.logo}
            />


          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Register")}
            >
              Register here
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    backgroundColor: '#FFFFF0', 
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
  registerText: {
    marginTop: 15,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});
