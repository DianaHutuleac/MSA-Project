import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Profile({ navigation }) {
  const handleLogout = () => {
    // Navigate back to the Welcome screen on logout
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {/* User Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Name: John Doe</Text>
        <Text style={styles.infoText}>Email: johndoe@example.com</Text>
      </View>

      {/* Logout Button */}
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
