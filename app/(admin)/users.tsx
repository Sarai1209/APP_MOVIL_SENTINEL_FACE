import { useRouter } from 'expo-router';
import { RefreshCw, Search, Trash2, UserPlus } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const C = Colors.dark;

interface Employee {
  employee_id:   number;
  full_name:     string;
  document_id:   string | null;
  is_active:     boolean;
  registered_by: string | null;
  created_at:    string;
}

export default function UsersScreen() {
  const { user }  = useAuth();
  const router    = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [refresh,   setRefresh]   = useState(false);

  const fetchEmployees = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefresh(true) : setLoading(true);
    try {
      const { data } = await api.getEmployees();
      setEmployees(data.employees ?? []);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleDelete = (emp: Employee) => {
    Alert.alert(
      'Eliminar empleado',
      `¿Eliminar a ${emp.full_name}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteEmployee(emp.employee_id, user?.id ?? 1);
              setEmployees(prev => prev.filter(e => e.employee_id !== emp.employee_id));
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el empleado.');
            }
          },
        },
      ]
    );
  };

  const filtered = employees.filter(e =>
    e.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (e.document_id ?? '').includes(search)
  );

  const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.userRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.full_name[0].toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.full_name}</Text>
        <Text style={styles.userEmail}>
          {item.document_id ? `Doc: ${item.document_id}` : 'Sin documento'}
          {' · '}
          {item.is_active ? 'Activo' : 'Inactivo'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
        <Trash2 size={16} color={C.redAlert} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Empleados ({employees.length})</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => fetchEmployees(true)}>
            <RefreshCw size={18} color={C.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/(admin)/register')}
          >
            <UserPlus size={20} color={C.adminGold} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Search size={16} color={C.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o documento..."
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={C.adminGold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.employee_id)}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={() => fetchEmployees(true)}
              tintColor={C.adminGold} colors={[C.adminGold]} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTxt}>
                {search ? 'Sin resultados' : 'No hay empleados registrados'}
              </Text>
            </View>
          }
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background, paddingHorizontal: 20, paddingTop: 60 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  title:         { color: C.text, fontSize: 22, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  iconBtn:       { padding: 8 },
  addBtn:        { padding: 8, backgroundColor: `${C.adminGold}15`, borderRadius: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, paddingHorizontal: 14, height: 46, marginBottom: 20,
  },
  searchInput: { flex: 1, color: C.text, fontSize: 14 },
  userRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 12,
  },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: `${C.adminGold}20`,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText:  { color: C.adminGold, fontWeight: '700', fontSize: 16 },
  userName:    { color: C.text, fontSize: 15, fontWeight: '500' },
  userEmail:   { color: C.textMuted, fontSize: 12, marginTop: 2 },
  deleteBtn:   { padding: 8 },
  separator:   { height: 1, backgroundColor: C.border },
  empty:       { alignItems: 'center', paddingTop: 40 },
  emptyTxt:    { color: C.textSubtle, fontSize: 14 },
});
