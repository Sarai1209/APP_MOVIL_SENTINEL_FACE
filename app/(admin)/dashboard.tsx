import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AlertTriangle, CheckCircle, LogOut, Shield, TrendingUp, Users } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
 
const StatCard = ({ label, value, color, icon: Icon }: any) => (
  <View style={[styles.statCard, { borderColor: `${color}30` }]}>
    <LinearGradient colors={[`${color}15`, `${color}05`]} style={styles.statGradient}>
      <Icon size={20} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  </View>
);
 
export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
 
  const handleLogout = () => {
    logout();
    router.replace('/');
  };
 
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
 
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenido,</Text>
          <Text style={styles.name}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut size={20} color={Colors.dark.textMuted} />
        </TouchableOpacity>
      </View>
 
      {/* Badge admin */}
      <LinearGradient
        colors={Colors.Gradients.admin as any}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.adminBadge}
      >
        <Shield size={16} color="#050514" />
        <Text style={styles.adminBadgeText}>PANEL DE ADMINISTRACIÓN</Text>
      </LinearGradient>
 
      {/* Stats */}
      <Text style={styles.sectionTitle}>Resumen del sistema</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Usuarios"       value="124"  color={Colors.dark.blueNeon}  icon={Users}         />
        <StatCard label="Accesos hoy"    value="38"   color={Colors.dark.greenNeon} icon={CheckCircle}   />
        <StatCard label="Alertas"        value="3"    color={Colors.dark.redAlert}  icon={AlertTriangle} />
        <StatCard label="Tasa de éxito"  value="97%"  color={Colors.dark.adminGold} icon={TrendingUp}    />
      </View>
 
      {/* Accesos recientes */}
      <Text style={styles.sectionTitle}>Actividad reciente</Text>
      {[
        { name: 'Sarai Díaz',    time: 'Hace 5 min',  status: 'success' },
        { name: 'Carlos López',  time: 'Hace 12 min', status: 'success' },
        { name: 'Usuario #091',  time: 'Hace 18 min', status: 'blocked' },
        { name: 'María Torres',  time: 'Hace 25 min', status: 'success' },
      ].map((item, i) => (
        <View key={i} style={styles.activityRow}>
          <View style={[styles.dot, { backgroundColor: item.status === 'success' ? Colors.Status.success : Colors.Status.error }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.activityName}>{item.name}</Text>
            <Text style={styles.activityTime}>{item.time}</Text>
          </View>
          <Text style={[styles.activityStatus, {
            color: item.status === 'success' ? Colors.Status.success : Colors.Status.error,
          }]}>
            {item.status === 'success' ? 'Acceso' : 'Bloqueado'}
          </Text>
        </View>
      ))}
 
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  content:   { padding: 20, paddingTop: 60, paddingBottom: 30 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  greeting:  { color: Colors.dark.textMuted, fontSize: 13 },
  name:      { color: Colors.dark.text, fontSize: 22, fontWeight: '700' },
  logoutBtn: { padding: 10 },
  adminBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 12, marginBottom: 28, gap: 8,
  },
  adminBadgeText: { color: '#050514', fontWeight: '800', fontSize: 11, letterSpacing: 2 },
  sectionTitle:   { color: Colors.dark.textMuted, fontSize: 11, letterSpacing: 2, marginBottom: 14, fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28,
  },
  statCard: {
    width: '47%', borderRadius: 16, borderWidth: 1, overflow: 'hidden',
  },
  statGradient: { padding: 16, gap: 6 },
  statValue:    { fontSize: 26, fontWeight: '800' },
  statLabel:    { color: Colors.dark.textMuted, fontSize: 12 },
  activityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.dark.border,
  },
  dot:            { width: 8, height: 8, borderRadius: 4 },
  activityName:   { color: Colors.dark.text, fontSize: 14, fontWeight: '500' },
  activityTime:   { color: Colors.dark.textMuted, fontSize: 12, marginTop: 2 },
  activityStatus: { fontSize: 12, fontWeight: '600' },
});