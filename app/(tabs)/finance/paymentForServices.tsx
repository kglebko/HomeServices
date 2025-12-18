import { View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedInput } from '@/components/themed-input';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';

type BillDetails = {
  id: number;
  period: string;
  accruedDate: string;
  status: string;
};

type PreviousReading = {
  meter1: number;
  meter2: number;
  meter3: number;
  meter4: number;
  readingMonth: string;
};

export default function PaymentForServices() {
  const { billId } = useLocalSearchParams<{ billId: string }>();
  const [bill, setBill] = useState<BillDetails | null>(null);
  const [previousReadings, setPreviousReadings] = useState<PreviousReading | null>(null);
  const [userInfo, setUserInfo] = useState<{ residentsCount: number } | null>(null);
  const [meters, setMeters] = useState({ 
    meter1: '', 
    meter2: '', 
    meter3: '', 
    meter4: '' 
  });
  const [loading, setLoading] = useState(true);

  const baseUrl = Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'
    : 'http://192.168.31.18:8080';
  const userId = 1;

  useEffect(() => {
    if (billId) {
      fetchBillDetails();
      fetchPreviousReadings();
      fetchUserInfo();
    }
  }, [billId]);

  const fetchBillDetails = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/finance/bills/${userId}`);
      if (response.ok) {
        const bills = await response.json();
        const currentBill = bills.find((b: any) => b.id === parseInt(billId!));
        if (currentBill) {
          const periodStr = new Date(currentBill.period).toLocaleDateString('ru-RU', {
            month: 'long',
            year: 'numeric'
          });
          const periodCapitalized = periodStr.charAt(0).toUpperCase() + periodStr.slice(1);
          
          setBill({
            id: currentBill.id,
            period: periodCapitalized,
            accruedDate: new Date(currentBill.accruedDate).toLocaleDateString('ru-RU'),
            status: currentBill.status
          });
        }
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
    }
  };

  const fetchPreviousReadings = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/finance/meters/${userId}`);
      if (response.ok) {
        const readings = await response.json();
        if (readings.length > 0) {
          const latestReading = readings[0];
          const monthStr = new Date(latestReading.readingMonth).toLocaleDateString('ru-RU', {
            month: 'long',
            year: 'numeric'
          });
          const monthCapitalized = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
          
          setPreviousReadings({
            meter1: latestReading.meter1,
            meter2: latestReading.meter2,
            meter3: latestReading.meter3,
            meter4: latestReading.meter4,
            readingMonth: monthCapitalized
          });
        }
      }
    } catch (error) {
      console.error('Error fetching readings:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/finance/user/${userId}`);
      if (response.ok) {
        const user = await response.json();
        setUserInfo({
          residentsCount: user.residentsCount
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push({
      pathname: '/(tabs)/finance/paymentScreen',
      params: { 
        billId,
        meter1: meters.meter1 || previousReadings?.meter1.toString() || '0',
        meter2: meters.meter2 || previousReadings?.meter2.toString() || '0',
        meter3: meters.meter3 || previousReadings?.meter3.toString() || '0',
        meter4: meters.meter4 || previousReadings?.meter4.toString() || '0',
        residentsCount: userInfo?.residentsCount.toString() || '1'
      }
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
    <ScreenContainer scrollable>
      {bill && (
        <ThemedView withBackground={false} style={{ marginBottom: 20 }}>
          <ThemedText type="label">Дата выставления счета</ThemedText>
          <ThemedText type="paymentData" style={{ marginBottom: 20 }}>{bill.accruedDate}</ThemedText>

          <ThemedText type="label">Период</ThemedText>
          <ThemedText type="paymentData">{bill.period}</ThemedText>
        </ThemedView>
      )}

      <ThemedView withBackground={false} style={{ gap: 8, marginBottom: 12 }}>
        {[1, 2, 3, 4].map((index) => (
          <ThemedInput
            key={index}
            label={`Счетчик ${index} — текущие показания`}
            value={meters[`meter${index}` as keyof typeof meters]}
            placeholderValue={previousReadings?.[`meter${index}` as keyof PreviousReading]?.toString() || '0'}
            onChangeText={(text) =>
              setMeters((prev) => ({ ...prev, [`meter${index}`]: text.replace(/[^0-9]/g, '') }))
            }
            keyboardType="numeric"
          />
        ))}
      </ThemedView>

      <ThemedButton
        title="Продолжить"
        onPress={handleContinue}
      />
    </ScreenContainer>
  );
}