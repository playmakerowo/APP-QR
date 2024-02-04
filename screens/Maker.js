import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import React, { useState } from 'react';

export default function QRCodeGenerator() {
    const [qrValue, setQRValue] = useState('');
    const [isActive, setIsActive] = useState(false);

    const generateQRCode = () => {
        if (!qrValue) return;

        setIsActive(true);
    };

    const handleInputChange = (text) => {
        setQRValue(text);

        if (!text) {
            setIsActive(false);
        }
    };

    const resetQRCode = () => {
        console.log('Resetting QR Code');
        setIsActive(false);
        // setQRValue('');  // Puedes comentar o descomentar esta línea según tus necesidades.
    };

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Text style={styles.title}>QR Maker</Text>
                {isActive && (
                    <View style={styles.qrCode}>
                        <QRCode
                            value={qrValue}
                            size={200}
                            color="black"
                            backgroundColor="white"
                        />
                        <TouchableOpacity style={styles.buttonSecundary} onPress={resetQRCode}>
                            <Text style={styles.buttonText}>Stop Generator</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.inputButtonContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter text or URL"
                        value={qrValue}
                        onChangeText={handleInputChange}
                    />
                    <TouchableOpacity style={styles.button} onPress={generateQRCode}>
                        <Text style={styles.buttonText}>Generate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    inputButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, // Puedes ajustar este valor según sea necesario
    },
    wrapper: {
        backgroundColor: '#fff',
        borderRadius: 7,
        padding: 20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 30,
        minWidth: '90%',
        maxWidth: '90%',
        minHeight: '85%',
        maxHeight: '85%',
        justifyContent: 'space-between', // Añadido para que los elementos estén en la parte inferior
    },
    title: {
        fontSize: 35,
        fontWeight: '500',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        color: '#575757',
        fontSize: 16,
        marginBottom: 20,
    },
    input: {
        fontSize: 18,
        padding: 17,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {        
        backgroundColor: '#3498DB',
        padding: 17,
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
        marginLeft: 5,
        borderWidth: 1,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    qrCode: {
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        minHeight: '50%',
    },
    buttonSecundary: {
        margin: 25,
        backgroundColor: 'purple',
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
    }
});