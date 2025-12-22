import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type MonthData = {
  month: string;
  status: 'Оплачено' | 'Не оплачено';
  accruedAmount: string;
  accruedDate: string;
  paidAmount: string;
  paidDate?: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU');
}

function MonthCard({ data }: { data: MonthData }) {
  const red = useThemeColor({}, 'accentRed');
  const green = useThemeColor({}, 'green');

  const statusColor = data.status === 'Оплачено' ? green : red;

  return (
    <ThemedCard style={{ marginBottom: 16, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <ThemedText type="paymentData">{data.month}</ThemedText>
        <ThemedText type="paymentStatus" style={{ color: statusColor }}>
          {data.status}
        </ThemedText>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View>
          <ThemedText type="label">Начислено</ThemedText>
          <ThemedText type="label">{data.accruedDate}</ThemedText>
        </View>
        <ThemedText type="costHistory">{data.accruedAmount} руб.</ThemedText>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <ThemedText type="label">Оплачено</ThemedText>
          <ThemedText type="label">{data.paidDate ?? ''}</ThemedText>
        </View>
        <ThemedText type="costHistory">{data.paidAmount} руб.</ThemedText>
      </View>
    </ThemedCard>
  );
}

export default function PaymentHistory() {
  const [monthsData, setMonthsData] = useState<MonthData[]>([]);
  const userId = 1;

  const baseUrl =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080'
      : 'http://192.168.31.18:8080';

  useEffect(() => {
    fetch(`${baseUrl}/api/finance/payments/${userId}`)
      .then(res => res.json())
      .then(data => {
        const formatted: MonthData[] = data.map((item: any) => {
          const monthStr = new Date(item.period)
            .toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

          return {
            month: monthStr.charAt(0).toUpperCase() + monthStr.slice(1),
            status: item.status,
            accruedAmount: item.accruedAmount.toFixed(2).replace('.', ','),
            accruedDate: formatDate(item.accruedDate),
            paidAmount: item.paidAmount.toFixed(2).replace('.', ','),
            paidDate: item.paidDate ? formatDate(item.paidDate) : undefined,
          };
        });

        setMonthsData(formatted);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <ScreenContainer scrollable>
      <ThemedText type="screenTitle" style={{ textAlign: 'center', marginBottom: 16 }}>
        За последние 12 месяцев
      </ThemedText>

      {monthsData.map((month, index) => (
        <MonthCard key={index} data={month} />
      ))}
    </ScreenContainer>
  );
}
