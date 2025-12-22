import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedInput } from '@/components/themed-input';
import { ThemedButton } from '@/components/themed-button';
import { router, useLocalSearchParams } from 'expo-router';

type BillDetails = {
  id: number;
  period: string; 
  accruedDate: string; 
};

type PreviousReading = {
  meter1: number;
  meter2: number;
  meter3: number;
  meter4: number;
};

export default function PaymentForServices() {
  const { billId } = useLocalSearchParams<{ billId: string }>();

  const [bill, setBill] = useState<BillDetails | null>(null);
  const [previousReadings, setPreviousReadings] = useState<PreviousReading | null>(null);
  const [residentsCount, setResidentsCount] = useState<number>(1);
  const [meters, setMeters] = useState({
    meter1: '',
    meter2: '',
    meter3: '',
    meter4: '',
  });
  const [loading, setLoading] = useState(true);

  const userId = 1;

  const baseUrl =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080'
      : 'http://192.168.31.18:8080';

  useEffect(() => {
    if (billId) {
      Promise.all([fetchBill(), fetchPreviousReadings(), fetchUserInfo()]).finally(
        () => setLoading(false)
      );
    }
  }, [billId]);

  const fetchBill = async () => {
    const res = await fetch(`${baseUrl}/api/finance/bills/${userId}`);
    if (!res.ok) return;

    const bills = await res.json();
    const current = bills.find((b: any) => b.id === Number(billId));

    if (current) {
      setBill({
        id: current.id,
        accruedDate: new Date(current.accruedDate).toLocaleDateString('ru-RU'),
        period: current.period,
      });
    }
  };

  const fetchPreviousReadings = async () => {
    const res = await fetch(`${baseUrl}/api/finance/meters/${userId}`);
    if (!res.ok) return;

    const data = await res.json();
    if (data.length > 0) {
      setPreviousReadings({
        meter1: data[0].meter1,
        meter2: data[0].meter2,
        meter3: data[0].meter3,
        meter4: data[0].meter4,
      });
    }
  };

  const fetchUserInfo = async () => {
    const res = await fetch(`${baseUrl}/api/finance/user/${userId}`);
    if (!res.ok) return;

    const data = await res.json();
    setResidentsCount(data.residentsCount ?? 1);
  };

  const handleContinue = async () => {
    if (!bill) {
      alert('Не найден счет');
      return;
    }

    try {
      const monthStr = new Date(bill.period).toISOString().slice(0, 7);

      const payload = {
        userId,
        meter1: Number(meters.meter1 || previousReadings?.meter1 || 0),
        meter2: Number(meters.meter2 || previousReadings?.meter2 || 0),
        meter3: Number(meters.meter3 || previousReadings?.meter3 || 0),
        meter4: Number(meters.meter4 || previousReadings?.meter4 || 0),
        month: monthStr,
      };

      const response = await fetch(`${baseUrl}/api/meters/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Meters error:', text);
        throw new Error();
      }

      router.push({
        pathname: '/(tabs)/finance/paymentScreen',
        params: {
          billId,
          meter1: payload.meter1.toString(),
          meter2: payload.meter2.toString(),
          meter3: payload.meter3.toString(),
          meter4: payload.meter4.toString(),
          residentsCount: residentsCount.toString(),
        },
      });
    } catch {
      alert('Ошибка сохранения показаний');
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
    <ScreenContainer scrollable>
      {bill && (
        <ThemedView withBackground={false} style={{ marginBottom: 20 }}>
          <ThemedText type="label">Дата выставления</ThemedText>
          <ThemedText type="paymentData">{bill.accruedDate}</ThemedText>

          <ThemedText type="label" style={{ marginTop: 12 }}>
            Период
          </ThemedText>
          <ThemedText type="paymentData">
            {new Date(bill.period).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
          </ThemedText>
        </ThemedView>
      )}

      {[1, 2, 3, 4].map((i) => (
        <ThemedInput
          key={i}
          label={`Счетчик ${i}`}
          keyboardType="numeric"
          value={meters[`meter${i}` as keyof typeof meters]}
          placeholderValue={
            previousReadings?.[`meter${i}` as keyof PreviousReading]?.toString() || '0'
          }
          onChangeText={(text) =>
            setMeters((p) => ({
              ...p,
              [`meter${i}`]: text.replace(/[^0-9]/g, ''),
            }))
          }
        />
      ))}

      <ThemedButton title="Продолжить" onPress={handleContinue} />
    </ScreenContainer>
  );
}