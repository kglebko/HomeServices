import { Platform } from 'react-native';

const tintColorDark = '#fff';

export const Colors = {
  dark: {
    text: '#DCDCDC',
    background: '#1F1F1F',
    tint: tintColorDark,
    icon: '#9BA1A6',
    accentRed: '#D64105', 
    cardBackground: '#2B2B2B',
    tabIconDefault: '#9BA1A6',
    placeholders: '#9D9D9D',
    green: '#10CB55',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
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
