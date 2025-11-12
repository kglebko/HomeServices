import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';
import { ThemedInput } from '@/components/themed-input';

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
  const [amount, setAmount] = useState('');

  const handlePayment = () => {
    router.replace('/(tabs)/finance');
  };

  const universalCount = 'По счетчикам 1,2,3,4';
  const residentsCount = '4';
  const meterSum = '93,60';

  return (
    <ScreenContainer scrollable>

      <ThemedText type="label" style={{ marginBottom: 8 }}>
        С карты
      </ThemedText>
      <CardItem type="MasterCard" last4="5479" />

      <ThemedView withBackground={false} style={{ marginTop: 0 }}>
        <ThemedText type="label">Универсальный подсчет</ThemedText>
        <ThemedText type="paymentData">{universalCount}</ThemedText>
      </ThemedView>

      <ThemedView withBackground={false} style={{ marginTop: 16 }}>
        <ThemedText type="label">Проживающих, чел.</ThemedText>
        <ThemedText type="paymentData">{residentsCount}</ThemedText>
      </ThemedView>

      <ThemedView withBackground={false} style={{ marginTop: 16 , marginBottom: 16 }}>
        <ThemedText type="label">По показаниям</ThemedText>
        <ThemedText type="paymentData">{meterSum} руб.</ThemedText>
      </ThemedView>

      <ThemedInput
        label="Сумма платежа, руб."
        value={amount}
        onChangeText={setAmount}
        placeholderValue="0"
      />

      <ThemedButton
        title="Оплатить"
        onPress={handlePayment}
      />

      
    </ScreenContainer>
  );
}
