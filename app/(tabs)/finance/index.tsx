import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Pressable, Platform } from 'react-native';
import { useCallback, useState } from 'react';

type CurrentBill = {
  id: number;
  accruedAmount: number;
  status: 'Оплачено' | 'Не оплачено';
  period?: string; // например "ноябрь 2025 г."
};

export default function FinanceScreen() {
  const red = useThemeColor({}, 'accentRed');
  const [currentBill, setCurrentBill] = useState<CurrentBill | null>(null);
  const [loading, setLoading] = useState(true);
  const green = useThemeColor({}, 'green');

  const userId = 1;

  const baseUrl =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080'
      : 'http://192.168.31.18:8080';

  const fetchCurrentBill = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/finance/current/${userId}`);
      const data = await response.json();

      if (data?.id) {
        setCurrentBill({
          id: data.id,
          accruedAmount: data.accruedAmount,
          status: data.status,
          period: data.period, // сервер должен вернуть "ноябрь 2025 г."
        });
      } else {
        setCurrentBill(null);
      }
    } catch (e) {
      console.error('Ошибка загрузки счета:', e);
      setCurrentBill(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCurrentBill();
    }, [])
  );

  const handlePaymentPress = () => {
    if (!currentBill) return;

    router.push({
      pathname: '/(tabs)/finance/paymentForServices',
      params: { billId: currentBill.id },
    });
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ThemedText>Загрузка...</ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {currentBill ? (
        <>
          <ThemedCard>
            <ThemedText type="label">
              Сумма платежа {currentBill.period ? `за ${currentBill.period}` : ''}
            </ThemedText>

            <ThemedView withBackground={false} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText type="paymentAmount">
                {currentBill.accruedAmount.toFixed(2).replace('.', ',')}
              </ThemedText>
              <ThemedText type="paymentCurrency"> руб.</ThemedText>
            </ThemedView>

            <ThemedText
              type="label"
              colorName={currentBill.status === 'Оплачено' ? 'green' : 'accentRed'}
            >
              {currentBill.status}
            </ThemedText>
          </ThemedCard>

          <ThemedButton title="Оплатить" onPress={handlePaymentPress} />
        </>
      ) : (
      <ThemedCard style={{ alignItems: 'center', padding: 24 }}>
        <Ionicons name="checkmark-circle-outline" size={48} color={green} />
        <ThemedText style={{ color: green, marginTop: 12 }}>
          Все счета оплачены
        </ThemedText>
      </ThemedCard>
    )
    }

      <ThemedView style={{ gap: 24, marginTop: 16 }}>
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
              Показания счетчиков
            </ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    </ScreenContainer>
  );
}
