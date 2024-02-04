import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Clipboard, TextInput, Linking, Platform, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClearStorageButton from '../components/clearStorage';
import RefreshButton from '../components/refreshButton';
import validUrl from 'valid-url';

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

    const copyToClipboard = (data) => {
        if (data) {
            Clipboard.setString(data);

            // Mostrar un mensaje de éxito
            if (Platform.OS === 'android') {
                ToastAndroid.show('Text copied to clipboard!', ToastAndroid.SHORT);
            } else if (Platform.OS === 'ios') {
                // Puedes usar una alerta diferente para iOS si lo prefieres
                console.log('Text copied to clipboard!');
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

    useEffect(() => {
        // Función para obtener y listar los elementos almacenados
        const listStoredData = async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const items = await AsyncStorage.multiGet(keys);

                // Parsear el valor almacenado de cadena JSON a objeto y ordenar por fecha y hora
                const parsedItems = items
                    .map(([key, value]) => [key, JSON.parse(value)])
                    .sort((a, b) => new Date(b[1].date) - new Date(a[1].date));

                setStoredData(parsedItems);

                // Obtener el último escaneo
                const lastItem = parsedItems.length > 0 ? parsedItems[0] : null;
                setLastScanned(lastItem);
            } catch (error) {
                console.error('Error al listar elementos en AsyncStorage:', error);
            }
        };

        // Llamar a la función cuando se monta la pantalla
        listStoredData();
    }, []);

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
                <View style={styles.components}>
                    <RefreshButton onPress={handleRefresh} />
                    <ClearStorageButton clearAsyncStorage={clearAsyncStorage} />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Search History"
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {filteredData.map(([key, data]) => (
                    <View key={key} style={styles.dataContainer}>
                        {isUrl(data.data) ? (
                            <TouchableOpacity onPress={() => handleLinkPress(data.data)}>
                                <Text
                                    style={[
                                        styles.link,
                                        { color: 'blue', textDecorationLine: 'underline' },
                                    ]}
                                >
                                    {`${data.data}`}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.dataValue}>{`${data.data}`}</Text>
                        )}
                        <Text style={styles.dateValue}>{`${formatDateTime(data.date)}`}</Text>
                        <TouchableOpacity
                            style={styles.copyButton}
                            onPress={() => copyToClipboard(data.data)}
                        >
                            <Text style={styles.copyButtonText}>Copy</Text>
                        </TouchableOpacity>

                    </View>
                ))}
            </ScrollView>
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
});

export default History;