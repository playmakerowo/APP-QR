import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import Boton from './components/boton';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';


//Paginas
import Scan from "./screens/Scan";
import History from './screens/History';
import Maker from './screens/Maker';

export default function App() {


  //FORMA DE USAR TABS TRADICIONAL (BOTONES INFERIORES TIPO INSTAGRAM)
  const Tab = createBottomTabNavigator();

  return (
    <>
      <ScrollView style={styles.scroll} contentContainerStyle={{ flexGrow: 2 }}>
        <NavigationContainer>
          <StatusBar style="auto"  barStyle="dark-content"  />
          <Tab.Navigator>
            <Tab.Screen name="SCAN" component={Scan} options={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#FFF',
                borderTopColor: '#FFF', // Color del borde superior
                borderTopWidth: 2, // Ancho del borde superior
              }
              , tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="qrcode-scan" color={color} size={size} />
              ),
            }} ></Tab.Screen>
            <Tab.Screen name="HISTORY" component={History} options={{
              headerShown: false, tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="history" color={color} size={size} />
              )
            }}></Tab.Screen>
            <Tab.Screen name="MAKER" component={Maker} options={{
              headerShown: false, tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="qrcode-edit" color={color} size={size} />
              )
            }}></Tab.Screen>
            
          </Tab.Navigator>
        </NavigationContainer>
      </ScrollView>
    </>
  );
}


const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'blue',
    flex: 1,

  },
});   
