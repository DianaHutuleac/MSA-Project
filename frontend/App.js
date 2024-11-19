import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Welcome from './screens/Welcome';  // Add Welcome Screen
import Login from './screens/Login';      // Add Login Screen
import Register from './screens/Register'; // Add Register Screen
import Home from './screens/Home';        // Home Screen
import Profile from './screens/Profile';  // Profile Screen

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigation - Home and Profile
function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}

// App component with stack and drawer navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* Welcome Screen */}
        <Stack.Screen 
          name="Welcome" 
          component={Welcome} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTransparent: true, 
          }}
        />

        {/* Login Screen */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTransparent: true, 
          }}
        />
        
        {/* Register Screen */}
        <Stack.Screen 
          name="Register" 
          component={Register} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTransparent: true, 
          }}
        />

        {/* Drawer Navigator for authenticated users */}
        <Stack.Screen 
          name="DrawerNavigator" 
          component={DrawerNavigator} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
