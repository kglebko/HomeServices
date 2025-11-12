// screens/PaymentHistory.tsx
import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedCard } from '@/components/themed-card';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useThemeColor } from '@/hooks/use-theme-color';

type MonthData = {
  month: string;
  status: 'Оплачено' | 'Не оплачено';
  accruedAmount: string;
  accruedDate: string;
  paidAmount: string;
  paidDate?: string;
};

function MonthCard({ data }: { data: MonthData }) {
  const red = useThemeColor({}, 'accentRed');
  const green = useThemeColor({}, 'green');

  const statusColor = data.status === 'Оплачено' ? green : red;

  return (
    <ThemedCard style={{ marginBottom: 16, padding: 16, paddingBottom: 12 }}>
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
        <ThemedText type="costHistory">{data.accruedAmount}</ThemedText>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <ThemedText type="label">Оплачено</ThemedText>
          <ThemedText type="label">{data.paidDate || ''}</ThemedText>
        </View>
        <ThemedText type="costHistory">{data.paidAmount}</ThemedText>
      </View>
    </ThemedCard>
  );
}

export default function PaymentHistory() {
  const red = useThemeColor({}, 'accentRed');
  const green = useThemeColor({}, 'green');

  const monthsData: MonthData[] = [
    { month: 'Октябрь', status: 'Не оплачено', accruedAmount: '90,90 руб.', accruedDate: '11.11.2025', paidAmount: '0,00 руб.' },
    { month: 'Сентябрь', status: 'Оплачено', accruedAmount: '92,80 руб.', accruedDate: '10.10.2025', paidAmount: '92,80 руб.', paidDate: '14.10.2025' },
    { month: 'Август', status: 'Оплачено', accruedAmount: '92,50 руб.', accruedDate: '10.09.2025', paidAmount: '92,50 руб.', paidDate: '15.09.2025' },
    { month: 'Июль', status: 'Оплачено', accruedAmount: '91,00 руб.', accruedDate: '10.08.2025', paidAmount: '91,00 руб.', paidDate: '14.08.2025' },
    { month: 'Июнь', status: 'Оплачено', accruedAmount: '90,00 руб.', accruedDate: '10.07.2025', paidAmount: '90,00 руб.', paidDate: '12.07.2025' },
    { month: 'Май', status: 'Оплачено', accruedAmount: '89,50 руб.', accruedDate: '10.06.2025', paidAmount: '89,50 руб.', paidDate: '12.06.2025' },
    { month: 'Апрель', status: 'Оплачено', accruedAmount: '88,00 руб.', accruedDate: '10.05.2025', paidAmount: '88,00 руб.', paidDate: '12.05.2025' },
    { month: 'Март', status: 'Оплачено', accruedAmount: '87,00 руб.', accruedDate: '10.04.2025', paidAmount: '87,00 руб.', paidDate: '12.04.2025' },
    { month: 'Февраль', status: 'Оплачено', accruedAmount: '86,50 руб.', accruedDate: '10.03.2025', paidAmount: '86,50 руб.', paidDate: '12.03.2025' },
    { month: 'Январь', status: 'Оплачено', accruedAmount: '85,00 руб.', accruedDate: '10.02.2025', paidAmount: '85,00 руб.', paidDate: '12.02.2025' },
    { month: 'Декабрь', status: 'Оплачено', accruedAmount: '84,50 руб.', accruedDate: '10.01.2025', paidAmount: '84,50 руб.', paidDate: '12.01.2025' },
    { month: 'Ноябрь', status: 'Оплачено', accruedAmount: '83,00 руб.', accruedDate: '10.12.2024', paidAmount: '83,00 руб.', paidDate: '12.12.2024' },
  ];

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
