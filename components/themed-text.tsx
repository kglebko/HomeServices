import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Fonts } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'label' | 'paymentAmount' | 'paymentCurrency' | 'status' | 'button' | 'sectionTitle'| 'paymentData' ;
  colorName?: keyof typeof import('@/constants/theme').Colors.dark;
};

export function ThemedText({ style, type = 'default', colorName = 'text', ...rest }: ThemedTextProps) {
  const color = useThemeColor({}, colorName);

  return (
    <Text
      style={[
        { color, fontFamily: 'Actay' },
        type === 'default' && styles.default,
        type === 'label' && styles.label,
        type === 'paymentAmount' && styles.paymentAmount,
        type === 'paymentCurrency' && styles.paymentCurrency,
        type === 'button' && styles.button,
        type === 'sectionTitle' && styles.sectionTitle,
        type === 'paymentData' && styles.paymentData,
        style,
      ]}
      {...rest}
    />
  );
}


const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    marginBottom: 6 
  },
  paymentAmount: {
    fontFamily: 'Actay-Bold',
    fontSize: 36,
    lineHeight: 40,
  },
  paymentCurrency: {
    fontSize: 14,
    marginLeft: 4,
    marginBottom: 4,
  },
  button: {
    fontSize: 20
  },
  sectionTitle: {
    fontFamily: 'Actay',
    fontSize: 20,
    marginLeft: 8
  },
  paymentData: {
  fontSize: 18,
  fontFamily: 'Actay-Bold',
  marginBottom: 10,
},
});
