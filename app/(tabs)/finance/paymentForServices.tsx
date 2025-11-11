import { View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedInput } from '@/components/themed-input';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';
import React, { useState } from 'react';

export default function PaymentForServices() {
  const [meters, setMeters] = useState({ meter1: '', meter2: '', meter3: '', meter4: '' });
  const billDate = '11.11.2025';
  const period = 'Октябрь';
  const previousValues = ['245', '132', '86', '199'];

  return (
    <ScreenContainer scrollable>
      <ThemedView withBackground={false} style={{ marginBottom: 20 }}>
        <ThemedText type="label">Дата выставления счета</ThemedText>
        <ThemedText type="paymentData" style={{ marginBottom: 20 }}>{billDate}</ThemedText>

        <ThemedText type="label">Период</ThemedText>
        <ThemedText type="paymentData">{period}</ThemedText>
      </ThemedView>

      <ThemedView withBackground={false} style={{ gap: 8, marginBottom: 12 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <ThemedInput
            key={index}
            label={`Счетчик ${index + 1} — текущие показания`}
            value={meters[`meter${index + 1}` as keyof typeof meters]}
            placeholderValue={previousValues[index]}
            onChangeText={(text) =>
              setMeters((prev) => ({ ...prev, [`meter${index + 1}`]: text }))
            }
          />
        ))}
      </ThemedView>

      <ThemedButton
        title="Продолжить"
        onPress={() => router.push('/(tabs)/finance/paymentScreen')}
      />
    </ScreenContainer>
  );
}
