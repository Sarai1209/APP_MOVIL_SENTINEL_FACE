import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../../constants/theme';
import { api } from '../../services/api';

const C = Colors.dark;

function groupByDate(logs: any[]): Record<string, any[]> {
  return logs.reduce((acc, log) => {
    const d   = new Date(log.event_time);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let label: string;
    if (d.toDateString() === today.toDateString()) label = 'Hoy';
    else if (d.toDateString() === yesterday.toDateString()) label = 'Ayer';
    else label = d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

    if (!acc[label]) acc[label] = [];
    acc[label].push(log);
    return acc;
  }, {} as Record<string, any[]>);
}

function timeStr(iso: string) {
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function ReportsScreen() {
  const [logs,    setLogs]    = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const fetchLogs = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefresh(true) : setLoading(true);
    try {
      const { data } = await api.getLogs({ limit: 100 });
      setLogs(data.logs ?? []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const grouped  = groupByDate(logs);
  const granted  = logs.filter(l => l.access_result === 'GRANTED').length;
  const denied   = logs.filter(l => l.access_result === 'DENIED').length;
  const spoofing = logs.filter(l => l.liveness === 'SPOOFING').length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={() => fetchLogs(true)}
          tintColor={C.adminGold} colors={[C.adminGold]} />
      }
    >
      <Text style={styles.title}>Reportes de acceso</Text>

      <View style={styles.summaryRow}>
        {[
          { label: 'Accesos',    value: granted,  color: Colors.Status.success },
          { label: 'Denegados',  value: denied,   color: Colors.Status.error   },
          { label: 'Spoofing',   value: spoofing,  color: Colors.Status.warning },
        ].map((s, i) => (
          <LinearGradient
            key={i}
            colors={[`${s.color}20`, `${s.color}05`]}
            style={[styles.summaryCard, { borderColor: `${s.color}30` }]}
          >
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </LinearGradient>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={C.adminGold} style={{ marginTop: 30 }} />
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <View key={date}>
            <Text style={styles.dateLabel}>{date} ({items.length})</Text>
            {items.map((item, idx) => {
              const ok    = item.access_result === 'GRANTED';
              const spoof = item.liveness === 'SPOOFING';
              const color = ok ? Colors.Status.success : spoof ? Colors.Status.warning : Colors.Status.error;
              return (
                <View key={item.log_id} style={styles.reportRow}>
                  <View style={[styles.iconWrap, { backgroundColor: `${color}15` }]}>
                    {ok
                      ? <CheckCircle  size={16} color={color} />
                      : spoof
                        ? <AlertTriangle size={16} color={color} />
                        : <XCircle size={16} color={color} />
                    }
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reportUser}>{item.full_name ?? 'Desconocido'}</Text>
                    <Text style={styles.reportAction}>
                      {ok ? 'Acceso concedido' : spoof ? 'Intento de spoofing' : 'Acceso denegado'}
                      {item.confidence > 0 && ` · ${(item.confidence * 100).toFixed(0)}%`}
                    </Text>
                  </View>
                  <Text style={styles.reportTime}>{timeStr(item.event_time)}</Text>
                </View>
              );
            })}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  content:   { padding: 20, paddingTop: 60, paddingBottom: 30 },
  title:     { color: C.text, fontSize: 22, fontWeight: '700', marginBottom: 20 },
  summaryRow:  { flexDirection: 'row', gap: 10, marginBottom: 28 },
  summaryCard: { flex: 1, borderRadius: 14, borderWidth: 1, paddingVertical: 14, alignItems: 'center' },
  summaryValue: { fontSize: 24, fontWeight: '800' },
  summaryLabel: { color: C.textMuted, fontSize: 11, marginTop: 2 },
  dateLabel: {
    color: C.textMuted, fontSize: 11, fontWeight: '600',
    letterSpacing: 1.5, marginBottom: 8, marginTop: 16,
  },
  reportRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  iconWrap:     { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  reportUser:   { color: C.text, fontSize: 14, fontWeight: '500' },
  reportAction: { color: C.textMuted, fontSize: 12, marginTop: 2 },
  reportTime:   { color: C.textMuted, fontSize: 12 },
});
