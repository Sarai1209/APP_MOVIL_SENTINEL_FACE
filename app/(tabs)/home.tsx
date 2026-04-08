import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, History, ScanFace, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
 
{/* GET /api/dashboard/stats*/}
const STATS = [
  { label: 'Escaneos hoy', value: '12', color: Colors.dark.pinkNeon },
  { label: 'Accesos',      value: '8',  color: Colors.dark.greenNeon },
  { label: 'Alertas',      value: '2',  color: Colors.dark.yellowWarn },
];
 
const RECENT = [
  { name: 'Juan Pérez',  time: 'Hace 5 min',  ok: true  },
  { name: 'María López', time: 'Hace 22 min', ok: true  },
  { name: 'Desconocido', time: 'Hace 1h',     ok: false },
];
 
export default function HomeScreen() {
  const { user } = useAuth();
  const router   = useRouter();
 
  return (
    <LinearGradient colors={['#050514', '#0D0D2B', '#050514']} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
 
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bienvenida,</Text>
            <Text style={styles.userName}>{user?.name ?? 'Usuario'}</Text>
          </View>
          <View style={styles.shieldWrap}>
            <ShieldCheck size={26} color={Colors.dark.pinkNeon} strokeWidth={1.5} />
          </View>
        </View>
 
        /*GET /api/system/status ── */
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusTitle}>Sistema activo y monitoreando</Text>
          </View>
          <View style={styles.statsRow}>
            {STATS.map(s => (
              <View key={s.label} style={styles.statItem}>
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
 
        {/* Acciones rápidas */}
        <Text style={styles.section}>Acciones rápidas</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/scan')}>
            <ScanFace size={26} color={Colors.dark.pinkNeon} />
            <Text style={styles.actionTxt}>Escanear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(user)/history')}>
            <History size={26} color={Colors.dark.purpleNeon} />
            <Text style={styles.actionTxt}>Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/alerts')}>
            <Bell size={26} color={Colors.dark.yellowWarn} />
            <Text style={styles.actionTxt}>Alertas</Text>
          </TouchableOpacity>
        </View>
 
        {/*Actividad reciente — GET /api/scan/recent ── */}
        <Text style={styles.section}>Actividad reciente</Text>
        <View style={styles.recentCard}>
          {RECENT.map((item, i) => (
            <View key={i} style={[styles.recentRow, i > 0 && styles.divider]}>
              <View style={[styles.recentDot, { backgroundColor: item.ok ? Colors.Status.success : Colors.Status.error }]} />
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>{item.name}</Text>
                <Text style={styles.recentTime}>{item.time}</Text>
              </View>
              <Text style={[styles.recentStatus, { color: item.ok ? Colors.Status.success : Colors.Status.error }]}>
                {item.ok ? 'Autorizado' : 'Denegado'}
              </Text>
            </View>
          ))}
        </View>
 
      </ScrollView>
    </LinearGradient>
  );
}
 
const { dark: C, Status } = Colors;
 
const styles = StyleSheet.create({
  bg:     { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 32 },
 
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting:  { fontSize: 13, color: C.textMuted },
  userName:  { fontSize: 22, fontWeight: '700', color: C.text, marginTop: 2 },
  shieldWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(255,0,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,0,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
 
  statusCard: {
    backgroundColor: C.surface,
    borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(0,229,160,0.15)',
    padding: 18, marginBottom: 26,
  },
  statusRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  onlineDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: Status.success },
  statusTitle: { color: Status.success, fontSize: 13, fontWeight: '600' },
  statsRow:   { flexDirection: 'row', justifyContent: 'space-around' },
  statItem:   { alignItems: 'center' },
  statValue:  { fontSize: 26, fontWeight: '800' },
  statLabel:  { fontSize: 11, color: C.textMuted, marginTop: 3 },
 
  section: { fontSize: 15, fontWeight: '600', color: C.text, marginBottom: 12 },
 
  actionsRow:  { flexDirection: 'row', gap: 12, marginBottom: 26 },
  actionCard: {
    flex: 1,
    backgroundColor: C.surface, borderRadius: 14,
    borderWidth: 1, borderColor: C.border,
    paddingVertical: 18, alignItems: 'center', gap: 8,
  },
  actionTxt: { color: C.textMuted, fontSize: 12 },
 
  recentCard: {
    backgroundColor: C.surface,
    borderRadius: 16, borderWidth: 1, borderColor: C.border,
  },
  recentRow:    { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  divider:      { borderTopWidth: 1, borderTopColor: C.border },
  recentDot:    { width: 8, height: 8, borderRadius: 4 },
  recentInfo:   { flex: 1 },
  recentName:   { color: C.text, fontSize: 14, fontWeight: '500' },
  recentTime:   { color: C.textSubtle, fontSize: 11, marginTop: 2 },
  recentStatus: { fontSize: 12, fontWeight: '600' },
});