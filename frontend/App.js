import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Welcome from './screens/Welcome';  
import Login from './screens/Login';      
import Register from './screens/Register'; 
import Home from './screens/Home';        
import Profile from './screens/Profile';  

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen 
          name="Welcome" 
          component={Welcome} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTransparent: true, 
          }}
        />

        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTransparent: true, 
          }}
        />
        
        <Stack.Screen 
          name="Register" 
          component={Register} 
          options={{
            headerTitle: '', 
            headerBackTitleVisible: false, 
            headerTransparent: true, 
          }}
        />

        <Stack.Screen 
          name="DrawerNavigator" 
          component={DrawerNavigator} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
