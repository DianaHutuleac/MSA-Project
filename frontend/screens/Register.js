import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Register({ navigation }) {
  const handleRegister = () => {
    // After registration success, navigate to the DrawerNavigator
    navigation.replace('DrawerNavigator');
  };

  return (
    <View style={styles.container}>
      <Text>Register to City Stories</Text>
      <Button title="Register" onPress={handleRegister} />
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
