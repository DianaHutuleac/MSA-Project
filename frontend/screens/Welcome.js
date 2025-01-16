import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

export default function Welcome({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial scale value

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2, // Zoom in
          duration: 4000, // Duration in milliseconds
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // Zoom out
          duration: 4000, // Duration in milliseconds
          useNativeDriver: true,
        }),
      ]).start(() => animate()); // Loop animation
    };

    animate();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill, // Ensures the background fills the entire screen
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <ImageBackground
          source={require("../assets/background_map.jpeg")}
          style={styles.background}
        />
      </Animated.View>

      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Fixed Content */}
      <View style={styles.content}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 50,
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
});
