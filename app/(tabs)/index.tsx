import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Fingerprint } from 'lucide-react-native';
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#0f0c29', Colors.dark.background]} 
      style={styles.container}
    >
      <View style={styles.content}> 
        {/* Círculo del logo */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[Colors.dark.purpleNeon, Colors.dark.pinkNeon]}
            style={styles.logoGlow}
          >
            <View style={styles.logoInner}>
               <Fingerprint color="white" size={50} />
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.title}>SENTINEL FACE</Text>
        <Text style={styles.subtitle}>AUTENTICACIÓN BIOMÉTRICA</Text>

        {/* Inputs */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>CORREO</Text>
          <TextInput 
            placeholder="usuario@gmail.com" 
            placeholderTextColor="#444" 
            style={styles.input} 
          />
        </View>

        {/* Botón */}
        <TouchableOpacity style={styles.button}>
          <LinearGradient
            colors={[Colors.dark.purpleNeon, Colors.dark.pinkNeon]}
            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  logoContainer: { marginBottom: 20 },
  logoGlow: { width: 110, height: 110, borderRadius: 55, padding: 3, justifyContent: 'center', alignItems: 'center' },
  logoInner: { width: '100%', height: '100%', backgroundColor: '#050505', borderRadius: 55, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', letterSpacing: 4 },
  subtitle: { color: Colors.dark.purpleNeon, fontSize: 10, letterSpacing: 2, marginBottom: 40, fontWeight: 'bold' },
  inputBox: { width: '100%', marginBottom: 15 },
  label: { color: Colors.dark.pinkNeon, fontSize: 10, marginBottom: 8, fontWeight: 'bold' },
  input: { backgroundColor: Colors.dark.cardBg, color: 'white', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  button: { width: '100%', height: 60, marginTop: 30 },
  buttonGradient: { flex: 1, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', letterSpacing: 2, fontSize: 16 }
});