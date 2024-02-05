import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import Boton from '../components/boton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import validUrl from 'valid-url';

export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(true);
    const [scannedData, setScannedData] = useState({ type: null, data: null, date: null });
    const [firstTime, setFirstTime] = useState(true);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
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
            console.log('Item saved with key:', key);
        } catch (error) {
            console.error('Error storing data in AsyncStorage:', error);
        }
    };

    const isUrl = (url) => {
        return validUrl.isUri(url);
    };

    const handleLinkPress = (url) => {
        if (isUrl(url)) {
            Linking.openURL(url);
        } else {
            console.log('Not a valid URL:', url);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (result && result.assets[0].uri) {
            try {
                const scannedResults = await BarCodeScanner.scanFromURLAsync(
                    result.assets[0].uri
                );

                const dataNeeded = scannedResults[0].data;
                setScanned(true);
                setFirstTime(false);
                setScannedData({ type: scannedResults[0].type, data: dataNeeded });

                const key = `QR-APP-${dataNeeded}`;
                const currentDate = new Date();

                try {
                    await AsyncStorage.setItem(key, JSON.stringify({ data: dataNeeded, date: currentDate }));
                    console.log('Item saved with key:', key);
                } catch (error) {
                    console.error('Error storing data in AsyncStorage:', error);
                }

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
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={styles.camera}
                    />
                </View>
            );
        } else {
            return (
                <>
                    <Text style={styles.title}>Welcome to the Scanner App!</Text>
                    <Text style={styles.paragraph}>Scan a barcode or QR code to start your job.</Text>
                    <View style={styles.scanTextContainer}>
                        <Text style={styles.title}>
                            {firstTime ? 'Press one button below to start the scan' : 'Code has been scanned!'}
                        </Text>
                        <Text style={styles.paragraph}>
                            {firstTime ? 'Welcome! Press one button below to start scanning' : 'Data scanned: '}
                        </Text>
                        {isUrl(scannedData.data) ? (
                            <TouchableOpacity onPress={() => handleLinkPress(scannedData.data)}>
                                <Text style={[styles.link, { color: 'blue', textDecorationLine: 'underline' }]}>
                                    {scannedData.data}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <Text>{scannedData.data}</Text>
                        )}
                    </View>
                </>
            );
        }
    };

    if (hasPermission === null) {
        return <View />;
    }

    const requestCameraPermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Camera permission not granted</Text>
                <Button title="Grant Camera Permission" onPress={() => requestCameraPermission()} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderCamera()}
            {scanned && <Boton
                onPress={() => setScanned(false)}
                disabled={scanned}
                text='Open camera for a new scan'
            />}
            {!scanned && <Boton
                onPress={() => setScanned(true)}
                disabled={scanned}
                text='Close cam'
            />}
            {scanned && <Button onPress={pickImage} title='Select a code from gallery' />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ECECEC'
    },
    appTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 40,
        textAlign: 'center',
    },
    cameraContainer: {
        marginTop: '20%',
        width: '100%',
        aspectRatio: 0.7,
        overflow: 'hidden',
        marginBottom: 20,
    },
    scanTextContainer: {
        width: '80%',
        aspectRatio: 1,
        overflow: 'hidden',
        borderRadius: 10,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    camera: {
        flex: 1,
    },
    text: {
        marginBottom: 20,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});
