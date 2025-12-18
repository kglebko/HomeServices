import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Pressable, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type CurrentBill = {
  id: number;
  accruedAmount: string;
  status: 'Оплачено' | 'Не оплачено';
};

export default function FinanceScreen() {
  const red = useThemeColor({}, 'accentRed');
  const green = useThemeColor({}, 'green');
  const [currentBill, setCurrentBill] = useState<CurrentBill | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = 1;

  const baseUrl = Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'
    : 'http://192.168.31.18:8080';

  useEffect(() => {
    fetchCurrentBill();
  }, []);

  const fetchCurrentBill = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/finance/current/${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setCurrentBill({
            id: data.id,
            accruedAmount: data.accruedAmount?.toFixed(2).replace('.', ',') || '0,00',
            status: data.status || 'Не оплачено'
          });
        } else {
          setCurrentBill(null);
        }
      }
    } catch (error) {
      console.error('Error fetching current bill:', error);
      setCurrentBill(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentPress = () => {
    if (currentBill) {
      router.push({
        pathname: '/(tabs)/finance/paymentForServices',
        params: { billId: currentBill.id }
      });
    }
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
            <ThemedText type="label">Сумма платежа</ThemedText>

            <ThemedView withBackground={false} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <ThemedText type="paymentAmount">{currentBill.accruedAmount}</ThemedText>
              <ThemedText type="paymentCurrency">руб.</ThemedText>
            </ThemedView>

            <ThemedText type="label" colorName="accentRed" style={{ marginTop: 6 }}>
              {currentBill.status}
            </ThemedText>
          </ThemedCard>

          <ThemedButton
            title="Оплатить"
            onPress={handlePaymentPress}
          />
        </>
      ) : (
        <ThemedCard>
          <ThemedText type="label">Все счета оплачены</ThemedText>
          <ThemedText>Новых счетов для оплаты нет</ThemedText>
        </ThemedCard>
      )}

      <ThemedView style={{ gap: 24, marginTop: 24 }}>
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