// file: components/DropdownMenu.js
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DropdownMenu({ navigation }) {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible((prev) => !prev);
    };

    const handleProfilePress = () => {
        setMenuVisible(false);
        navigation.navigate('Profile');
    };

    // If you only have "Home" and "Profile", just keep those two items
    const handleHomePress = () => {
        setMenuVisible(false);
        navigation.navigate('Home');
    };

    return (
        <>
            {/* The hamburger button */}
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                <Ionicons name="menu" size={30} color="black" />
            </TouchableOpacity>

            {/* The dropdown */}
            {menuVisible && (
                <View style={styles.dropdownMenu}>
                    <TouchableOpacity style={styles.menuItem} onPress={handleHomePress}>
                        <Ionicons name="home" size={20} color="black" style={{ marginRight: 8 }} />
                        <Text>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={handleProfilePress}>
                        <Ionicons name="person" size={20} color="black" style={{ marginRight: 8 }} />
                        <Text>Profile</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1000,
        backgroundColor: '#fffff0',
        padding: 10,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 100, // just below the menu button
        left: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 5,
        width: 150,
        zIndex: 1100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
});
