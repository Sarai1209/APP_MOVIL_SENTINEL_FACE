import { useRouter } from 'expo-router';
import { Bell, ChevronRight, LogOut, Moon, Shield, Sliders } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const C = Colors.dark;

const SettingRow = ({ icon: Icon, color, label, value, onPress, isSwitch, switchValue, onToggle }: any) => (
  <TouchableOpacity style={styles.row} onPress={onPress} disabled={isSwitch && !onPress} activeOpacity={0.7}>
    <View style={[styles.iconWrap, { backgroundColor: `${color}15` }]}>
      <Icon size={18} color={color} />
    </View>
    <Text style={styles.rowLabel}>{label}</Text>
    {isSwitch
      ? <Switch value={switchValue} onValueChange={onToggle} thumbColor="white" trackColor={{ true: C.adminGold, false: C.border }} />
      : <View style={styles.rowRight}>
          {value && <Text style={styles.rowValue}>{value}</Text>}
          <ChevronRight size={16} color={C.textMuted} />
        </View>
    }
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router           = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode,       setDarkMode]      = useState(true);
  const [sensitivity,    setSensitivity]   = useState<'Alta' | 'Media' | 'Baja'>('Alta');

  const cycleSensitivity = () => {
    setSensitivity(p => p === 'Alta' ? 'Media' : p === 'Media' ? 'Baja' : 'Alta');
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión del panel de administración?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión', style: 'destructive',
          onPress: async () => { await logout(); router.replace('/'); },
        },
      ]
    );
  };

  const handleAudit = () => {
    Alert.alert('Registros de auditoría', 'Consulta los registros completos desde el endpoint GET /api/audit del backend.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Configuración</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? 'A'}</Text>
        </View>
        <View>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
      </View>

      <Text style={styles.section}>SISTEMA</Text>
      <View style={styles.group}>
        <SettingRow icon={Bell}    color={C.blueNeon}   label="Notificaciones de alerta" isSwitch switchValue={notifications} onToggle={setNotifications} />
        <SettingRow icon={Moon}    color={C.purpleNeon}  label="Modo oscuro"              isSwitch switchValue={darkMode}       onToggle={setDarkMode} />
        <SettingRow icon={Sliders} color={C.adminGold}   label="Sensibilidad de reconocimiento" value={sensitivity} onPress={cycleSensitivity} />
      </View>

      <Text style={styles.section}>SEGURIDAD</Text>
      <View style={styles.group}>
        <SettingRow icon={Shield} color={C.greenNeon} label="Gestión de roles"       onPress={() => router.push('/(admin)/roles')} />
        <SettingRow icon={Shield} color={C.redAlert}  label="Registros de auditoría" onPress={handleAudit} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <LogOut size={18} color={C.redAlert} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.background },
  content:      { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title:        { color: C.text, fontSize: 22, fontWeight: '700', marginBottom: 20 },
  profileCard:  { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 28 },
  avatar:       { width: 50, height: 50, borderRadius: 25, backgroundColor: `${C.adminGold}20`, justifyContent: 'center', alignItems: 'center' },
  avatarText:   { color: C.adminGold, fontSize: 20, fontWeight: '700' },
  profileName:  { color: C.text, fontSize: 16, fontWeight: '600' },
  profileEmail: { color: C.textMuted, fontSize: 13, marginTop: 2 },
  section:      { color: C.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 10, marginTop: 4 },
  group:        { backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 22, overflow: 'hidden' },
  row:          { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  iconWrap:     { width: 34, height: 34, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  rowLabel:     { flex: 1, color: C.text, fontSize: 15 },
  rowRight:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue:     { color: C.textMuted, fontSize: 13 },
  logoutBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1, borderColor: `${C.redAlert}40`, borderRadius: 14, paddingVertical: 16, marginTop: 8 },
  logoutText:   { color: C.redAlert, fontSize: 15, fontWeight: '600' },
});
