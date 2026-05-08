import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme';

export default function QRCodeGenerator() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

    const [qrValue, setQRValue] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [tempInputValue, setTempInputValue] = useState('');

    const handleGenerateQRCode = () => {
        setIsActive(true);
    };

    const handleButtonPress = () => {
        setTempInputValue(qrValue);
        handleGenerateQRCode();
    };

    const handleInputChange = (text) => {
        setQRValue(text);
        setIsActive(false);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, width: '100%', backgroundColor: theme.background }}
            behavior="padding"
            keyboardVerticalOffset={80}
        >
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.wrapper, { backgroundColor: theme.card }]}>
                    <Text style={[styles.title, { color: theme.text }]}>QR Maker</Text>
                    <View style={styles.qrCode}>
                        {tempInputValue && (
                            <QRCode
                                value={tempInputValue}
                                size={230}
                                color={theme.text}
                                backgroundColor={theme.card}
                            />
                        )}
                    </View>
                    <View style={styles.inputButtonContainer}>
                        <TextInput
                            style={[styles.input, {
                                borderColor: theme.border,
                                color: theme.text,
                                backgroundColor: theme.card
                            }]}
                            placeholder="Enter text or URL"
                            placeholderTextColor={theme.subtext}
                            value={qrValue}
                            onChangeText={handleInputChange}
                        />
                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.button }]} onPress={handleButtonPress}>
                            <Text style={styles.buttonText}>Generate</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        paddingHorizontal: '5%',
        width: '100%',
    },
    inputButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    wrapper: {
        backgroundColor: '#fff',
        borderRadius: 7,
        padding: 20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 30,
        width: '100%',
        justifyContent: 'center',
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
        fontSize: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 5,
        marginBottom: 10,
        maxWidth: '60%',
        minWidth: '60%',
    },
    button: {
        backgroundColor: '#3498DB',
        padding: 11,
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
        marginLeft: 5,
        borderWidth: 1,
        maxWidth: '40%',
        minWidth: '40%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
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