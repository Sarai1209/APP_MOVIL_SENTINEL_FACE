import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/theme';
 
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Pantalla no encontrada</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Volver al inicio</Text>
        </Link>
      </View>
    </>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.dark.background,
  },
  code:     { fontSize: 72, fontWeight: '800', color: Colors.dark.pinkNeon, opacity: 0.5 },
  title:    { fontSize: 18, color: Colors.dark.textMuted, marginTop: 8, marginBottom: 24 },
  link:     { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.dark.border },
  linkText: { color: Colors.dark.text, fontSize: 15 },
});