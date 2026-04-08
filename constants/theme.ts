import { Platform } from 'react-native';

type GradientTuple = [string, string];  

//Base
const pinkNeon       = '#FF00FF';
const purpleNeon     = '#9D00FF';
const backgroundDark = '#050514';
 
//Colores 
export const Colors = {
  light: {
    text:            '#11181C',
    background:      '#fff',
    tint:            '#0a7ea4',
    icon:            '#687076',
    tabIconDefault:  '#687076',
    tabIconSelected: '#0a7ea4',
  },
 
  dark: {
    //Identidad
    pinkNeon,
    purpleNeon,
    blueNeon:    '#00B4FF',
    greenNeon:   '#00E5A0',
    adminGold:   '#BF00FF',
    redAlert:    '#FF3D71',
    yellowWarn:  '#FFAA00',
 
    //Texto
    text:        '#FFFFFF',
    textMuted:   'rgba(255,255,255,0.4)',
    textSubtle:  'rgba(255,255,255,0.2)',
 
    //Superficies
    background:  backgroundDark,
    surface:     'rgba(255,255,255,0.03)',
    cardBg:      '#FFFFFF08',
    inputBg:     '#00000066',
    overlay:     '#00000066',
 
    //Bordes
    border:       'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.15)',
 
    // ab bar
    tint:            pinkNeon,
    icon:            '#9BA1A6',
    tabIconDefault:  '#444455',
    tabIconSelected: pinkNeon,
  },
 
  //Gradientes 
  Gradients: {
    primary:   [purpleNeon, pinkNeon]                  as GradientTuple,
    admin:     ['#BF00FF',  '#8000FF']             as GradientTuple,
    success:   ['#00E5A0',  '#00B4FF']             as GradientTuple,
    danger:    ['#FF3D71',  '#FF6B35']             as GradientTuple,
    overlay:   ['#0505141A', '#05051499']          as GradientTuple,
    adminDash: ['rgba(255,215,0,0.08)',  'rgba(255,140,0,0.04)']  as GradientTuple,
    card:      ['rgba(157,0,255,0.08)', 'rgba(255,0,255,0.04)']   as GradientTuple,
  },
 
  // Estados de UI (alertas, badges)
  Status: {
    success: '#00E5A0',
    warning: '#FFAA00',
    error:   '#FF3D71',
    info:    '#00B4FF',
  },
};
 
//Tipografía por plataforma 
export const Fonts = Platform.select({
  ios: {
    sans:    'system-ui',
    serif:   'ui-serif',
    rounded: 'ui-rounded',
    mono:    'ui-monospace',
  },
  default: {
    sans:    'normal',
    serif:   'serif',
    rounded: 'normal',
    mono:    'monospace',
  },
  web: {
    sans:    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:    "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});