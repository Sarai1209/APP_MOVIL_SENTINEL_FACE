import { Redirect, Tabs } from 'expo-router';
import { BarChart3, Bell, Camera, Settings, Shield, Users } from 'lucide-react-native';
import React from 'react';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { isAuthenticated, hasRole } = useAuth();
  if (!isAuthenticated || !hasRole('admin')) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown:             false,
        tabBarActiveTintColor:   Colors.dark.adminGold,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
          borderTopColor:  Colors.dark.border,
          height: 65, paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Panel',     tabBarIcon: ({ color }) => <Shield    size={24} color={color} /> }} />
      <Tabs.Screen name="gallery"   options={{ title: 'Galería',   tabBarIcon: ({ color }) => <Camera    size={24} color={color} /> }} />
      <Tabs.Screen name="users"     options={{ title: 'Empleados', tabBarIcon: ({ color }) => <Users     size={24} color={color} /> }} />
      <Tabs.Screen name="reports"   options={{ title: 'Reportes',  tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} /> }} />
      <Tabs.Screen name="alerts"    options={{ title: 'Alertas',   tabBarIcon: ({ color }) => <Bell      size={24} color={color} /> }} />
      <Tabs.Screen name="settings"  options={{ title: 'Config',    tabBarIcon: ({ color }) => <Settings  size={24} color={color} /> }} />
      <Tabs.Screen name="alert-detail" options={{ href: null }} />
      <Tabs.Screen name="history"      options={{ href: null }} />
      <Tabs.Screen name="profile"      options={{ href: null }} />
      <Tabs.Screen name="register"     options={{ href: null }} />
      <Tabs.Screen name="roles"        options={{ href: null }} />
    </Tabs>
  );
}
