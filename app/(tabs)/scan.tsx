import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { ScanFace } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GradientButton from '../../components/ui/GradientButton';
import { Colors } from '../../constants/theme';
import { api } from '../../services/api';

const FRAME = Dimensions.get('window').width * 0.72;
type ScanState = 'idle' | 'scanning' | 'success' | 'failed';

interface RecognitionResult {
  access:     'GRANTED' | 'DENIED';
  person:     string;
  confidence: number;
  liveness:   string;
  message:    string;
}

export default function ScanScreen() {
  const [state,  setState]  = useState<ScanState>('idle');
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const scanLine  = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loopRef   = useRef<Animated.CompositeAnimation | null>(null);

  const animateScanning = () => {
    scanLine.setValue(0);
    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, { toValue: 1, duration: 1800, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(scanLine, { toValue: 0, duration: 1800, easing: Easing.linear, useNativeDriver: true }),
      ])
    );
    loopRef.current.start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 800, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopAnimation = () => {
    loopRef.current?.stop();
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const startScan = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara para el reconocimiento facial.');
      return;
    }

    const capture = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: false,
    });

    if (capture.canceled) return;

    setState('scanning');
    animateScanning();

    try {
      const uri    = capture.assets[0].uri;
      const formData = new FormData();

      // Enviamos el mismo frame varias veces para simular la secuencia.
      // En producción, se capturaría una secuencia de video real.
      for (let i = 0; i < 5; i++) {
        formData.append(`frame_${i}`, {
          uri,
          type: 'image/jpeg',
          name: `frame_${i}.jpg`,
        } as any);
      }

      const { data } = await api.recognize(formData);
      stopAnimation();

      const res: RecognitionResult = {
        access:     data.access,
        person:     data.person,
        confidence: data.confidence,
        liveness:   data.liveness,
        message:    data.message,
      };
      setResult(res);
      setState(data.access === 'GRANTED' ? 'success' : 'failed');
    } catch (e: any) {
      stopAnimation();
      setResult(null);
      setState('failed');
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor de reconocimiento.');
    }
  };

  const reset = () => {
    setState('idle');
    setResult(null);
    scanLine.setValue(0);
    pulseAnim.setValue(1);
  };

  const scanLineY = scanLine.interpolate({ inputRange: [0, 1], outputRange: [0, FRAME - 3] });

  const frameColor =
    state === 'success'  ? Colors.Status.success :
    state === 'failed'   ? Colors.Status.error   :
    state === 'scanning' ? Colors.dark.pinkNeon  : Colors.dark.borderStrong;

  return (
    <LinearGradient colors={['#050514', '#0D0D2B', '#050514']} style={styles.bg}>
      <View style={styles.container}>
        <Text style={styles.title}>Reconocimiento Facial</Text>
        <Text style={styles.subtitle}>
          {state === 'idle'     && 'Toca "Iniciar escaneo" y apunta la cámara a tu rostro'}
          {state === 'scanning' && 'Analizando... mantente quieto y parpadea naturalmente'}
          {state === 'success'  && `Identidad verificada: ${result?.person}`}
          {state === 'failed'   && (result?.message || 'No se pudo verificar la identidad')}
        </Text>

        <Animated.View style={[styles.frame, {
          borderColor: frameColor,
          transform: [{ scale: pulseAnim }],
        }]}>
          {(['tl', 'tr', 'bl', 'br'] as const).map(pos => (
            <View key={pos} style={[styles.corner, cornerStyle(pos, frameColor)]} />
          ))}

          {state === 'scanning' && (
            <Animated.View style={[styles.scanLine, {
              backgroundColor: frameColor,
              transform: [{ translateY: scanLineY }],
            }]} />
          )}

          {state === 'scanning' ? (
            <ActivityIndicator size="large" color={frameColor} />
          ) : (
            <ScanFace
              size={80} color={frameColor} strokeWidth={1}
              style={{ opacity: state === 'idle' ? 0.35 : 0.6 }}
            />
          )}

          {(state === 'success' || state === 'failed') && (
            <View style={styles.resultOverlay}>
              <Text style={[styles.resultIcon, { color: frameColor }]}>
                {state === 'success' ? '✓' : '✗'}
              </Text>
            </View>
          )}
        </Animated.View>

        {state === 'success' && result && (
          <View style={styles.confidenceWrap}>
            <Text style={styles.confidenceLabel}>Confianza del reconocimiento</Text>
            <Text style={[styles.confidenceValue, { color: Colors.Status.success }]}>
              {(result.confidence * 100).toFixed(1)} %
            </Text>
            <Text style={styles.livenessLabel}>
              Liveness: {result.liveness}
            </Text>
          </View>
        )}

        {state === 'failed' && result?.liveness === 'SPOOFING' && (
          <View style={styles.spoofWrap}>
            <Text style={styles.spoofText}>⚠ Intento de spoofing detectado</Text>
          </View>
        )}

        {state === 'idle' && (
          <GradientButton label="Iniciar escaneo" onPress={startScan} style={styles.btn} />
        )}

        {(state === 'success' || state === 'failed') && (
          <TouchableOpacity onPress={reset} style={styles.resetBtn}>
            <Text style={styles.resetTxt}>Escanear de nuevo</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

function cornerStyle(pos: 'tl' | 'tr' | 'bl' | 'br', color: string) {
  const base = { position: 'absolute' as const, width: 24, height: 24, borderWidth: 3, borderColor: color };
  if (pos === 'tl') return { ...base, top: -1, left: -1,   borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 12 };
  if (pos === 'tr') return { ...base, top: -1, right: -1,  borderLeftWidth: 0,  borderBottomWidth: 0, borderTopRightRadius: 12 };
  if (pos === 'bl') return { ...base, bottom: -1, left: -1,  borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 12 };
  return                  { ...base, bottom: -1, right: -1, borderLeftWidth: 0,  borderTopWidth: 0, borderBottomRightRadius: 12 };
}

const styles = StyleSheet.create({
  bg:        { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title:     { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle:  { fontSize: 13, color: Colors.dark.textMuted, marginBottom: 36, textAlign: 'center', lineHeight: 20 },
  frame: {
    width: FRAME, height: FRAME, borderWidth: 2, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 32,
  },
  scanLine: { position: 'absolute', left: 0, right: 0, height: 2, opacity: 0.8 },
  resultOverlay: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  resultIcon:    { fontSize: 64, fontWeight: '800' },
  confidenceWrap: { alignItems: 'center', marginBottom: 28 },
  confidenceLabel: { color: Colors.dark.textMuted, fontSize: 13 },
  confidenceValue: { fontSize: 30, fontWeight: '800', marginTop: 4 },
  livenessLabel:   { color: Colors.dark.textMuted, fontSize: 12, marginTop: 4 },
  spoofWrap: {
    backgroundColor: 'rgba(255,61,113,0.12)', borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,61,113,0.3)',
    paddingHorizontal: 20, paddingVertical: 10, marginBottom: 20,
  },
  spoofText: { color: Colors.Status.error, fontSize: 13, fontWeight: '600' },
  btn:       { width: '100%' },
  resetBtn: {
    borderWidth: 1, borderColor: Colors.dark.border,
    paddingHorizontal: 32, paddingVertical: 13, borderRadius: 12,
  },
  resetTxt: { color: Colors.dark.textMuted, fontSize: 15 },
  corner:   {},
});
