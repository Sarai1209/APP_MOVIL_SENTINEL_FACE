import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
// Requerido por el plugin de Babel de react-native-reanimated para inicializar
// el motor de animaciones antes de que cualquier componente lo use.
// Ver: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation
import "react-native-reanimated";
import { Colors } from "../constants/theme";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";

function RootNavigator() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const darkMode = useSettingsStore((s) => s.darkMode);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#050514",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.dark.adminGold} />
      </View>
    );
  }

  return (
    <ThemeProvider value={darkMode ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(admin)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={darkMode ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return <RootNavigator />;
}
