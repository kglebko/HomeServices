import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedInput } from '@/components/themed-input';
import { Platform } from 'react-native';

function CardItem({ type, last4 }: { type: string; last4: string }) {
  const cardColor = useThemeColor({}, 'cardBackground');
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
        <View style={{ justifyContent: 'center' }}>
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
  const [billDetails, setBillDetails] = useState<{
    accruedAmount: string;
    meterSum?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const billId = params.billId as string;
  const meter1 = params.meter1 as string || '0';
  const meter2 = params.meter2 as string || '0';
  const meter3 = params.meter3 as string || '0';
  const meter4 = params.meter4 as string || '0';
  const residentsCount = params.residentsCount as string || '1';

  const baseUrl = Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'
    : 'http://192.168.31.18:8080';
  const userId = 1;

  useEffect(() => {
    fetchBillDetails();
  }, []);

  const fetchBillDetails = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/finance/current/${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setBillDetails({
            accruedAmount: data.accruedAmount?.toFixed(2).replace('.', ',') || '0,00',
            meterSum: data.meterSum ? data.meterSum.toFixed(2).replace('.', ',') : undefined
          });
          setAmount(data.accruedAmount?.toFixed(2) || '0');
        }
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
    }
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Введите корректную сумму');
      return;
    }

    setLoading(true);
    try {
      const meterReadingData = {
        userId: userId,
        meter1: parseInt(meter1) || 0,
        meter2: parseInt(meter2) || 0,
        meter3: parseInt(meter3) || 0,
        meter4: parseInt(meter4) || 0
      };

      const meterResponse = await fetch(`${baseUrl}/api/meters/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meterReadingData)
      });

      if (!meterResponse.ok) {
        throw new Error('Ошибка при сохранении показаний');
      }

      const paymentResponse = await fetch(`${baseUrl}/api/finance/pay/${billId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `amount=${parseFloat(amount)}`
      });

      if (!paymentResponse.ok) {
        throw new Error('Ошибка при оплате');
      }

      router.replace('/(tabs)/finance/paymentSuccess');

    } catch (error) {
      console.error('Payment error:', error);
      alert('Ошибка при проведении оплаты');
    } finally {
      setLoading(false);
    }
  };

  const universalCount = 'По счетчикам 1,2,3,4';

  return (
    <ScreenContainer scrollable>

      <ThemedText type="label" style={{ marginBottom: 8 }}>
        С карты
      </ThemedText>
      <CardItem type="MasterCard" last4="5479" />

      <ThemedView withBackground={false} style={{ marginTop: 24 }}>
        <ThemedText type="label">Универсальный подсчет</ThemedText>
        <ThemedText type="paymentData">{universalCount}</ThemedText>
      </ThemedView>

      <ThemedView withBackground={false} style={{ marginTop: 16 }}>
        <ThemedText type="label">Проживающих, чел.</ThemedText>
        <ThemedText type="paymentData">{residentsCount}</ThemedText>
      </ThemedView>

      <ThemedView withBackground={false} style={{ marginTop: 16, marginBottom: 16 }}>
        <ThemedText type="label">По показаниям</ThemedText>
        <ThemedText type="paymentData">{billDetails?.accruedAmount || '0,00'} руб.</ThemedText>
      </ThemedView>

      <ThemedInput
        label="Сумма платежа, руб."
        value={amount}
        onChangeText={setAmount}
        placeholderValue={billDetails?.accruedAmount || '0'}
      />

      <ThemedButton
        title={loading ? "Обработка..." : "Оплатить"}
        onPress={handlePayment}
        disabled={loading}
      />

      
    </ScreenContainer>
  );
}