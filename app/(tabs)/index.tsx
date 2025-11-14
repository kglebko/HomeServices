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

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <ThemedCard style={{ marginTop: 40, padding: 16 }}>
        
        <ThemedView withBackground={false} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

          <ThemedView withBackground={false} style={{ flexShrink: 1 }}>
            <ThemedText type="label">Сумма платежа</ThemedText>

            <ThemedView withBackground={false} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <ThemedText type="paymentAmount">93,50</ThemedText>
              <ThemedText type="paymentCurrency">руб.</ThemedText>
            </ThemedView>

            <ThemedText type="label" colorName="accentRed" style={{ marginTop: 6 }}>
              Не оплачено
            </ThemedText>
          </ThemedView>

          <ThemedButton
            title="Оплатить"
            style={{
              width: 140,   
              paddingVertical: 12,
              marginTop: 0,
              marginBottom: 0,
              marginLeft: 16, 
            }}
            onPress={() => router.push('/finance/paymentScreen')}
          />

        </ThemedView>

      </ThemedCard>
    </ScreenContainer>
  );
}
