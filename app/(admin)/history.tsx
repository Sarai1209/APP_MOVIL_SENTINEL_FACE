import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { AccessLog, useMockData } from '../../context/MockDataContext';

const C = Colors.dark;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-CO', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

export default function HistoryScreen() {
  const router   = useRouter();
  const { logs } = useMockData();

  const granted = logs.filter(l => l.access_result === 'GRANTED').length;
  const denied  = logs.filter(l => l.access_result === 'DENIED').length;

  return (
    <LinearGradient colors={['#050514', '#0D0D2B', '#050514']} style={styles.bg}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={C.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Historial de accesos</Text>
          <Text style={styles.sub}>{logs.length} registros totales</Text>
        </View>
      </View>

      <View style={styles.summary}>
        {[
          { label: 'Accesos',   value: granted,     color: Colors.Status.success },
          { label: 'Denegados', value: denied,      color: Colors.Status.error   },
          { label: 'Total',     value: logs.length, color: C.blueNeon            },
        ].map((s, i) => (
          <View key={i} style={[styles.summaryCard, { borderColor: `${s.color}30` }]}>
            <Text style={[styles.summaryVal, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryLbl}>{s.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={logs}
        keyExtractor={item => String(item.log_id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }: { item: AccessLog; index: number }) => {
          const ok    = item.access_result === 'GRANTED';
          const color = ok ? Colors.Status.success : Colors.Status.error;
          return (
            <View style={[styles.row, index > 0 && styles.divider]}>
              <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
                {ok ? <CheckCircle size={18} color={color} /> : <XCircle size={18} color={color} />}
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
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg:     { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12 },
  backBtn: { padding: 4 },
  title:   { fontSize: 18, fontWeight: '700', color: C.text },
  sub:     { fontSize: 11, color: C.textSubtle, marginTop: 2 },
  summary: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, paddingVertical: 12, alignItems: 'center' },
  summaryVal:  { fontSize: 22, fontWeight: '800' },
  summaryLbl:  { color: C.textMuted, fontSize: 11, marginTop: 2 },
  list:    { paddingHorizontal: 16, paddingBottom: 32 },
  row:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  divider: { borderTopWidth: 1, borderTopColor: C.border },
  iconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  info:    { flex: 1 },
  name:    { color: C.text, fontSize: 14, fontWeight: '500' },
  meta:    { color: C.textMuted, fontSize: 11, marginTop: 3 },
  right:   { alignItems: 'flex-end' },
  result:     { fontSize: 11, fontWeight: '700' },
  confidence: { color: C.textSubtle, fontSize: 11, marginTop: 3 },
});
