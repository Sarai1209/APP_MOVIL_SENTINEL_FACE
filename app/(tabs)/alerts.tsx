import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, Bell, CheckCircle, Info } from 'lucide-react-native';
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
import { api } from '../../services/api';

type FilterKey = 'all' | 'pending' | 'resolved';

const C = Colors.dark;

function severityColor(severity: string): string {
  if (severity === 'CRITICAL' || severity === 'HIGH') return Colors.Status.error;
  if (severity === 'MEDIUM') return Colors.Status.warning;
  return Colors.Status.info;
}

function alertIcon(type: string, color: string) {
  if (type?.includes('SPOOF') || type?.includes('UNKNOWN')) return <AlertTriangle size={20} color={color} />;
  if (type?.includes('GRANTED'))  return <CheckCircle size={20} color={color} />;
  return <Info size={20} color={color} />;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `Hace ${diff}s`;
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  return `Hace ${Math.floor(diff / 3600)}h`;
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',      label: 'Todas'     },
  { key: 'pending',  label: 'Pendientes'},
  { key: 'resolved', label: 'Resueltas' },
];

export default function AlertsScreen() {
  const [filter,  setFilter]  = useState<FilterKey>('all');
  const [alerts,  setAlerts]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const fetchAlerts = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefresh(true) : setLoading(true);
    try {
      const resolved = filter === 'all' ? undefined : filter === 'resolved' ? 1 : 0;
      const { data } = await api.getAlerts(resolved as any);
      setAlerts(data.alerts ?? []);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, [filter]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const unread = alerts.filter(a => !a.resolved).length;

  return (
    <LinearGradient colors={['#050514', '#0D0D2B', '#050514']} style={styles.bg}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alertas</Text>
          {unread > 0 && <Text style={styles.unread}>{unread} pendientes</Text>}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersWrap} style={styles.filtersScroll}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterTxt, filter === f.key && styles.filterTxtActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={C.pinkNeon} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={() => fetchAlerts(true)}
              tintColor={C.pinkNeon} colors={[C.pinkNeon]} />
          }
        >
          {alerts.length === 0 ? (
            <View style={styles.empty}>
              <Bell size={40} color={C.textSubtle} />
              <Text style={styles.emptyTxt}>Sin alertas en esta categoría</Text>
            </View>
          ) : (
            alerts.map(alert => {
              const color = severityColor(alert.severity);
              return (
                <View key={alert.alert_id} style={[styles.card, !alert.resolved && styles.cardUnread]}>
                  <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
                    {alertIcon(alert.alert_type, color)}
                  </View>
                  <View style={styles.body}>
                    <Text style={styles.alertTitle}>
                      {alert.alert_type?.replace(/_/g, ' ')}
                    </Text>
                    <Text style={styles.alertDesc} numberOfLines={2}>{alert.description}</Text>
                    <Text style={styles.alertTime}>{timeAgo(alert.created_at)}</Text>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={[styles.severityBadge, { backgroundColor: `${color}20`, borderColor: `${color}40` }]}>
                      <Text style={[styles.severityText, { color }]}>{alert.severity}</Text>
                    </View>
                    {alert.resolved && (
                      <CheckCircle size={14} color={Colors.Status.success} />
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10,
  },
  title:    { fontSize: 24, fontWeight: '700', color: C.text },
  unread:   { fontSize: 13, color: C.pinkNeon, marginTop: 2 },
  filtersScroll: { flexGrow: 0 },
  filtersWrap:   { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
  },
  filterBtnActive: { backgroundColor: 'rgba(255,0,255,0.1)', borderColor: 'rgba(255,0,255,0.35)' },
  filterTxt:       { color: C.textMuted, fontSize: 13 },
  filterTxtActive: { color: C.pinkNeon, fontWeight: '600' },
  list:  { paddingHorizontal: 16, paddingBottom: 32, gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: C.surface, borderRadius: 14,
    borderWidth: 1, borderColor: C.border, padding: 13,
  },
  cardUnread: { borderColor: 'rgba(255,0,255,0.18)', backgroundColor: 'rgba(255,0,255,0.04)' },
  iconWrap:   { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  body:       { flex: 1 },
  alertTitle: { color: C.text, fontSize: 13, fontWeight: '600', marginBottom: 3 },
  alertDesc:  { color: C.textMuted, fontSize: 12, lineHeight: 17, marginBottom: 4 },
  alertTime:  { color: C.textSubtle, fontSize: 11 },
  cardRight:  { alignItems: 'flex-end', gap: 6 },
  severityBadge: {
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: 6, borderWidth: 1,
  },
  severityText: { fontSize: 10, fontWeight: '700' },
  empty:    { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTxt: { color: C.textSubtle, fontSize: 14 },
});
