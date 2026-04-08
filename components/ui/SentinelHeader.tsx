import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
 
interface Props {
  title:      string;
  showBack?:  boolean;
  right?:     React.ReactNode;
}
 
/**
 * SentinelHeader
 * Header estándar de la app: título centrado, botón volver opcional, slot derecho opcional.
 * Usado en todas las pantallas internas (Usuarios, Reportes, EditProfile, etc.)
 */
export default function SentinelHeader({ title, showBack = true, right }: Props) {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={Colors.dark.textMuted} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}>{right ?? <View style={styles.placeholder} />}</View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  wrap: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingHorizontal: 8,
    paddingTop:      56,
    paddingBottom:   12,
  },
  backBtn:     { padding: 10 },
  placeholder: { width: 40 },
  title: {
    flex:       1,
    textAlign:  'center',
    fontSize:   18,
    fontWeight: '700',
    color:      Colors.dark.text,
  },
  right: { width: 40, alignItems: 'flex-end' },
});