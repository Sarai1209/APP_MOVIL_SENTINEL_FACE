import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Fingerprint, Lock, Mail, ShieldCheck, User } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/theme';
import { useAuth, UserRole } from '../context/AuthContext';
 
export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
 
  const [role, setRole]               = useState<'user' | 'admin'>('user');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
 
  const backgroundImage = require('../assets/images/facial_scan_bg.png');
  const faceAnim = useRef(new Animated.Value(0.3)).current;
 
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(faceAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(faceAnim, { toValue: 0.3, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);
 
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor ingresa tus credenciales.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password, role as UserRole);
      if (role === 'admin') {
        router.replace('/(admin)/dashboard');
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (e: any) {
      setError(e.message ?? 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <StatusBar barStyle="light-content" />
 
      <LinearGradient
        colors={Colors.Gradients.overlay as any}
        style={StyleSheet.absoluteFill}
      />
 
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
 
          {/* Logo animado */}
          <Animated.View style={[styles.logoContainer, { opacity: faceAnim }]}>
            <LinearGradient
              colors={Colors.Gradients.primary as any}
              style={styles.logoGlow}
            >
              <View style={styles.logoInner}>
                <Eye color="white" size={45} />
              </View>
            </LinearGradient>
          </Animated.View>
 
          <Text style={styles.title}>Sentinel Face</Text>
          <Text style={styles.subtitle}>SISTEMA DE ACCESO</Text>
 
          <View style={styles.loginCard}>
 
            {/* Selector de rol */}
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[styles.roleTab, role === 'user' && styles.roleActive]}
                onPress={() => setRole('user')}
              >
                <User color={role === 'user' ? 'white' : 'rgba(255,255,255,0.4)'} size={16} />
                <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>USUARIO</Text>
              </TouchableOpacity>
 
              <TouchableOpacity
                style={[styles.roleTab, role === 'admin' && styles.roleActive]}
                onPress={() => setRole('admin')}
              >
                <ShieldCheck color={role === 'admin' ? 'white' : 'rgba(255,255,255,0.4)'} size={16} />
                <Text style={[styles.roleText, role === 'admin' && styles.roleTextActive]}>ADMIN</Text>
              </TouchableOpacity>
            </View>
 
            {/* Input Email */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{role === 'admin' ? 'ADMIN ID' : 'USUARIO ID'}</Text>
              <View style={styles.inputContainer}>
                <Mail color="rgba(255,255,255,0.4)" size={18} style={styles.iconStyle} />
                <TextInput
                  placeholder={role === 'admin' ? 'admin@sentinel.com' : 'usuario@sentinel.com'}
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>
 
            {/* Input Contraseña */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>CONTRASEÑA</Text>
              <View style={styles.inputContainer}>
                <Lock color="rgba(255,255,255,0.4)" size={18} style={styles.iconStyle} />
                <TextInput
                  placeholder="••••••••••••"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword
                    ? <Eye color="white" size={18} />
                    : <EyeOff color="rgba(255,255,255,0.4)" size={18} />}
                </TouchableOpacity>
              </View>
            </View>
 
            {/* Error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
 
            {/* Botón */}
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              <LinearGradient
                colors={role === 'admin' ? Colors.Gradients.admin as any : Colors.Gradients.primary as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <View style={styles.buttonInner}>
                  {loading
                    ? <ActivityIndicator color="white" />
                    : <>
                        <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
                        <Fingerprint color="white" size={20} />
                      </>
                  }
                </View>
              </LinearGradient>
            </TouchableOpacity>
 
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
 
const styles = StyleSheet.create({
  container:    { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  content: {
    alignItems:       'center',
    paddingHorizontal: 25,
    paddingTop:       Platform.OS === 'android' ? 60 : 30,
    paddingBottom:    40,
  },
  logoContainer: { marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
  logoGlow: {
    width: 100, height: 100, borderRadius: 50, padding: 2,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.dark.pinkNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9, shadowRadius: 20, elevation: 20,
  },
  logoInner: {
    width: '100%', height: '100%', backgroundColor: '#050514',
    borderRadius: 50, justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 26, fontWeight: '300', color: 'white',
    letterSpacing: 6, textTransform: 'uppercase',
    textAlign: 'center', marginBottom: 5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)', fontSize: 9,
    letterSpacing: 3, textAlign: 'center', marginBottom: 40,
  },
  loginCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20, padding: 25,
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)',
  },
  roleSelector: {
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12, padding: 4, marginBottom: 30,
  },
  roleTab: {
    flex: 1, flexDirection: 'row', paddingVertical: 12,
    justifyContent: 'center', alignItems: 'center', borderRadius: 10,
  },
  roleActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)',
  },
  roleText:       { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold', marginLeft: 8, letterSpacing: 1.5 },
  roleTextActive: { color: 'white' },
  inputWrapper:   { marginBottom: 25 },
  label:          { color: 'rgba(140,120,255,0.8)', fontSize: 9, marginBottom: 10, fontWeight: '600', letterSpacing: 2 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12,
    paddingHorizontal: 15, height: 52,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  input:     { flex: 1, color: 'white', fontSize: 14 },
  iconStyle: { marginRight: 12 },
  errorText: { color: Colors.dark.redAlert, fontSize: 12, marginBottom: 12, textAlign: 'center' },
  button:         { width: '100%', height: 58, marginTop: 10 },
  buttonGradient: { flex: 1, borderRadius: 15, justifyContent: 'center' },
  buttonInner:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonText:     { color: 'white', fontWeight: '600', marginRight: 12, letterSpacing: 2 },
});