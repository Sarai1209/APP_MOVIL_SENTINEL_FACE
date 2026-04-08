import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/theme';
 
const REPORTS = [
  { id: '1', user: 'Sarai Díaz',    action: 'Acceso concedido',  time: '08:32',  date: 'Hoy',   type: 'success' },
  { id: '2', user: 'Carlos López',  action: 'Acceso concedido',  time: '08:45',  date: 'Hoy',   type: 'success' },
  { id: '3', user: 'Juan Herrera',  action: 'Acceso denegado',   time: '09:01',  date: 'Hoy',   type: 'blocked' },
  { id: '4', user: 'María Torres',  action: 'Intento fallido',   time: '09:15',  date: 'Hoy',   type: 'warning' },
  { id: '5', user: 'Ana Martínez',  action: 'Acceso concedido',  time: '10:03',  date: 'Hoy',   type: 'success' },
  { id: '6', user: 'Pedro Ramírez', action: 'Sesión expirada',   time: '10:30',  date: 'Hoy',   type: 'info'    },
  { id: '7', user: 'Sarai Díaz',    action: 'Acceso concedido',  time: '07:55',  date: 'Ayer',  type: 'success' },
  { id: '8', user: 'Juan Herrera',  action: 'Acceso denegado',   time: '08:10',  date: 'Ayer',  type: 'blocked' },
];
 
const iconForType = (type: string) => {
  if (type === 'success') return <CheckCircle size={16} color={Colors.Status.success} />;
  if (type === 'blocked') return <XCircle     size={16} color={Colors.Status.error}   />;
  if (type === 'warning') return <AlertTriangle size={16} color={Colors.Status.warning} />;
  return <Clock size={16} color={Colors.Status.info} />;
};
 
const colorForType = (type: string) => {
  if (type === 'success') return Colors.Status.success;
  if (type === 'blocked') return Colors.Status.error;
  if (type === 'warning') return Colors.Status.warning;
  return Colors.Status.info;
};
 
export default function ReportsScreen() {
  const grouped = REPORTS.reduce((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {} as Record<string, typeof REPORTS>);
 
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
 
      <Text style={styles.title}>Reportes</Text>
 
      {/* Resumen rápido */}
      <View style={styles.summaryRow}>
        {[
          { label: 'Accesos', value: '5', color: Colors.Status.success },
          { label: 'Denegados', value: '2', color: Colors.Status.error  },
          { label: 'Alertas', value: '1', color: Colors.Status.warning },
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
 
      {/* Grupos por fecha */}
      {Object.entries(grouped).map(([date, items]) => (
        <View key={date}>
          <Text style={styles.dateLabel}>{date}</Text>
          {items.map(item => (
            <View key={item.id} style={styles.reportRow}>
              <View style={[styles.iconWrap, { backgroundColor: `${colorForType(item.type)}15` }]}>
                {iconForType(item.type)}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reportUser}>{item.user}</Text>
                <Text style={styles.reportAction}>{item.action}</Text>
              </View>
              <Text style={styles.reportTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      ))}
 
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  content:   { padding: 20, paddingTop: 60, paddingBottom: 30 },
  title:     { color: Colors.dark.text, fontSize: 22, fontWeight: '700', marginBottom: 20 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  summaryCard: {
    flex: 1, borderRadius: 14, borderWidth: 1,
    paddingVertical: 14, alignItems: 'center',
  },
  summaryValue: { fontSize: 24, fontWeight: '800' },
  summaryLabel: { color: Colors.dark.textMuted, fontSize: 11, marginTop: 2 },
  dateLabel: {
    color: Colors.dark.textMuted, fontSize: 11, fontWeight: '600',
    letterSpacing: 1.5, marginBottom: 8, marginTop: 16,
  },
  reportRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.dark.border,
  },
  iconWrap:     { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  reportUser:   { color: Colors.dark.text, fontSize: 14, fontWeight: '500' },
  reportAction: { color: Colors.dark.textMuted, fontSize: 12, marginTop: 2 },
  reportTime:   { color: Colors.dark.textMuted, fontSize: 12 },
});