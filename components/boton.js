//import { TouchableOpacity, StyleSheet, Text } from "react-native-web";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';



export default function Boton ({onPress, text="Boton"}){
    return(
        <>
        <TouchableOpacity style={styles.areatocable} onPress={onPress}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create(
    {    
        areatocable:{
            backgroundColor: 'blue',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 5,
            margin: 10,
        },    
            buttonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        }
    }
)