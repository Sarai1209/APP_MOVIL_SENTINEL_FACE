import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import {
    AlertTriangle,
    Bell,
    CheckCircle,
    Info,
    ShieldAlert,
} from "lucide-react-native";
import React, { useState, useCallback } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Colors } from "../../constants/theme";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { AlertRecord } from "../../types/domain";

type FilterKey = "all" | "SPOOFING_ATTEMPT" | "UNKNOWN_FACE" | "resolved";
const C = Colors.dark;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "SPOOFING_ATTEMPT", label: "Spoofing" },
  { key: "UNKNOWN_FACE", label: "Desconocido" },
  { key: "resolved", label: "Resueltas" },
];

function severityColor(s: string) {
  if (s === "CRITICAL" || s === "HIGH") return Colors.Status.error;
  if (s === "MEDIUM") return Colors.Status.warning;
  return Colors.Status.info;
}

function alertIcon(type: string, color: string) {
  if (type?.includes("SPOOF")) return <ShieldAlert size={20} color={color} />;
  if (type?.includes("UNKNOWN"))
    return <AlertTriangle size={20} color={color} />;
  if (type?.includes("ACCESS")) return <Info size={20} color={color} />;
  return <Bell size={20} color={color} />;
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `Hace ${diff}s`;
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  return `Hace ${Math.floor(diff / 3600)}h`;
}

export default function AlertsScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [activeAlerts,   setActiveAlerts]   = useState<AlertRecord[]>([]);
  const [resolvedAlerts, setResolvedAlerts] = useState<AlertRecord[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [refreshing,     setRefreshing]     = useState(false);
  const [filter,         setFilter]         = useState<FilterKey>("all");

  const fetchAlerts = useCallback(async (showFullLoading = false) => {
    if (showFullLoading) {
      setLoading(true);
    }
    try {
      const [activeRes, resolvedRes] = await Promise.all([
        api.getAlerts(0),
        api.getAlerts(1),
      ]);
      setActiveAlerts(activeRes.data.alerts ?? []);
      setResolvedAlerts(resolvedRes.data.alerts ?? []);
    } catch (error) {
      if (__DEV__) console.error(error);
      Alert.alert("Error", "No se pudieron cargar las alertas. Intenta de nuevo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAlerts(activeAlerts.length === 0 && resolvedAlerts.length === 0);
    }, [fetchAlerts, activeAlerts.length, resolvedAlerts.length])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAlerts(false);
  }, [fetchAlerts]);

  const displayed =
    filter === "resolved"
      ? resolvedAlerts
      : filter === "all"
        ? activeAlerts
        : activeAlerts.filter((a) => a.alert_type === filter);

  const unread = activeAlerts.length;

  const resolveAlert = async (alert_id: number) => {
    try {
      await api.resolveAlert(alert_id, user?.id ?? "");
      const resolved = activeAlerts.find((a) => a.alert_id === alert_id);
      if (resolved) {
        setActiveAlerts((prev) => prev.filter((a) => a.alert_id !== alert_id));
        setResolvedAlerts((prev) => [
          { ...resolved, resolved: true, resolved_by: user?.name },
          ...prev,
        ]);
      }
    } catch (error) {
      if (__DEV__) console.error(error);
      Alert.alert(
        "Error",
        (error as any)?.response?.data?.message ?? "No se pudo resolver la alerta."
      );
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.dark.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.dark.adminGold} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#12101E", "#1A1630", "#12101E"]}
      style={styles.bg}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alertas</Text>
          {unread > 0 && <Text style={styles.unread}>{unread} pendientes</Text>}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersWrap}
        style={styles.filtersScroll}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterBtn,
              filter === f.key && styles.filterBtnActive,
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterTxt,
                filter === f.key && styles.filterTxtActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.adminGold}
            colors={[C.adminGold]}
          />
        }
      >
        {displayed.length === 0 ? (
          <View style={styles.empty}>
            <Bell size={40} color={C.textSubtle} />
            <Text style={styles.emptyTxt}>
              {filter === "resolved"
                ? "No hay alertas resueltas"
                : "Sin alertas pendientes"}
            </Text>
          </View>
        ) : (
          displayed.map((alert) => {
            const color = severityColor(alert.severity);
            return (
              <TouchableOpacity
                key={alert.alert_id}
                style={[
                  styles.card,
                  { borderColor: color, backgroundColor: `${color}10` },
                ]}
                onPress={() =>
                  router.push(`/(admin)/alert-detail?id=${alert.alert_id}`)
                }
                activeOpacity={0.8}
              >
                <View
                  style={[styles.iconWrap, { backgroundColor: `${color}18` }]}
                >
                  {alertIcon(alert.alert_type, color)}
                </View>
                <View style={styles.body}>
                  <Text style={styles.alertTitle}>
                    {alert.alert_type?.replace(/_/g, " ")}
                  </Text>
                  <Text style={styles.alertDesc} numberOfLines={2}>
                    {alert.description}
                  </Text>
                  <Text style={styles.alertTime}>
                    {timeAgo(alert.created_at)}
                  </Text>
                </View>
                <View style={styles.cardRight}>
                  <View
                    style={[
                      styles.severityBadge,
                      {
                        backgroundColor: `${color}20`,
                        borderColor: `${color}40`,
                      },
                    ]}
                  >
                    <Text style={[styles.severityText, { color }]}>
                      {alert.severity}
                    </Text>
                  </View>
                  {!alert.resolved && (
                    <TouchableOpacity
                      style={styles.markBtn}
                      onPress={() => resolveAlert(alert.alert_id)}
                    >
                      <CheckCircle size={20} color={Colors.Status.success} />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  title: { fontSize: 24, fontWeight: "700", color: C.text },
  unread: { fontSize: 13, color: C.pinkNeon, marginTop: 2 },
  filtersScroll: { flexGrow: 0 },
  filtersWrap: { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterBtnActive: {
    backgroundColor: "rgba(195,160,240,0.14)",
    borderColor: "rgba(195,160,240,0.40)",
  },
  filterTxt: { color: C.textMuted, fontSize: 13 },
  filterTxtActive: { color: C.pinkNeon, fontWeight: "600" },
  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 13,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1 },
  alertTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },
  alertDesc: {
    color: C.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 4,
  },
  alertTime: { color: C.textSubtle, fontSize: 11 },
  cardRight: { alignItems: "flex-end", gap: 8 },
  severityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  severityText: { fontSize: 10, fontWeight: "700" },
  markBtn: { padding: 2 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTxt: { color: C.textSubtle, fontSize: 14 },
});
