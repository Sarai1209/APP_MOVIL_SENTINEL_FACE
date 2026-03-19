import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#050514', '#0a0a25']} 
        style={StyleSheet.absoluteFill} 
      />
      
      {/* Header del Perfil */}
      <View style={styles.header}>
        <View style={styles.avatarGlow}>
          <View style={styles.avatarInner}>
            <UserIcon color={Colors.dark.pinkNeon} size={40} />
          </View>
        </View>
        <Text style={styles.userName}>Usuario</Text>
        <Text style={styles.userSub}>sistema</Text>
      </View>

      {/* Sección de Opciones */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <ShieldCheck color="rgba(255,255,255,0.6)" size={20} />
          <Text style={styles.menuText}>Seguridad y Permisos</Text>
          <ChevronRight color="rgba(255,255,255,0.3)" size={18} />
        </TouchableOpacity>

        {/* Botón de salirse */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <LogOut color="#ff4444" size={20} />
          <Text style={styles.logoutText}>DESCONECTARSE</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Sentinel face</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050514' },
  header: { 
    alignItems: 'center', 
    marginTop: Platform.OS === 'ios' ? 80 : 60,
    marginBottom: 40 
  },
  avatarGlow: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.pinkNeon,
    shadowColor: Colors.dark.pinkNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 20,
  },
  avatarInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#050514',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: '300', 
    letterSpacing: 4,
    textTransform: 'uppercase'
  },
  userSub: { 
    color: 'rgba(255, 255, 255, 0.4)', 
    fontSize: 10, 
    marginTop: 8,
    letterSpacing: 2
  },
  menuContainer: {
    paddingHorizontal: 25,
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuText: { 
    flex: 1, 
    color: 'rgba(255,255,255,0.8)', 
    marginLeft: 15, 
    fontSize: 14 
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.08)',
    padding: 18,
    borderRadius: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.2)',
  },
  logoutText: { 
    color: '#ff4444', 
    fontWeight: 'bold', 
    marginLeft: 15, 
    letterSpacing: 1.5,
    fontSize: 13
  },
  version: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    letterSpacing: 1
  }
});