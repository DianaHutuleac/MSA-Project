import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Welcome to City Stories!</Text>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
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
