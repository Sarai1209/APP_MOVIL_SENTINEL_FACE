import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/theme';
 
type Status = 'active' | 'inactive' | 'blocked' | 'warning' | 'info';
 
const CONFIG: Record<Status, { label: string; color: string }> = {
  active:   { label: 'Activo',    color: Colors.Status.success },
  inactive: { label: 'Inactivo',  color: Colors.Status.warning },
  blocked:  { label: 'Bloqueado', color: Colors.Status.error   },
  warning:  { label: 'Alerta',    color: Colors.Status.warning },
  info:     { label: 'Info',      color: Colors.Status.info    },
};
 
interface Props {
  status: Status;
  label?: string; 
}
 
/**
 * StatusBadge
 * estado coloreada. Usada en Users, Reports, Profile.
 */
export default function StatusBadge({ status, label }: Props) {
  const { label: defaultLabel, color } = CONFIG[status];
  const text = label ?? defaultLabel;
 
  return (
    <View style={[styles.badge, { borderColor: `${color}40`, backgroundColor: `${color}14` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{text}</Text>
    </View>
  );
}
 
const styles = StyleSheet.create({
  badge: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            5,
    paddingHorizontal: 9,
    paddingVertical:   4,
    borderRadius:   20,
    borderWidth:    1,
  },
  dot:  { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11, fontWeight: '600' },
});