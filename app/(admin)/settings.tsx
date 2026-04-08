import { useRouter } from 'expo-router';
import { Bell, ChevronRight, LogOut, Moon, Shield, Sliders } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
 
const SettingRow = ({ icon: Icon, color, label, value, onPress, isSwitch, switchValue, onToggle }: any) => (
  <TouchableOpacity style={styles.row} onPress={onPress} disabled={isSwitch}>
    <View style={[styles.iconWrap, { backgroundColor: `${color}15` }]}>
      <Icon size={18} color={color} />
    </View>
    <Text style={styles.rowLabel}>{label}</Text>
    {isSwitch
      ? <Switch value={switchValue} onValueChange={onToggle} thumbColor="white" trackColor={{ true: Colors.dark.adminGold, false: Colors.dark.border }} />
      : <View style={styles.rowRight}>
          {value && <Text style={styles.rowValue}>{value}</Text>}
          <ChevronRight size={16} color={Colors.dark.textMuted} />
        </View>
    }
  </TouchableOpacity>
);
 
export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode]           = useState(true);
 
  const handleLogout = () => {
    logout();
    router.replace('/');
  };
 
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
 
      <Text style={styles.title}>Configuración</Text>
 
      {/* Perfil */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0] ?? 'A'}</Text>
        </View>
        <View>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
      </View>
 
      <Text style={styles.section}>SISTEMA</Text>
      <View style={styles.group}>
        <SettingRow icon={Bell}    color={Colors.dark.blueNeon}  label="Notificaciones" isSwitch switchValue={notifications} onToggle={setNotifications} />
        <SettingRow icon={Moon}    color={Colors.dark.purpleNeon} label="Modo oscuro"   isSwitch switchValue={darkMode}       onToggle={setDarkMode}       />
        <SettingRow icon={Sliders} color={Colors.dark.adminGold} label="Sensibilidad facial" value="Alta" />
      </View>
 
      <Text style={styles.section}>SEGURIDAD</Text>
      <View style={styles.group}>
        <SettingRow icon={Shield} color={Colors.dark.greenNeon} label="Gestión de roles" />
        <SettingRow icon={Shield} color={Colors.dark.redAlert}  label="Registros de auditoría" />
      </View>
 
      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color={Colors.dark.redAlert} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
 
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  content:   { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title:     { color: Colors.dark.text, fontSize: 22, fontWeight: '700', marginBottom: 20 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.dark.surface, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.dark.border,
    padding: 16, marginBottom: 28,
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: `${Colors.dark.adminGold}20`,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText:    { color: Colors.dark.adminGold, fontSize: 20, fontWeight: '700' },
  profileName:   { color: Colors.dark.text, fontSize: 16, fontWeight: '600' },
  profileEmail:  { color: Colors.dark.textMuted, fontSize: 13, marginTop: 2 },
  section: {
    color: Colors.dark.textMuted, fontSize: 10, fontWeight: '700',
    letterSpacing: 2, marginBottom: 10, marginTop: 4,
  },
  group: {
    backgroundColor: Colors.dark.surface, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.dark.border, marginBottom: 22, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.dark.border,
  },
  iconWrap:   { width: 34, height: 34, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  rowLabel:   { flex: 1, color: Colors.dark.text, fontSize: 15 },
  rowRight:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue:   { color: Colors.dark.textMuted, fontSize: 13 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1, borderColor: `${Colors.dark.redAlert}40`,
    borderRadius: 14, paddingVertical: 16, marginTop: 8,
  },
  logoutText: { color: Colors.dark.redAlert, fontSize: 15, fontWeight: '600' },
});