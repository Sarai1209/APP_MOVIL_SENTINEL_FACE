import { useRouter } from 'expo-router';
import { Search, Trash2, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import StatusBadge from '../../components/ui/StatusBadge';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useMockData } from '../../context/MockDataContext';

const C = Colors.dark;

export default function UsersScreen() {
  const { user }                        = useAuth();
  const { employees, deleteEmployee }   = useMockData();
  const router                          = useRouter();
  const [search, setSearch]             = useState('');

  const filtered = employees.filter(e =>
    e.full_name.toLowerCase().includes(search.toLowerCase()) ||
    e.document_id.includes(search)
  );

  const handleDelete = (id: number, name: string) => {
    Alert.alert(
      'Eliminar empleado',
      `¿Eliminar a ${name}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteEmployee(id, user?.name ?? 'Admin') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Empleados ({employees.length})</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(admin)/register')}>
          <UserPlus size={20} color={C.adminGold} />
        </TouchableOpacity>
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
            <Text style={styles.emptyTxt}>{search ? 'Sin resultados para tu búsqueda' : 'No hay empleados registrados'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.full_name[0].toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.full_name}</Text>
              <Text style={styles.userDoc}>Doc: {item.document_id}</Text>
            </View>
            <StatusBadge status={item.is_active ? 'active' : 'inactive'} />
            <TouchableOpacity onPress={() => handleDelete(item.employee_id, item.full_name)} style={styles.deleteBtn}>
              <Trash2 size={16} color={C.redAlert} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: C.background, paddingHorizontal: 20, paddingTop: 60 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title:      { color: C.text, fontSize: 22, fontWeight: '700' },
  addBtn:     { padding: 8, backgroundColor: `${C.adminGold}15`, borderRadius: 10 },
  searchBar:  { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, height: 46, marginBottom: 20 },
  searchInput: { flex: 1, color: C.text, fontSize: 14 },
  userRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  avatar:     { width: 42, height: 42, borderRadius: 21, backgroundColor: `${C.adminGold}20`, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: C.adminGold, fontWeight: '700', fontSize: 16 },
  userName:   { color: C.text, fontSize: 15, fontWeight: '500' },
  userDoc:    { color: C.textMuted, fontSize: 12, marginTop: 2 },
  deleteBtn:  { padding: 8 },
  separator:  { height: 1, backgroundColor: C.border },
  empty:      { alignItems: 'center', paddingTop: 40 },
  emptyTxt:   { color: C.textSubtle, fontSize: 14 },
});
