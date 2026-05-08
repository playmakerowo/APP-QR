import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Linking, Platform, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClearStorageButton from '../components/clearStorage';
import RefreshButton from '../components/refreshButton';
import * as Clipboard from 'expo-clipboard';
import validUrl from 'valid-url';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const History = () => {
    const [storedData, setStoredData] = useState([]);
    const [lastScanned, setLastScanned] = useState(null);
    const [searchText, setSearchText] = useState('');

    const filteredData = storedData.filter(([key, data]) =>
        data.data.toLowerCase().includes(searchText.toLowerCase())
    );

    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(dateTimeString).toLocaleString(undefined, options);
    };

    const parseWifiQR = (data) => {
        if (!data) return null;

        // Formato estándar WIFI:T:WPA;S:...
        if (data.startsWith('WIFI:')) {
            const ssid = data.match(/S:([^;]*)/)?.[1] || '';
            const password = data.match(/P:([^;]*)/)?.[1] || '';
            return { ssid, password };
        }

        // Formato texto plano Android — si tiene espacios
        // última palabra = contraseña, resto = nombre de red
        const trimmed = data.trim();
        if (trimmed.includes(' ')) {
            const words = trimmed.split(' ');
            const password = words[words.length - 1];
            const ssid = words.slice(0, -1).join(' ');
            return { ssid, password };
        }

        return null;
    };

    const [copyTexts, setCopyTexts] = useState({}); // Usar un objeto para almacenar el texto de copia para cada elemento
    const [copied, setCopied] = useState(false);
    const handleCopy = (key, data) => {
        setCopyTexts((prevCopyTexts) => ({
            ...prevCopyTexts,
            [key]: data,
        }));
        setCopied(false);
        console.log('Copying data:', data);
    };

    const copyToClipboard = async (data) => {
        if (data) {
            await Clipboard.setStringAsync(data);
            if (Platform.OS === 'android') {
                ToastAndroid.show('Text copied to clipboard!', ToastAndroid.SHORT);
            }
            setCopied(true);
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
            // Puedes manejarlo de otra manera, como mostrar un mensaje al usuario.
        }
    };


    const handleRefresh = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const items = await AsyncStorage.multiGet(keys);

            const parsedItems = items.map(([key, value]) => [key, JSON.parse(value)]);

            // Ordenar los datos por fecha antes de establecer el estado
            const sortedItems = parsedItems.sort((a, b) => new Date(b[1].date) - new Date(a[1].date));

            setStoredData(sortedItems);

            const lastItem = sortedItems.length > 0 ? sortedItems[0] : null;
            setLastScanned(lastItem);

            console.log('List refreshed!');
        } catch (error) {
            console.error('Error refreshing list:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const listStoredData = async () => {
                try {
                    const keys = await AsyncStorage.getAllKeys();
                    const items = await AsyncStorage.multiGet(keys);

                    const parsedItems = items
                        .map(([key, value]) => [key, JSON.parse(value)])
                        .sort((a, b) => new Date(b[1].date) - new Date(a[1].date));

                    setStoredData(parsedItems);
                    const lastItem = parsedItems.length > 0 ? parsedItems[0] : null;
                    setLastScanned(lastItem);
                } catch (error) {
                    console.error('Error al listar elementos en AsyncStorage:', error);
                }
            };

            listStoredData();
        }, [])
    );

    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('AsyncStorage has been cleared!');
            setStoredData([]);
            setLastScanned(null);
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Text style={styles.title}>Stored Data</Text>
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={22} color="gray" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search History"
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {filteredData.map(([key, data]) => {
                    const wifi = parseWifiQR(data.data);
                    return (
                        <View key={key} style={styles.dataContainer}>
                            {wifi ? (
                                <View style={styles.wifiContainer}>
                                    <Text style={styles.wifiTitle}>📶 Red WiFi detectada</Text>
                                    <Text>Red: <Text style={styles.bold}>{wifi.ssid}</Text></Text>
                                    <Text>Contraseña: <Text style={styles.bold}>{wifi.password}</Text></Text>
                                    <TouchableOpacity
                                        style={styles.copyButton}
                                        onPress={() => copyToClipboard(wifi.password)}
                                    >
                                        <Text style={styles.copyButtonText}>Copiar contraseña</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : isUrl(data.data) ? (
                                <TouchableOpacity onPress={() => handleLinkPress(data.data)}>
                                    <Text style={[styles.link, { color: 'blue', textDecorationLine: 'underline' }]}>
                                        {data.data}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.dataValue}>{data.data}</Text>
                            )}
                            <Text style={styles.dateValue}>{formatDateTime(data.date)}</Text>
                            {!wifi && (
                                <TouchableOpacity
                                    style={styles.copyButton}
                                    onPress={() => copyToClipboard(data.data)}
                                >
                                    <Text style={styles.copyButtonText}>Copy</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
            <ClearStorageButton clearAsyncStorage={clearAsyncStorage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECECEC',
        padding: 10,
    },
    components: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 20,
    },
    dataContainer: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
        backgroundColor: '#FFF',
    },
    buttonContainer: {
        marginTop: 20,
        backgroundColor: '#ECECEC',
        paddingTop: 10,
        borderRadius: 5,
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
        backgroundColor: '#FFF',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    dateValue: {
        fontSize: 13,
        color: 'gray',
        paddingBottom: 5,
    },
    dataValue: {
        fontSize: 17,
    },
    link: {
        fontSize: 17,
        width: '100%',
    },
    copyButton: {
        marginTop: 5,
        padding: 8,
        backgroundColor: 'green',  // Puedes cambiar el color según tus preferencias
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    copyButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

    wifiContainer: {
        backgroundColor: '#E8F5E9',
        padding: 8,
        borderRadius: 5,
        marginBottom: 5,
    },
    wifiTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 4,
        color: '#2E7D32',
    },
    bold: {
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
        backgroundColor: '#FFF',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
});

export default History;