import React from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function RequestsScreen() {
  const red = useThemeColor({}, 'accentRed');
  const green = useThemeColor({}, 'green');
  const text = useThemeColor({}, 'text');

  const currentRequests = [
    {
      type: 'Слесарь',
      date: '12.11.2025',
      time: '13:00 – 15:00',
      price: '0,00 руб.',
      status: 'На рассмотрении',
    },
    {
      type: 'Электрик',
      date: '14.11.2025',
      time: '10:00 – 12:00',
      price: '18,00 руб.',
      status: 'Принята',
    },
  ];

  const historyRequests = [
    {
      type: 'Электрик',
      date: '11.11.2025',
      time: '13:00 – 15:00',
      price: '0,00 руб.',
      status: 'Отменена',
    },
    {
      type: 'Слесарь',
      date: '15.10.2025',
      time: '13:00 – 15:00',
      price: '18,00 руб.',
      status: 'Выполнена',
    },
    {
      type: 'Плиточник',
      date: '02.10.2025',
      time: '09:00 – 11:00',
      price: '45,00 руб.',
      status: 'Выполнена',
    },
    {
      type: 'Перевозчик',
      date: '22.09.2025',
      time: '12:00 – 14:00',
      price: '80,00 руб.',
      status: 'Отменена',
    },
    {
      type: 'Маляр',
      date: '10.09.2025',
      time: '15:00 – 17:00',
      price: '70,00 руб.',
      status: 'Выполнена',
    },
    {
      type: 'Курьер',
      date: '01.09.2025',
      time: '09:30 – 10:30',
      price: '10,00 руб.',
      status: 'Выполнена',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'На рассмотрении':
      case 'Отменена':
        return red;
      case 'Принята':
      case 'Выполнена':
        return green;
      default:
        return text;
    }
  };

  return (
    <ScreenContainer scrollable>
      {currentRequests.length > 0 && (
        <ThemedText type="screenTitle" style={{ textAlign: 'center', marginBottom: 20 }}>
          Текущие заявки
        </ThemedText>
      )}

      {currentRequests.map((req, index) => (
        <ThemedCard
          key={index}
          style={{
            borderWidth: 1,
            borderColor: red
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <ThemedText type="paymentData">{req.type}</ThemedText>

            <ThemedText type="paymentStatus" style={{ color: getStatusColor(req.status) }}>
              {req.status}
            </ThemedText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <ThemedText type="label">{req.date}</ThemedText>
              <ThemedText type="label">{req.time}</ThemedText>
              <ThemedText type="label">{req.price}</ThemedText>
            </View>

            <ThemedButton
              title="Отменить"
              style={{
                width: 120,   
                paddingVertical: 12,
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 16, 
              }}
              textColor="#DCDCDC"
              textStyle={{ fontSize: 16 }}
            />
          </View>
        </ThemedCard>
      ))}

      <ThemedText type="screenTitle" style={{ textAlign: 'center', marginVertical: 20 }}>
        История заявок
      </ThemedText>

      {historyRequests.map((req, index) => (
        <ThemedCard key={index} style={{ marginBottom: 16, padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <ThemedText type="paymentData" style={{marginBottom: 20}}>{req.type}</ThemedText>
              <ThemedText type="label">{req.date}</ThemedText>
              <ThemedText type="label">{req.time}</ThemedText>
              <ThemedText type="label">{req.price}</ThemedText>
            </View>

            <View style={{ justifyContent: 'center' }}>
              <ThemedText type="paymentStatus" style={{ color: getStatusColor(req.status) }}>
                {req.status}
              </ThemedText>
            </View>
          </View>
        </ThemedCard>
      ))}

    </ScreenContainer>
  );
}
