import { Platform } from 'react-native';
type GradientTuple = [string, string, ...string[]];

const pinkNeon = '#FF00FF';
const purpleNeon = '#9D00FF';
const backgroundDark = '#050505';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#FFFFFF',
    background: backgroundDark,
    tint: pinkNeon,
    icon: '#9BA1A6',
    tabIconDefault: '#444455',
    tabIconSelected: pinkNeon,
    pinkNeon: pinkNeon,
    purpleNeon: purpleNeon,
    cardBg: 'rgba(225, 255, 255, 0.03)',
    overlay: 'rgba(5, 5, 20, 0.3)',
    inputBg: 'rgba(0, 0, 0, 0.4)',
  },
  Gradients: {
    primary: [purpleNeon, pinkNeon] as GradientTuple,
    admin: ['#4c669f', '#3b5998'] as GradientTuple,
    overlay: ['rgba(5, 5, 20, 0.1)', 'rgba(5, 5, 20, 0.6)'] as GradientTuple,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
