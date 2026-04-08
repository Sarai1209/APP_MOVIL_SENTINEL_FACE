import { LinearGradient } from 'expo-linear-gradient';
import { ScanFace } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Animated, Dimensions, Easing,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import GradientButton from '../../components/ui/GradientButton';
import { Colors } from '../../constants/theme';
 
const FRAME = Dimensions.get('window').width * 0.72;
type ScanState = 'idle' | 'scanning' | 'success' | 'failed';
 
export default function ScanScreen() {
  const [state, setState] = useState<ScanState>('idle');
  const scanLine  = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loopRef   = useRef<Animated.CompositeAnimation | null>(null);
 
  const startScan = () => {
    setState('scanning');
    scanLine.setValue(0);
 
    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine,  { toValue: 1, duration: 1800, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(scanLine,  { toValue: 0, duration: 1800, easing: Easing.linear, useNativeDriver: true }),
      ]),
      { iterations: 2 }
    );
    loopRef.current.start();
 
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 800, useNativeDriver: true }),
      ])
    ).start();
 
    // Simula respuesta: POST /api/scan/verify
    setTimeout(() => {
      pulseAnim.stopAnimation();
      setState(Math.random() > 0.3 ? 'success' : 'failed');
    }, 7200);
  };
 
  const reset = () => {
    setState('idle');
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
        <Text style={styles.title}>Escaneo Facial</Text>
        <Text style={styles.subtitle}>
          { state === 'idle'     && 'Posiciona tu rostro dentro del marco' }
          { state === 'scanning' && 'Analizando... mantente quieto' }
          { state === 'success'  && 'Identidad verificada exitosamente' }
          { state === 'failed'   && 'No se reconoció el rostro' }
        </Text>
 
        {/* Marco animado */}
        <Animated.View style={[styles.frame, { borderColor: frameColor, transform: [{ scale: pulseAnim }] }]}>
          {/* Esquinas decorativas */}
          {(['tl','tr','bl','br'] as const).map(pos => (
            <View key={pos} style={[styles.corner, cornerStyle(pos, frameColor)]} />
          ))}
 
          {/* Línea de escaneo */}
          { state === 'scanning' && (
            <Animated.View style={[styles.scanLine, { backgroundColor: frameColor, transform: [{ translateY: scanLineY }] }]} />
          )}
 
          <ScanFace size={80} color={frameColor} strokeWidth={1} style={{ opacity: state === 'scanning' ? 0.15 : 0.35 }} />
 
          {/* Resultado */}
          { (state === 'success' || state === 'failed') && (
            <View style={styles.resultOverlay}>
              <Text style={[styles.resultIcon, { color: frameColor }]}>
                {state === 'success' ? '✓' : '✗'}
              </Text>
            </View>
          )}
        </Animated.View>
 
        {/* Nivel de confianza — solo en éxito */}
        { state === 'success' && (
          <View style={styles.confidenceWrap}>
            <Text style={styles.confidenceLabel}>Confianza del reconocimiento</Text>
            <Text style={[styles.confidenceValue, { color: Colors.Status.success }]}>94.7 %</Text>
          </View>
        )}
 
        {/* Acciones */}
        { state === 'idle' && (
          <GradientButton
            label="Iniciar escaneo"
            onPress={startScan}
            style={styles.btn}
          />
        )}
        { (state === 'success' || state === 'failed') && (
          <TouchableOpacity onPress={reset} style={styles.resetBtn}>
            <Text style={styles.resetTxt}>Escanear de nuevo</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}
 
// Calcula estilos de cada esquina del frame
function cornerStyle(pos: 'tl'|'tr'|'bl'|'br', color: string) {
  const base = { position: 'absolute' as const, width: 24, height: 24, borderWidth: 3, borderColor: color };
  if (pos === 'tl') return { ...base, top: -1, left: -1,  borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 12 };
  if (pos === 'tr') return { ...base, top: -1, right: -1, borderLeftWidth:  0, borderBottomWidth: 0, borderTopRightRadius: 12 };
  if (pos === 'bl') return { ...base, bottom: -1, left: -1,  borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 12 };
  return                 { ...base, bottom: -1, right: -1, borderLeftWidth:  0, borderTopWidth: 0, borderBottomRightRadius: 12 };
}
 
const styles = StyleSheet.create({
  bg:        { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title:     { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle:  { fontSize: 14, color: Colors.dark.textMuted, marginBottom: 40, textAlign: 'center' },
  frame: {
    width: FRAME, height: FRAME,
    borderWidth: 2, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 36,
  },
  scanLine: {
    position: 'absolute', left: 0, right: 0, height: 2, opacity: 0.8,
  },
  resultOverlay: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  resultIcon:    { fontSize: 64, fontWeight: '800' },
  confidenceWrap: { alignItems: 'center', marginBottom: 28 },
  confidenceLabel: { color: Colors.dark.textMuted, fontSize: 13 },
  confidenceValue: { fontSize: 30, fontWeight: '800', marginTop: 4 },
  btn:       { width: '100%' },
  resetBtn: {
    borderWidth: 1, borderColor: Colors.dark.border,
    paddingHorizontal: 32, paddingVertical: 13, borderRadius: 12,
  },
  resetTxt: { color: Colors.dark.textMuted, fontSize: 15 },
  corner:   {},
});