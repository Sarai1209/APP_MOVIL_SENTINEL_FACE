import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { MockDataProvider } from '../context/MockDataContext';
import { Colors } from '../constants/theme';

function RootNavigator() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#050514', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.dark.adminGold} />
      </View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(admin)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)"  options={{ gestureEnabled: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MockDataProvider>
        <RootNavigator />
      </MockDataProvider>
    </AuthProvider>
  );
}
