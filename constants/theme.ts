/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorDark = '#fff';

export const Colors = {

  light: {

    text: '#DCDCDC',
    background: '#1F1F1F',
    tint: tintColorDark,
    icon: '#9BA1A6',
    accentRed: '#D64105', 
    cardBackground: '#2B2B2B',
    tabIconDefault: '#9BA1A6',
    placeholders: '#9D9D9D',
    green: '#10CB55',

  },
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

}

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
