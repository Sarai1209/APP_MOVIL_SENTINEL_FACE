import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AlertTriangle, CheckCircle, Clock, Shield, TrendingUp, Users } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useMockData } from '../../context/MockDataContext';

const C = Colors.dark;

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `Hace ${diff}s`;
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  return `Hace ${Math.floor(diff / 3600)}h`;
}

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
  const { user }                          = useAuth();
  const { logs, employees, alerts }       = useMockData();
  const router                            = useRouter();

  const granted     = logs.filter(l => l.access_result === 'GRANTED').length;
  const pending     = alerts.filter(a => !a.resolved).length;
  const successRate = logs.length > 0 ? Math.round((granted / logs.length) * 100) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenido,</Text>
          <Text style={styles.name}>{user?.name}</Text>
        </View>
        <View style={styles.shieldWrap}>
          <Shield size={22} color={C.adminGold} />
        </View>
      </View>

      <LinearGradient colors={Colors.Gradients.admin as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.adminBadge}>
        <Shield size={16} color="#050514" />
        <Text style={styles.adminBadgeText}>PANEL DE ADMINISTRACIÓN</Text>
      </LinearGradient>

      <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(admin)/history')}>
        <Clock size={18} color={C.purpleNeon} />
        <Text style={styles.quickTxt}>Ver historial completo de accesos</Text>
        <Text style={styles.quickArrow}>›</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>RESUMEN DEL SISTEMA</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Empleados"     value={employees.length}  color={C.blueNeon}  icon={Users}         />
        <StatCard label="Accesos hoy"   value={granted}           color={C.greenNeon} icon={CheckCircle}   />
        <StatCard label="Alertas"       value={pending}           color={C.redAlert}  icon={AlertTriangle} />
        <StatCard label="Tasa de éxito" value={`${successRate}%`} color={C.adminGold} icon={TrendingUp}    />
      </View>

      <Text style={styles.sectionTitle}>ACTIVIDAD RECIENTE</Text>
      {logs.slice(0, 8).map(item => (
        <View key={item.log_id} style={styles.activityRow}>
          <View style={[styles.dot, { backgroundColor: item.access_result === 'GRANTED' ? Colors.Status.success : Colors.Status.error }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.activityName}>{item.full_name ?? 'Desconocido'}</Text>
            <Text style={styles.activityTime}>{timeAgo(item.event_time)}</Text>
          </View>
          <Text style={[styles.activityStatus, { color: item.access_result === 'GRANTED' ? Colors.Status.success : Colors.Status.error }]}>
            {item.access_result === 'GRANTED' ? 'Acceso' : 'Denegado'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  content:   { padding: 20, paddingTop: 60, paddingBottom: 30 },
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting:  { color: C.textMuted, fontSize: 13 },
  name:      { color: C.text, fontSize: 22, fontWeight: '700' },
  shieldWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: `${C.adminGold}15`, borderWidth: 1, borderColor: `${C.adminGold}30`, alignItems: 'center', justifyContent: 'center' },
  adminBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, marginBottom: 16, gap: 8 },
  adminBadgeText: { color: '#050514', fontWeight: '800', fontSize: 11, letterSpacing: 2 },
  quickBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: `${C.purpleNeon}25`, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 24 },
  quickTxt:   { flex: 1, color: C.textMuted, fontSize: 13 },
  quickArrow: { color: C.purpleNeon, fontSize: 20 },
  sectionTitle: { color: C.textMuted, fontSize: 11, letterSpacing: 2, marginBottom: 14, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statCard:  { width: '47%', borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  statGradient: { padding: 16, gap: 6 },
  statValue: { fontSize: 26, fontWeight: '800' },
  statLabel: { color: C.textMuted, fontSize: 12 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  dot:            { width: 8, height: 8, borderRadius: 4 },
  activityName:   { color: C.text, fontSize: 14, fontWeight: '500' },
  activityTime:   { color: C.textMuted, fontSize: 12, marginTop: 2 },
  activityStatus: { fontSize: 12, fontWeight: '600' },
});
