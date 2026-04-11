import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Camera, CheckCircle, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
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

export default function RegisterScreen() {
  const { user }  = useAuth();
  const router    = useRouter();

  const [name,       setName]       = useState('');
  const [documentId, setDocumentId] = useState('');
  const [photoUri,   setPhotoUri]   = useState<string | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la cámara para registrar al empleado.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleRegister = async () => {
    if (!name.trim())  { Alert.alert('Campo requerido', 'Ingresa el nombre completo.'); return; }
    if (!photoUri)     { Alert.alert('Foto requerida', 'Toma una foto del empleado.'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name',     name.trim());
      formData.append('admin_id', user?.id ?? '1');
      if (documentId.trim()) formData.append('document_id', documentId.trim());
      formData.append('image', {
        uri:  photoUri,
        type: 'image/jpeg',
        name: 'employee.jpg',
      } as any);

      await api.createEmployee(formData);
      setSuccess(true);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'No se pudo registrar. Verifica que la foto muestre un rostro claro.';
      Alert.alert('Error al registrar', msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <LinearGradient colors={['#050514', '#0D0D2B', '#050514']} style={styles.bg}>
        <View style={styles.successContainer}>
          <CheckCircle size={64} color={Colors.Status.success} />
          <Text style={styles.successTitle}>Empleado registrado</Text>
          <Text style={styles.successSub}>
            {name} ha sido registrado exitosamente en el sistema de acceso facial.
          </Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
            <Text style={styles.doneTxt}>Volver a usuarios</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#050514', '#0D0D2B', '#050514']} style={styles.bg}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <X size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Registrar empleado</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={styles.photoBox} onPress={pickPhoto}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera size={36} color={C.textMuted} />
              <Text style={styles.photoHint}>Toca para tomar foto</Text>
              <Text style={styles.photoSub}>Debe mostrar el rostro del empleado claramente</Text>
            </View>
          )}
          {photoUri && (
            <View style={styles.changePhoto}>
              <Camera size={16} color="white" />
              <Text style={styles.changeTxt}>Cambiar foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.field}>
          <Text style={styles.label}>NOMBRE COMPLETO *</Text>
          <View style={styles.inputWrap}>
            <User size={16} color={C.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Ej: Juan Carlos Pérez"
              placeholderTextColor={C.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>NÚMERO DE DOCUMENTO</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={[styles.input, { marginLeft: 0 }]}
              placeholder="Opcional — CC, TI, CE..."
              placeholderTextColor={C.textMuted}
              value={documentId}
              onChangeText={setDocumentId}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTxt}>
            El sistema extraerá automáticamente el embedding biométrico del rostro
            para el reconocimiento facial. Asegúrate de que la foto sea frontal y con buena iluminación.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.registerBtn, loading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <LinearGradient
            colors={Colors.Gradients.admin as any}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.btnTxt}>Registrar empleado</Text>
            }
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg:    { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12,
  },
  backBtn:  { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: C.text, fontSize: 17, fontWeight: '600' },
  scroll:   { paddingHorizontal: 20, paddingBottom: 40 },

  photoBox: {
    width: '100%', height: 220, borderRadius: 20,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    overflow: 'hidden', marginBottom: 28, justifyContent: 'center', alignItems: 'center',
  },
  photo:             { width: '100%', height: '100%', resizeMode: 'cover' },
  photoPlaceholder:  { alignItems: 'center', gap: 10, padding: 20 },
  photoHint:         { color: C.text, fontSize: 15, fontWeight: '600' },
  photoSub:          { color: C.textMuted, fontSize: 12, textAlign: 'center' },
  changePhoto: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)', flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 10,
  },
  changeTxt: { color: 'white', fontSize: 13 },

  field:    { marginBottom: 20 },
  label:    { color: 'rgba(140,120,255,0.8)', fontSize: 9, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderStrong,
    borderRadius: 12, paddingHorizontal: 14, height: 50,
  },
  input: { flex: 1, color: C.text, fontSize: 14 },

  infoBox: {
    backgroundColor: 'rgba(0,180,255,0.08)', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(0,180,255,0.2)',
    padding: 14, marginBottom: 28,
  },
  infoTxt: { color: C.blueNeon, fontSize: 12, lineHeight: 18, opacity: 0.9 },

  registerBtn:  { width: '100%', height: 54 },
  btnGradient:  { flex: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnTxt:       { color: 'white', fontSize: 16, fontWeight: '700', letterSpacing: 1 },

  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  successTitle:     { color: C.text, fontSize: 24, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  successSub:       { color: C.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 36 },
  doneBtn: {
    backgroundColor: Colors.Status.success, borderRadius: 14,
    paddingHorizontal: 36, paddingVertical: 14,
  },
  doneTxt: { color: '#050514', fontWeight: '700', fontSize: 16 },
});
