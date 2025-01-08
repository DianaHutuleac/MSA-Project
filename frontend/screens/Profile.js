import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile({ navigation }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = async () => {
    // 1) Remove the token from AsyncStorage
    await AsyncStorage.removeItem("authToken");

    // 2) Reset navigation stack (go to Welcome or Login screen)
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  useEffect(() => {
    const openListener = navigation.addListener("drawerOpen", () => {
      setIsDrawerOpen(true);
    });

    const closeListener = navigation.addListener("drawerClose", () => {
      setIsDrawerOpen(false);
    });

    return () => {
      openListener();
      closeListener();
    };
  }, [navigation]);

  return (
      <>
        {!isDrawerOpen && (
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.openDrawer()}
            >
              <Ionicons name="menu" size={30} color="black" />
            </TouchableOpacity>
        )}

        <View style={styles.container}>
          <Text style={styles.title}>User Profile</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Name: test</Text>
            <Text style={styles.infoText}>Email: test@test.com</Text>
          </View>

          <Button title="Log Out" onPress={handleLogout} />
        </View>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
  menuButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1000,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
