import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedInput } from '@/components/themed-input';

function CardItem({ type, last4 }: { type: string; last4: string }) {
  const textColor = useThemeColor({}, 'text');
  const accentRed = useThemeColor({}, 'accentRed');

  return (
    <ThemedCard style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 60,
            height: 40,
            borderRadius: 6,
            backgroundColor: textColor,
            marginRight: 16,
          }}
        />
        <View>
          <ThemedText type="label">{type}</ThemedText>
          <ThemedText type="label">•••• {last4}</ThemedText>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={accentRed} />
    </ThemedCard>
  );
}

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [billAmount, setBillAmount] = useState('0,00');

  const billId = params.billId as string;
  const residentsCount = (params.residentsCount as string) || '1';

  const baseUrl =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080'
      : 'http://192.168.31.18:8080';

  const userId = 1;

  useEffect(() => {
    fetchBill();
  }, []);

  const fetchBill = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/finance/current/${userId}`);
      if (!res.ok) return;

      const data = await res.json();
      if (data?.accruedAmount != null) {
        const formatted = data.accruedAmount.toFixed(2);
        setAmount(formatted);
        setBillAmount(formatted.replace('.', ','));
      }
    } catch (e) {
      console.error('Ошибка загрузки счёта:', e);
    }
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Введите корректную сумму');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/finance/pay/${billId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `amount=${parseFloat(amount)}`,
      });

      if (!res.ok) {
        throw new Error('Ошибка при оплате');
      }

      router.replace('/(tabs)/finance/paymentSuccess');
    } catch (e) {
      console.error('Payment error:', e);
      alert('Ошибка при проведении оплаты');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      <ThemedText type="label" style={{ marginBottom: 8 }}>
        С карты
      </ThemedText>

      <CardItem type="MasterCard" last4="5479" />

      <ThemedView withBackground={false} style={{ marginTop: 24 }}>
        <ThemedText type="label">Проживающих, чел.</ThemedText>
        <ThemedText type="paymentData">{residentsCount}</ThemedText>
      </ThemedView>

      <ThemedView withBackground={false} style={{ marginVertical: 16 }}>
        <ThemedText type="label">К оплате</ThemedText>
        <ThemedText type="paymentData">{billAmount} руб.</ThemedText>
      </ThemedView>

      <ThemedInput
        label="Сумма платежа, руб."
        value={amount}
        onChangeText={setAmount}
      />

      <ThemedButton
        title={loading ? 'Обработка...' : 'Оплатить'}
        onPress={handlePayment}
        disabled={loading}
      />
    </ScreenContainer>
  );
}