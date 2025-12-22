import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  colorName?: keyof typeof import('@/constants/theme').Colors.dark;
  withBackground?: boolean;
};

export function ThemedView({
  style,
  colorName = 'background', 
  withBackground = true,   
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({}, colorName);

  return (
    <View
      style={[withBackground ? { backgroundColor } : null, style]}
      {...otherProps}
    />
  );
}
