import { useRouter } from 'expo-router';
import { Search, UserMinus, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useMockData } from '../../context/MockDataContext';

const C = Colors.dark;

export default function UsersScreen() {
  const { user }                              = useAuth();
  const { employees, deactivateEmployee }     = useMockData();
  const router                                = useRouter();
  const [search,          setSearch]          = useState('');
  const [showInactive,    setShowInactive]    = useState(false);

  const filtered = employees.filter(e => {
    const matchSearch = e.full_name.toLowerCase().includes(search.toLowerCase()) ||
      e.document_id.includes(search);
    const matchStatus = showInactive ? true : e.is_active;
    return matchSearch && matchStatus;
  });

  const handleDeactivate = (id: number, name: string) => {
    Alert.alert(
      'Desactivar empleado',
      `¿Desactivar a ${name}? El registro se conserva por auditoría pero el empleado perderá acceso al sistema.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desactivar', style: 'destructive',
          onPress: () => deactivateEmployee(id, user?.name ?? 'Admin'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Empleados ({employees.filter(e => e.is_active).length} activos)
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.filterBtn, showInactive && styles.filterBtnActive]}
            onPress={() => setShowInactive(p => !p)}
          >
            <Text style={[styles.filterTxt, showInactive && styles.filterTxtActive]}>
              {showInactive ? 'Ver activos' : 'Ver todos'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(admin)/register')}>
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

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.employee_id)}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTxt}>
              {search ? 'Sin resultados para tu búsqueda' : 'No hay empleados registrados'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.userRow, !item.is_active && styles.userRowInactive]}>
            <View style={[styles.avatar, !item.is_active && styles.avatarInactive]}>
              <Text style={[styles.avatarText, !item.is_active && styles.avatarTextInactive]}>
                {item.full_name[0].toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.userName, !item.is_active && styles.textInactive]}>
                {item.full_name}
              </Text>
              <Text style={styles.userDoc}>Doc: {item.document_id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.is_active ? 'rgba(0,229,160,0.15)' : 'rgba(255,61,113,0.12)' }]}>
              <Text style={[styles.statusText, { color: item.is_active ? Colors.Status.success : Colors.Status.error }]}>
                {item.is_active ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
            {item.is_active && (
              <TouchableOpacity onPress={() => handleDeactivate(item.employee_id, item.full_name)} style={styles.deactivateBtn}>
                <UserMinus size={16} color={C.redAlert} />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: C.background, paddingHorizontal: 20, paddingTop: 60 },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title:       { color: C.text, fontSize: 20, fontWeight: '700', flex: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterBtn:   { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  filterBtnActive: { backgroundColor: 'rgba(191,0,255,0.1)', borderColor: 'rgba(191,0,255,0.3)' },
  filterTxt:       { color: C.textMuted, fontSize: 12 },
  filterTxtActive: { color: C.adminGold, fontWeight: '600' },
  addBtn:      { padding: 8, backgroundColor: `${C.adminGold}15`, borderRadius: 10 },
  searchBar:   { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, height: 46, marginBottom: 20 },
  searchInput: { flex: 1, color: C.text, fontSize: 14 },
  userRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  userRowInactive: { opacity: 0.55 },
  avatar:      { width: 42, height: 42, borderRadius: 21, backgroundColor: `${C.adminGold}20`, justifyContent: 'center', alignItems: 'center' },
  avatarInactive: { backgroundColor: `${C.textMuted}20` },
  avatarText:  { color: C.adminGold, fontWeight: '700', fontSize: 16 },
  avatarTextInactive: { color: C.textMuted },
  userName:    { color: C.text, fontSize: 15, fontWeight: '500' },
  textInactive: { color: C.textMuted },
  userDoc:     { color: C.textMuted, fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText:  { fontSize: 11, fontWeight: '600' },
  deactivateBtn: { padding: 8 },
  separator:   { height: 1, backgroundColor: C.border },
  empty:       { alignItems: 'center', paddingTop: 40 },
  emptyTxt:    { color: C.textSubtle, fontSize: 14 },
});
