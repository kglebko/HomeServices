import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'label' | 'paymentAmount' | 'paymentCurrency' | 'status' | 
                    'button' | 'sectionTitle'| 'paymentData' | 'screenTitle' | 'paymentStatus'|
                    'costHistory' | 'littleLabel'| 'meters';
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
        type === 'screenTitle' && styles.screenTitle,
        type === 'paymentStatus' && styles.paymentStatus,
        type === 'costHistory' && styles.costHistory,
        type === 'littleLabel' && styles.littleLabel,
        type === 'meters' && styles.meters,
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
  littleLabel: {
    fontSize: 12,
    marginBottom: 6 
  },
  costHistory: {
    fontSize: 16,
    marginBottom: 6,
    fontFamily: 'Actay-Bold',
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
  screenTitle: {
    fontFamily: 'Actay',
    fontSize: 18,
    textAlign: 'center'
  },
  paymentData: {
    fontSize: 18,
    fontFamily: 'Actay-Bold',
    marginBottom: 10,
  },
  paymentStatus: {
    fontSize: 16,
  },
  meters: {
    fontSize: 18
  },
});
