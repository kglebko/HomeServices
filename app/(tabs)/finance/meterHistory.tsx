import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

type MeterMonthData = {
  month: string;
  meters: number[];
};

function MeterCard({ data }: { data: MeterMonthData }) {
  return (
    <ThemedCard style={{ marginBottom: 16, padding: 16 }}>
      <ThemedText type="paymentData" style={{ marginBottom: 12 }}>
        {data.month}
      </ThemedText>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {data.meters.map((value, index) => (
          <View key={index} style={{ alignItems: 'center', flex: 1 }}>
            <ThemedText type="littleLabel">{`Счётчик ${index + 1}`}</ThemedText>
            <ThemedText type="meters">{value}</ThemedText>
          </View>
        ))}
      </View>
    </ThemedCard>
  );
}

export default function MeterHistory() {
  const [meterData, setMeterData] = useState<MeterMonthData[]>([]);
  const userId = 1;

  const baseUrl = Platform.OS === 'android'
      ? 'http://10.0.2.2:8080'
      : 'http://192.168.31.18:8080';
      //: 'http://172.20.10.3:8080';
    

  useEffect(() => {
    fetch(`${baseUrl}/api/finance/meters/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('HTTP error');
        return res.json();
      })
      .then((data) => {
        const formatted = data.map((item: any) => {
          const month = new Date(item.readingMonth)
            .toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

          return {
            month: month.charAt(0).toUpperCase() + month.slice(1),
            meters: [
              item.meter1,
              item.meter2,
              item.meter3,
              item.meter4,
            ],
          };
        });

        setMeterData(formatted);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);


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
