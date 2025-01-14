import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Profile from './screens/Profile';
import MyPins from './screens/MyPins';

const Stack = createStackNavigator();

export default function App() {
    return (
        <AuthProvider> {/* Wrap everything with AuthProvider */}
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

                    {/* Replace DrawerNavigator with Home */}
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="Profile"
                        component={Profile}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="MyPins"
                        component={MyPins}
                        options={{ headerShown: false }}

                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}
