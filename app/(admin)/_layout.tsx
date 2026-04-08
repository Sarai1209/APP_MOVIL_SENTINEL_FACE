import { Redirect, Tabs } from 'expo-router';
import { BarChart3, Settings, Shield, Users } from 'lucide-react-native';
import React from 'react';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
 
export default function AdminLayout() {
  const { isAuthenticated, role } = useAuth();
 
  if (!isAuthenticated || role !== 'admin') return <Redirect href="/" />;
 
  return (
    <Tabs
      screenOptions={{
        headerShown:             false,
        tabBarActiveTintColor:   Colors.dark.adminGold,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
          borderTopColor:  Colors.dark.border,
          height:          65,
          paddingBottom:   10,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Shield size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Usuarios',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}