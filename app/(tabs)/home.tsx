import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, History, RefreshCw, ScanFace, ShieldCheck } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const C = Colors.dark;

interface LogEntry {
  log_id:        number;
  full_name:     string | null;
  access_result: 'GRANTED' | 'DENIED';
  event_time:    string;
  liveness:      string;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `Hace ${diff}s`;
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  return `Hace ${Math.floor(diff / 3600)}h`;
}

export default function HomeScreen() {
  const { user }  = useAuth();
  const router    = useRouter();

  const [logs,     setLogs]     = useState<LogEntry[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [refresh,  setRefresh]  = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefresh(true) : setLoading(true);
    try {
      const { data } = await api.getLogs({ limit: 10 });
      setLogs(data.logs ?? []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const granted = logs.filter(l => l.access_result === 'GRANTED').length;
  const denied  = logs.filter(l => l.access_result === 'DENIED').length;

  return (
    <LinearGradient colors={['#050514', '#0D0D2B', '#050514']} style={styles.bg}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={() => fetchData(true)}
            tintColor={C.pinkNeon} colors={[C.pinkNeon]} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bienvenido,</Text>
            <Text style={styles.userName}>{user?.name ?? 'Usuario'}</Text>
          </View>
          <View style={styles.shieldWrap}>
            <ShieldCheck size={26} color={C.pinkNeon} strokeWidth={1.5} />
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusTitle}>Sistema activo y monitoreando</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: C.pinkNeon }]}>{logs.length}</Text>
              <Text style={styles.statLabel}>Registros</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: C.greenNeon }]}>{granted}</Text>
              <Text style={styles.statLabel}>Accesos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: C.redAlert }]}>{denied}</Text>
              <Text style={styles.statLabel}>Denegados</Text>
            </View>
          </View>
        </View>

        <Text style={styles.section}>Acciones rápidas</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/scan')}>
            <ScanFace size={26} color={C.pinkNeon} />
            <Text style={styles.actionTxt}>Escanear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/history')}>
            <History size={26} color={C.purpleNeon} />
            <Text style={styles.actionTxt}>Historial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/alerts')}>
            <Bell size={26} color={C.yellowWarn} />
            <Text style={styles.actionTxt}>Alertas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.section}>Actividad reciente</Text>
          <TouchableOpacity onPress={() => fetchData(true)}>
            <RefreshCw size={16} color={C.textMuted} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={C.pinkNeon} style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.recentCard}>
            {logs.length === 0 ? (
              <Text style={[styles.recentTime, { padding: 16, textAlign: 'center' }]}>
                Sin actividad reciente
              </Text>
            ) : (
              logs.slice(0, 5).map((item, i) => (
                <View key={item.log_id} style={[styles.recentRow, i > 0 && styles.divider]}>
                  <View style={[styles.recentDot, {
                    backgroundColor: item.access_result === 'GRANTED'
                      ? Colors.Status.success : Colors.Status.error,
                  }]} />
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentName}>{item.full_name ?? 'Desconocido'}</Text>
                    <Text style={styles.recentTime}>{timeAgo(item.event_time)}</Text>
                  </View>
                  <Text style={[styles.recentStatus, {
                    color: item.access_result === 'GRANTED'
                      ? Colors.Status.success : Colors.Status.error,
                  }]}>
                    {item.access_result === 'GRANTED' ? 'Autorizado' : 'Denegado'}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg:     { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 13, color: C.textMuted },
  userName: { fontSize: 22, fontWeight: '700', color: C.text, marginTop: 2 },
  shieldWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(255,0,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,0,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: C.surface, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(0,229,160,0.15)',
    padding: 18, marginBottom: 26,
  },
  statusRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  onlineDot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.Status.success },
  statusTitle: { color: Colors.Status.success, fontSize: 13, fontWeight: '600' },
  statsRow:    { flexDirection: 'row', justifyContent: 'space-around' },
  statItem:    { alignItems: 'center' },
  statValue:   { fontSize: 26, fontWeight: '800' },
  statLabel:   { fontSize: 11, color: C.textMuted, marginTop: 3 },
  sectionRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  section:     { fontSize: 15, fontWeight: '600', color: C.text },
  actionsRow:  { flexDirection: 'row', gap: 12, marginBottom: 26 },
  actionCard: {
    flex: 1, backgroundColor: C.surface, borderRadius: 14,
    borderWidth: 1, borderColor: C.border,
    paddingVertical: 18, alignItems: 'center', gap: 8,
  },
  actionTxt:    { color: C.textMuted, fontSize: 12 },
  recentCard:   { backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border },
  recentRow:    { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  divider:      { borderTopWidth: 1, borderTopColor: C.border },
  recentDot:    { width: 8, height: 8, borderRadius: 4 },
  recentInfo:   { flex: 1 },
  recentName:   { color: C.text, fontSize: 14, fontWeight: '500' },
  recentTime:   { color: C.textSubtle, fontSize: 11, marginTop: 2 },
  recentStatus: { fontSize: 12, fontWeight: '600' },
});
