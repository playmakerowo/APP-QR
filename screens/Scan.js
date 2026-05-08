import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Linking } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import Boton from '../components/boton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import validUrl from 'valid-url';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme';

export default function App() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(true);
    const [scannedData, setScannedData] = useState({ type: null, data: null, date: null });
    const [firstTime, setFirstTime] = useState(true);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setFirstTime(false);
        setScannedData({ type, data });
        const key = `QR-APP-${data}`;
        try {
            const currentDate = new Date();
            await AsyncStorage.setItem(key, JSON.stringify({ data, date: currentDate }));
        } catch (error) {
            console.error('Error storing data in AsyncStorage:', error);
        }
    };

    const isUrl = (url) => validUrl.isUri(url);

    const handleLinkPress = (url) => {
        if (isUrl(url)) Linking.openURL(url);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (result && result.assets?.[0]?.uri) {
            try {
                const scannedResults = await Camera.scanFromURLAsync(
                    result.assets[0].uri
                );

                const dataNeeded = scannedResults[0].data;
                setScanned(true);
                setFirstTime(false);
                setScannedData({ type: scannedResults[0].type, data: dataNeeded });

                const key = `QR-APP-${dataNeeded}`;
                const currentDate = new Date();
                await AsyncStorage.setItem(key, JSON.stringify({ data: dataNeeded, date: currentDate }));

            } catch (error) {
                setScannedData({ type: null, data: "No QR Code Found" });
                setTimeout(() => setScannedData({ type: null, data: null }), 4000);
            }
        }
    };

    const renderCamera = () => {
        if (!scanned) {
            return (
                <View style={styles.cameraContainer}>
                    <CameraView
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barcodeScannerSettings={{ barcodeTypes: ['qr', 'pdf417'] }}
                        style={styles.camera}
                    />
                </View>
            );
        } else {
            return (
                <>
                    <Text style={[styles.title, { color: theme.text }]}>Welcome to the Scanner App!</Text>
                    <Text style={[styles.paragraph, { color: theme.subtext }]}>Scan a QR code to start.</Text>
                    <View style={[styles.scanTextContainer, { backgroundColor: theme.card }]}>
                        <Text style={[styles.title, { color: theme.text }]}>
                            {firstTime ? 'Welcome!' : 'Code has been scanned!'}
                        </Text>
                        <Text style={[styles.paragraph, { color: theme.subtext }]}>
                            {firstTime ? 'Press one button below to start scanning' : 'Data scanned: '}
                        </Text>
                        {isUrl(scannedData.data) ? (
                            <TouchableOpacity onPress={() => handleLinkPress(scannedData.data)}>
                                <Text style={[styles.link, { color: '#4A90D9' }]}>
                                    {scannedData.data}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={{ color: theme.text }}>{scannedData.data}</Text>
                        )}
                    </View>
                </>
            );
        }
    };

    if (hasPermission === null) return <View style={{ backgroundColor: theme.background, flex: 1 }} />;

    if (hasPermission === false) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={[styles.text, { color: theme.text }]}>Camera permission not granted</Text>
                <Button
                    title="Grant Camera Permission"
                    onPress={async () => {
                        const { status } = await Camera.requestCameraPermissionsAsync();
                        setHasPermission(status === 'granted');
                    }}
                />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {renderCamera()}
            {scanned && <Boton onPress={() => setScanned(false)} disabled={scanned} text='Open camera for a new scan' />}
            {!scanned && <Boton onPress={() => setScanned(true)} disabled={scanned} text='Close cam' />}
            {scanned && <Button onPress={pickImage} title='Select a code from gallery' />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ECECEC' },
    title: { fontSize: 25, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    paragraph: { fontSize: 16, marginBottom: 40, textAlign: 'center' },
    cameraContainer: { marginTop: '20%', width: '100%', aspectRatio: 0.7, overflow: 'hidden', marginBottom: 20 },
    scanTextContainer: { width: '80%', aspectRatio: 1, overflow: 'hidden', borderRadius: 10, marginBottom: 40, alignItems: 'center', justifyContent: 'center' },
    camera: { flex: 1 },
    text: { marginBottom: 20 },
    link: { color: 'blue', textDecorationLine: 'underline' },
});