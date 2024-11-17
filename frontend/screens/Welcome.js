import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to City Stories App</Text>
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
