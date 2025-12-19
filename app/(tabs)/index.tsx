import React, { useState, useCallback } from 'react';
import { View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router, useFocusEffect } from 'expo-router';

type CurrentBill = {
  id: number;
  accruedAmount: number;
  status: 'Оплачено' | 'Не оплачено';
  period?: string;
};

export default function HomeScreen() {
  const red = useThemeColor({}, 'accentRed');
  const green = useThemeColor({}, 'green');

  const [currentBill, setCurrentBill] = useState<CurrentBill | null>(null);
  const [loading, setLoading] = useState(true);

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
          period: data.period,
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
      pathname: '/finance/paymentScreen',
      params: { billId: currentBill.id },
    });
  };

  const formatPeriod = (period?: string) => {
    if (!period) return '';
    try {
      const date = new Date(period);
      const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
      const formatted = date.toLocaleDateString('ru-RU', options);
      return formatted.charAt(0).toLowerCase() + formatted.slice(1);
    } catch {
      return period;
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
        <ThemedCard style={{ marginTop: 40, padding: 16 }}>
          <ThemedView withBackground={false} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <ThemedView withBackground={false} style={{ flexShrink: 1 }}>
              <ThemedText type="label">
                Сумма платежа
              </ThemedText>

              <ThemedView withBackground={false} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <ThemedText type="paymentAmount">
                  {currentBill.accruedAmount.toFixed(2).replace('.', ',')}
                </ThemedText>
                <ThemedText type="paymentCurrency"> руб.</ThemedText>
              </ThemedView>

              <ThemedText type="label" colorName={currentBill.status === 'Оплачено' ? 'green' : 'accentRed'} style={{ marginTop: 6 }}>
                {currentBill.status}
              </ThemedText>
            </ThemedView>

            {currentBill.status === 'Не оплачено' && (
              <ThemedButton
                title="Оплатить"
                style={{ width: 140, paddingVertical: 12, marginLeft: 16 }}
                onPress={handlePaymentPress}
              />
            )}

          </ThemedView>
        </ThemedCard>
      ) : (
        <ThemedCard style={{ alignItems: 'center', padding: 24, marginTop: 40 }}>
          <Ionicons name="checkmark-circle-outline" size={48} color={green} />
          <ThemedText style={{ color: green, marginTop: 12, fontSize: 16, fontWeight: '500' }}>
            Все счета оплачены
          </ThemedText>
        </ThemedCard>
      )}
    </ScreenContainer>
  );
}
