import { Tabs } from 'expo-router';
import { Bell, Home, ScanFace, User } from 'lucide-react-native';
import React from 'react';
import { Colors } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.dark.pinkNeon,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.3)',
        tabBarStyle: {
          backgroundColor: '#050514', 
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          height: 65,
          paddingBottom: 10,
        },
      }}>
      <Tabs.Screen
        name="home" 
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <ScanFace size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}