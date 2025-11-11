import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

type ThemedButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textColor?: string;
  disabled?: boolean;
  colorName?: keyof typeof import('@/constants/theme').Colors.dark;
};

export function ThemedButton({
  title,
  onPress,
  style,
  textColor,
  disabled = false,
  colorName = 'text',
}: ThemedButtonProps) {
  const red = useThemeColor({}, 'accentRed');
  const themeTextColor = useThemeColor({}, colorName);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[styles.button, { backgroundColor: disabled ? '#A9A9A9' : red }, style]}
    >
      <Text style={[styles.text, { color: textColor || themeTextColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    marginBottom: 36,
    marginTop: 8
  },
  text: {
    fontSize: 20,
    fontFamily: 'Actay', 
  },
});
