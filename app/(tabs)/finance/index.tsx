import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

export default function FinanceScreen() {
  const red = useThemeColor({}, 'accentRed');

  return ( 
    <ScreenContainer>
      <ThemedCard>
        <ThemedText type="label">Сумма платежа</ThemedText>

        <ThemedView withBackground={false} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <ThemedText type="paymentAmount">93,50</ThemedText>
          <ThemedText type="paymentCurrency">руб.</ThemedText>
        </ThemedView>

        <ThemedText type="label" colorName="accentRed" style={{ marginTop: 6 }}>
          Не оплачено
        </ThemedText>
      </ThemedCard>

      <ThemedButton
        title="Оплатить"
        onPress={() => router.push('/(tabs)/finance/paymentForServices')}
      />

      <ThemedView style={{ gap: 24 }}>
        <Pressable onPress={() => router.push('/(tabs)/finance/paymentHistory')}>
          <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={22} color={red} />
            <ThemedText type="sectionTitle" style={{ marginLeft: 12 }}>
              История платежей
            </ThemedText>
          </ThemedView>
        </Pressable>

        <Pressable onPress={() => router.push('/(tabs)/finance/meterHistory')}>
          <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="reader-outline" size={22} color={red} />
            <ThemedText type="sectionTitle" style={{ marginLeft: 12 }}>
              Предыдущие показания счетчиков
            </ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>

    </ScreenContainer>
  );
}
