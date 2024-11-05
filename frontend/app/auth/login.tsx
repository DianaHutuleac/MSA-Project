import React from 'react';
import { Button, View, Text } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Log in" onPress={login} />
    </View>
  );
}
