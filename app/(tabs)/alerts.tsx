import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, Bell, CheckCircle, Info, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StatusBadge from '../../components/ui/StatusBadge';
import { Colors } from '../../constants/theme';
 
type FilterKey = 'all' | 'warning' | 'success' | 'info';
 
// GET /api/alerts
const ALERTS_DATA = [
  { id: 1, type: 'warning', title: 'Intento fallido de acceso',    desc: 'Rostro no reconocido en Entrada principal', time: 'Hace 10 min', read: false },
  { id: 2, type: 'success', title: 'Acceso autorizado',            desc: 'Juan Pérez ingresó por Entrada principal', time: 'Hace 25 min', read: false },
  { id: 3, type: 'info',    title: 'Mantenimiento programado',     desc: 'El sistema entra en mantenimiento a las 22:00', time: 'Hace 1h', read: true  },
  { id: 4, type: 'warning', title: 'Múltiples intentos fallidos',  desc: '3 intentos detectados en Sala B',          time: 'Hace 2h',  read: true  },
  { id: 5, type: 'success', title: 'Acceso autorizado',            desc: 'María López ingresó por Puerta trasera',   time: 'Hace 3h',  read: true  },
];
 
const ICON_MAP = {
  warning: { icon: AlertTriangle, color: Colors.Status.warning },
  success: { icon: CheckCircle,  color: Colors.Status.success  },
  info:    { icon: Info,         color: Colors.Status.info     },
};
 
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',     label: 'Todas'   },
  { key: 'warning', label: 'Alertas' },
  { key: 'success', label: 'Accesos' },
  { key: 'info',    label: 'Info'    },
];
 
export default function AlertsScreen() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [alerts, setAlerts] = useState(ALERTS_DATA);
 
  const markRead    = (id: number) => setAlerts(p => p.map(a => a.id === id ? { ...a, read: true } : a));
  const markAllRead = ()           => setAlerts(p => p.map(a => ({ ...a, read: true })));
  const filtered    = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);
  const unread      = alerts.filter(a => !a.read).length;
 
  const C = Colors.dark;
 
  return (
    <LinearGradient colors={['#050514', '#0D0D2B', '#050514']} style={styles.bg}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alertas</Text>
          {unread > 0 && <Text style={styles.unread}>{unread} sin leer</Text>}
        </View>
        {unread > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAll}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>
 
      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersWrap} style={styles.filtersScroll}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterTxt, filter === f.key && styles.filterTxtActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
 
      {/* Lista */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Bell size={40} color={C.textSubtle} />
            <Text style={styles.emptyTxt}>Sin alertas en esta categoría</Text>
          </View>
        ) : (
          filtered.map(alert => {
            const { icon: Icon, color } = ICON_MAP[alert.type as keyof typeof ICON_MAP];
            return (
              <View key={alert.id} style={[styles.card, !alert.read && styles.cardUnread]}>
                <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
                  <Icon size={20} color={color} />
                </View>
                <View style={styles.body}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertDesc}>{alert.desc}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
                <View style={styles.cardRight}>
                  {!alert.read && (
                    <TouchableOpacity onPress={() => markRead(alert.id)} style={styles.closeBtn}>
                      <X size={13} color={C.textSubtle} />
                    </TouchableOpacity>
                  )}
                  {/* StatusBadge reutilizable */}
                  <StatusBadge status={alert.type === 'warning' ? 'warning' : alert.type === 'success' ? 'active' : 'info'} />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </LinearGradient>
  );
}
 
const C = Colors.dark;
 
const styles = StyleSheet.create({
  bg: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10,
  },
  title:    { fontSize: 24, fontWeight: '700', color: C.text },
  unread:   { fontSize: 13, color: C.pinkNeon, marginTop: 2 },
  markAll:  { color: C.pinkNeon, fontSize: 13, opacity: 0.8, paddingTop: 4 },
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
  alertTitle: { color: C.text, fontSize: 14, fontWeight: '600', marginBottom: 3 },
  alertDesc:  { color: C.textMuted, fontSize: 12, lineHeight: 18, marginBottom: 4 },
  alertTime:  { color: C.textSubtle, fontSize: 11 },
  cardRight:  { alignItems: 'flex-end', gap: 6 },
  closeBtn:   { padding: 4 },
  empty:      { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTxt:   { color: C.textSubtle, fontSize: 14 },
});