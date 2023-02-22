import { useEffect, useState, createContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './HomeScreen.js';
import { RecScreen } from './RecScreen.js';
import { StatScreen } from './StatScreen.js';
import { PersonalScreen } from './PersonalScreen.js';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer> 
      <Tab.Navigator
        initialRouteName="Home" 
        screenOptions={{
          tabBarStyle: { 
            backgroundColor: 'black', // TODO: Change
          },
            tabBarActiveTintColor: 'fuchsia', // TODO: Change
          tabBarInactiveTintColor: 'white', // TODO: Change
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-sharp" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Recommendations"
          component={RecScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bulb-sharp" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Statistics"
          component={StatScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-sharp" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Personal"
          component={PersonalScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-sharp" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
