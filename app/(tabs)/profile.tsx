import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, History, KeyRound, LogOut, User } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StatusBadge from '../../components/ui/StatusBadge';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
 
const MENU = [
  { icon: User,    label: 'Editar perfil',         route: '/(user)/edit-profile'    },
  { icon: KeyRound,label: 'Cambiar contraseña',    route: '/(user)/change-password' },
  { icon: History, label: 'Historial de escaneos', route: '/(user)/history'         },
];
 
export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
 
  // Genera iniciales a partir del nombre real del usuario
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';
 
  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => { logout(); router.replace('/'); } },
    ]);
  };
 
  const C = Colors.dark;
 
  return (
    <LinearGradient colors={['#050514', '#0D0D2B', '#050514']} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Mi perfil</Text>
 
        {/* Avatar con iniciales del usuario real */}
        <View style={styles.avatarSection}>
          <LinearGradient colors={Colors.Gradients.primary} style={styles.avatar}>
            <Text style={styles.avatarTxt}>{initials}</Text>
          </LinearGradient>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {/* StatusBadge reutilizable mostrando rol */}
          <StatusBadge status="active" label={user?.role === 'admin' ? 'Administrador' : 'Usuario'} />
        </View>
 
        {/* Info de cuenta — GET /api/users/me */}
        <View style={styles.infoCard}>
          {[
            { label: 'ID de usuario',    value: user?.id ?? '—' },
            { label: 'Estado',           value: 'Activo'         },
            { label: 'Último acceso',    value: 'Hoy, 09:34 a.m.' },
          ].map((item, i) => (
            <View key={i} style={[styles.infoRow, i > 0 && styles.rowDivider]}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
 
        {/* Menú de opciones */}
        <View style={styles.menuCard}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuRow, i > 0 && styles.rowDivider]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuIcon}>
                <item.icon size={18} color={C.pinkNeon} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={15} color={C.textSubtle} />
            </TouchableOpacity>
          ))}
        </View>
 
        {/* Cerrar sesión */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut size={18} color={Colors.Status.error} />
          <Text style={styles.logoutTxt}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}
 
const C = Colors.dark;
 
const styles = StyleSheet.create({
  bg:        { flex: 1 },
  scroll:    { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: C.text, marginBottom: 28 },
 
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarTxt:     { color: '#fff', fontSize: 28, fontWeight: '700' },
  name:          { fontSize: 20, fontWeight: '700', color: C.text },
  email:         { fontSize: 13, color: C.textMuted, marginTop: 4, marginBottom: 10 },
 
  infoCard: {
    backgroundColor: C.surface, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 16,
  },
  infoRow:    { flexDirection: 'row', justifyContent: 'space-between', padding: 14 },
  rowDivider: { borderTopWidth: 1, borderTopColor: C.border },
  infoLabel:  { color: C.textMuted, fontSize: 13 },
  infoValue:  { color: C.text, fontSize: 13, fontWeight: '500' },
 
  menuCard: {
    backgroundColor: C.surface, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 20,
  },
  menuRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,0,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, color: C.text, fontSize: 14 },
 
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1, borderColor: 'rgba(255,61,113,0.25)',
    borderRadius: 14, paddingVertical: 14,
    backgroundColor: 'rgba(255,61,113,0.06)',
  },
  logoutTxt: { color: Colors.Status.error, fontSize: 15, fontWeight: '600' },
});