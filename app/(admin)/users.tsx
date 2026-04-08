import { Search, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import StatusBadge from '../../components/ui/StatusBadge';
import { Colors } from '../../constants/theme';
 
const MOCK_USERS = [
  { id: '1', name: 'Sarai Díaz',      email: 'sarai@sentinel.com',   status: 'active'   },
  { id: '2', name: 'Carlos López',    email: 'carlos@sentinel.com',  status: 'active'   },
  { id: '3', name: 'María Torres',    email: 'maria@sentinel.com',   status: 'inactive' },
  { id: '4', name: 'Juan Herrera',    email: 'juan@sentinel.com',    status: 'blocked'  },
  { id: '5', name: 'Ana Martínez',    email: 'ana@sentinel.com',     status: 'active'   },
  { id: '6', name: 'Pedro Ramírez',   email: 'pedro@sentinel.com',   status: 'warning'  },
];
 
export default function UsersScreen() {
  const [search, setSearch] = useState('');
 
  const filtered = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
 
  return (
    <View style={styles.container}>
 
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Usuarios</Text>
        <TouchableOpacity style={styles.addBtn}>
          <UserPlus size={20} color={Colors.dark.adminGold} />
        </TouchableOpacity>
      </View>
 
      {/* Buscador */}
      <View style={styles.searchBar}>
        <Search size={16} color={Colors.dark.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuario..."
          placeholderTextColor={Colors.dark.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>
 
      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <StatusBadge status={item.status as any} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background, paddingHorizontal: 20, paddingTop: 60 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  title:   { color: Colors.dark.text, fontSize: 22, fontWeight: '700' },
  addBtn:  { padding: 8, backgroundColor: `${Colors.dark.adminGold}15`, borderRadius: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1, borderColor: Colors.dark.border,
    borderRadius: 12, paddingHorizontal: 14, height: 46, marginBottom: 20,
  },
  searchInput: { flex: 1, color: Colors.dark.text, fontSize: 14 },
  userRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14,
  },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: `${Colors.dark.adminGold}20`,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: Colors.dark.adminGold, fontWeight: '700', fontSize: 16 },
  userName:   { color: Colors.dark.text, fontSize: 15, fontWeight: '500' },
  userEmail:  { color: Colors.dark.textMuted, fontSize: 12, marginTop: 2 },
  separator:  { height: 1, backgroundColor: Colors.dark.border },
});