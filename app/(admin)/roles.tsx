import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, ShieldCheck, ShieldOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert, FlatList, Modal, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useMockData } from '../../context/MockDataContext';

const C = Colors.dark;

export default function RolesScreen() {
  const { user }                                      = useAuth();
  const { roles, addRole, deactivateRole, activateRole } = useMockData();
  const router                                        = useRouter();
  const [modalVisible, setModalVisible]               = useState(false);
  const [newName,      setNewName]                    = useState('');
  const [newDesc,      setNewDesc]                    = useState('');

  const handleCreate = () => {
    if (!newName.trim()) { Alert.alert('Campo requerido', 'El nombre del rol es obligatorio.'); return; }
    addRole(newName, newDesc, user?.name ?? 'Admin');
    setNewName(''); setNewDesc(''); setModalVisible(false);
  };

  const handleDeactivate = (id: number, name: string) => {
    Alert.alert('Desactivar rol', `¿Desactivar el rol "${name}"? Los usuarios que lo tengan asignado no lo perderán pero no se podrá asignar a nuevos usuarios.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Desactivar', style: 'destructive', onPress: () => deactivateRole(id, user?.name ?? 'Admin') },
    ]);
  };

  const handleActivate = (id: number, name: string) => {
    Alert.alert('Activar rol', `¿Reactivar el rol "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Activar', onPress: () => activateRole(id, user?.name ?? 'Admin') },
    ]);
  };

  return (
    <LinearGradient colors={['#050514', '#0D0D2B', '#050514']} style={styles.bg}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Gestión de roles</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
          <Plus size={22} color={C.adminGold} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={roles}
        keyExtractor={item => String(item.role_id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTxt}>No hay roles registrados</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.roleRow, !item.is_active && styles.roleRowInactive]}>
            <View style={[styles.roleIcon, { backgroundColor: item.is_active ? `${C.adminGold}15` : `${C.textMuted}15` }]}>
              {item.is_active
                ? <ShieldCheck size={20} color={C.adminGold} />
                : <ShieldOff   size={20} color={C.textMuted} />
              }
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.roleName, !item.is_active && styles.textInactive]}>{item.name}</Text>
              {item.description ? <Text style={styles.roleDesc} numberOfLines={1}>{item.description}</Text> : null}
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.is_active ? 'rgba(0,229,160,0.12)' : 'rgba(255,61,113,0.12)' }]}>
              <Text style={[styles.statusText, { color: item.is_active ? Colors.Status.success : Colors.Status.error }]}>
                {item.is_active ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => item.is_active
                ? handleDeactivate(item.role_id, item.name)
                : handleActivate(item.role_id, item.name)
              }
            >
              <Text style={[styles.actionTxt, { color: item.is_active ? C.redAlert : Colors.Status.success }]}>
                {item.is_active ? 'Desactivar' : 'Activar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo rol</Text>
            <Text style={styles.modalLabel}>NOMBRE *</Text>
            <TextInput style={styles.modalInput} placeholder="ej: supervisor" placeholderTextColor={C.textMuted} value={newName} onChangeText={setNewName} autoCapitalize="none" />
            <Text style={styles.modalLabel}>DESCRIPCIÓN</Text>
            <TextInput style={styles.modalInput} placeholder="Describe las responsabilidades..." placeholderTextColor={C.textMuted} value={newDesc} onChangeText={setNewDesc} multiline />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setModalVisible(false); setNewName(''); setNewDesc(''); }}>
                <Text style={styles.cancelTxt}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
                <LinearGradient colors={Colors.Gradients.admin as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.createGrad}>
                  <Text style={styles.createTxt}>Crear rol</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg:      { flex: 1 },
  topBar:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: C.text, fontSize: 17, fontWeight: '600' },
  addBtn:  { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: `${C.adminGold}15`, borderRadius: 10 },
  list:    { paddingHorizontal: 16, paddingBottom: 32 },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  roleRowInactive: { opacity: 0.6 },
  roleIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  roleName: { color: C.text, fontSize: 15, fontWeight: '600', textTransform: 'capitalize' },
  textInactive: { color: C.textMuted },
  roleDesc: { color: C.textMuted, fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText:  { fontSize: 11, fontWeight: '600' },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 5 },
  actionTxt: { fontSize: 12, fontWeight: '600' },
  separator: { height: 1, backgroundColor: C.border },
  empty:    { alignItems: 'center', paddingTop: 60 },
  emptyTxt: { color: C.textSubtle, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard:    { backgroundColor: C.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle:   { color: C.text, fontSize: 18, fontWeight: '700', marginBottom: 20 },
  modalLabel:   { color: 'rgba(140,120,255,0.8)', fontSize: 9, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  modalInput:   { backgroundColor: C.background, borderWidth: 1, borderColor: C.borderStrong, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: C.text, fontSize: 14, marginBottom: 16 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn:    { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  cancelTxt:    { color: C.textMuted, fontSize: 15 },
  createBtn:    { flex: 1, height: 48 },
  createGrad:   { flex: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  createTxt:    { color: 'white', fontSize: 15, fontWeight: '700' },
});
