import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedCard } from '@/components/themed-card';
import { ScreenContainer } from '@/components/ScreenContainer';

type MeterMonthData = {
  month: string;
  meters: number[]; 
};

function MeterCard({ data }: { data: MeterMonthData }) {
  return (
    <ThemedCard style={{ marginBottom: 16, padding: 16}}>
      <ThemedText type="paymentData" style={{ marginBottom: 12}}>
        {data.month}
      </ThemedText>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {data.meters.map((value, index) => (
          <View key={index} style={{ alignItems: 'center', flex: 1 }}>
            <ThemedText type="littleLabel">{`Счётчик ${index + 1}`}</ThemedText>
            <ThemedText type="paymentStatus">{value}</ThemedText>
          </View>
        ))}
      </View>
    </ThemedCard>
  );
}

export default function MeterHistory() {
  const meterData: MeterMonthData[] = [
    { month: 'Октябрь', meters: [990, 970, 940, 910] },
    { month: 'Сентябрь', meters: [985, 962, 935, 905] },
    { month: 'Август', meters: [978, 954, 928, 898] },
    { month: 'Июль', meters: [972, 945, 920, 890] },
    { month: 'Июнь', meters: [965, 936, 911, 880] },
    { month: 'Май', meters: [959, 928, 903, 872] },
    { month: 'Апрель', meters: [951, 918, 893, 862] },
    { month: 'Март', meters: [943, 907, 883, 852] },
    { month: 'Февраль', meters: [934, 897, 873, 842] },
    { month: 'Январь', meters: [924, 885, 861, 831] },
    { month: 'Декабрь', meters: [915, 873, 851, 820] },
    { month: 'Ноябрь', meters: [905, 860, 840, 810] },
  ];

  return (
    <ScreenContainer scrollable>
      <ThemedText type="screenTitle" style={{ textAlign: 'center', marginBottom: 20 }}>
        За последние 12 месяцев
      </ThemedText>

      {meterData.map((item, index) => (
        <MeterCard key={index} data={item} />
      ))}
    </ScreenContainer>
  );
}
