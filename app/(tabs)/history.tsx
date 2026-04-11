import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Clock, RefreshCw, XCircle } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/theme';
import { api } from '../../services/api';

const C = Colors.dark;
const POLL_INTERVAL = 10000; // 10 segundos

interface LogEntry {
  log_id:        number;
  full_name:     string | null;
  access_result: 'GRANTED' | 'DENIED';
  liveness:      string;
  confidence:    number;
  event_time:    string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('es-CO', {
    day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

export default function HistoryScreen() {
  const [logs,       setLogs]     = useState<LogEntry[]>([]);
  const [loading,    setLoading]  = useState(true);
  const [refresh,    setRefresh]  = useState(false);
  const [liveMode,   setLiveMode] = useState(true);
  const [lastUpdate, setUpdate]   = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLogs = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefresh(true) : (logs.length === 0 && setLoading(true));
    try {
      const { data } = await api.getLogs({ limit: 50 });
      setLogs(data.logs ?? []);
      setUpdate(new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // mantener datos anteriores en caso de error de red
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (liveMode) {
      timerRef.current = setInterval(() => fetchLogs(), POLL_INTERVAL);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [liveMode, fetchLogs]);

  const granted = logs.filter(l => l.access_result === 'GRANTED').length;
  const denied  = logs.filter(l => l.access_result === 'DENIED').length;

  const renderItem = ({ item, index }: { item: LogEntry; index: number }) => {
    const ok    = item.access_result === 'GRANTED';
    const color = ok ? Colors.Status.success : Colors.Status.error;
    return (
      <View style={[styles.row, index > 0 && styles.divider]}>
        <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
          {ok
            ? <CheckCircle size={18} color={color} />
            : <XCircle    size={18} color={color} />
          }
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.full_name ?? 'Desconocido'}</Text>
          <Text style={styles.meta}>
            {formatDate(item.event_time)}
            {item.liveness !== 'UNKNOWN' && ` · ${item.liveness}`}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.result, { color }]}>{ok ? 'ACCESO' : 'DENEGADO'}</Text>
          {item.confidence > 0 && (
            <Text style={styles.confidence}>{(item.confidence * 100).toFixed(0)}%</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#050514', '#0D0D2B', '#050514']} style={styles.bg}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Historial de accesos</Text>
          {lastUpdate ? (
            <Text style={styles.sub}>Actualizado: {lastUpdate}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.liveBtn, liveMode && styles.liveBtnActive]}
          onPress={() => setLiveMode(p => !p)}
        >
          <Clock size={14} color={liveMode ? C.greenNeon : C.textMuted} />
          <Text style={[styles.liveTxt, liveMode && styles.liveTxtActive]}>
            {liveMode ? 'EN VIVO' : 'PAUSADO'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <View style={[styles.summaryCard, { borderColor: `${Colors.Status.success}30` }]}>
          <Text style={[styles.summaryVal, { color: Colors.Status.success }]}>{granted}</Text>
          <Text style={styles.summaryLbl}>Accesos</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: `${Colors.Status.error}30` }]}>
          <Text style={[styles.summaryVal, { color: Colors.Status.error }]}>{denied}</Text>
          <Text style={styles.summaryLbl}>Denegados</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: `${C.blueNeon}30` }]}>
          <Text style={[styles.summaryVal, { color: C.blueNeon }]}>{logs.length}</Text>
          <Text style={styles.summaryLbl}>Total</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={C.pinkNeon} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={item => String(item.log_id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => fetchLogs(true)}
              tintColor={C.pinkNeon}
              colors={[C.pinkNeon]}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <RefreshCw size={36} color={C.textSubtle} />
              <Text style={styles.emptyTxt}>Sin registros de acceso</Text>
            </View>
          }
          renderItem={renderItem}
          style={styles.flatlist}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg:     { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '700', color: C.text },
  sub:   { fontSize: 11, color: C.textSubtle, marginTop: 2 },
  liveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
  },
  liveBtnActive: {
    backgroundColor: 'rgba(0,229,160,0.1)',
    borderColor: 'rgba(0,229,160,0.35)',
  },
  liveTxt:       { color: C.textMuted, fontSize: 11, fontWeight: '700' },
  liveTxtActive: { color: C.greenNeon },
  summary: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 20, marginBottom: 16,
  },
  summaryCard: {
    flex: 1, backgroundColor: C.surface, borderRadius: 12,
    borderWidth: 1, paddingVertical: 12, alignItems: 'center',
  },
  summaryVal: { fontSize: 22, fontWeight: '800' },
  summaryLbl: { color: C.textMuted, fontSize: 11, marginTop: 2 },
  flatlist:  { flex: 1 },
  list:      { paddingHorizontal: 16, paddingBottom: 32 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 13,
  },
  divider: { borderTopWidth: 1, borderTopColor: C.border },
  iconBox: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  info:       { flex: 1 },
  name:       { color: C.text, fontSize: 14, fontWeight: '500' },
  meta:       { color: C.textMuted, fontSize: 11, marginTop: 3 },
  right:      { alignItems: 'flex-end' },
  result:     { fontSize: 11, fontWeight: '700' },
  confidence: { color: C.textSubtle, fontSize: 11, marginTop: 3 },
  empty:    { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTxt: { color: C.textSubtle, fontSize: 14 },
});
