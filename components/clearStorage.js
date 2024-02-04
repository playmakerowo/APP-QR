import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClearStorageButton = ({ clearAsyncStorage }) => {
  const handleClearStorage = () => {
    Alert.alert(
        'Confirmation',
        'Are you sure you want to clear storage?',
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: clearAsyncStorage,
            },
        ],
        { cancelable: false }
    );
};


  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleClearStorage}
    >
      <Text style={styles.buttonText}>Clear history</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f44336',
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

export default ClearStorageButton;
