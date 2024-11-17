import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Login({ navigation }) {
  const handleLogin = () => {
    // After login success, navigate to the DrawerNavigator
    navigation.replace('DrawerNavigator');
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to City Stories</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
