import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext';
 
export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)"  options={{ gestureEnabled: false }} />
          <Stack.Screen name="(admin)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  );
}