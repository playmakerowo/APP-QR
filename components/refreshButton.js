import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const RefreshButton = ({ onPress }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress} // Se pasa directamente la función proporcionada por la prop onPress
        >
            <Text style={styles.buttonText}>Refresh list</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '50%',
        backgroundColor: 'blue',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        width: '48%',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        
    },
});

export default RefreshButton;
