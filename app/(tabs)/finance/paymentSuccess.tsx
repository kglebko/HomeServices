import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { Pressable } from 'react-native';

export default function PaymentSuccessScreen() {

  useEffect(() => {
  
  }, []);

  const handleGoToPaymentsHistory = () => {
    router.replace('/(tabs)/finance/paymentHistory');
    
    };

    const handleGoHome = () => {
    router.replace('../../');
    };


  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Image
          source={require('../../../assets/images/success.png')}
          style={{
            width: 120,
            height: 120,
            marginBottom: 24,
          }}
        />

        <ThemedText
          type="paymentSuccess"
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          Оплата прошла успешно
        </ThemedText>


        <ThemedButton
          title="Перейти к истории платежей"
          style={{
            width: '100%',
            marginBottom: 2,
            paddingVertical: 16,
          }}
          onPress={handleGoToPaymentsHistory}
        />

        <Pressable
          onPress={handleGoHome}
          style={({ pressed }) => ({
            paddingVertical: 16,
            width: '100%',
            alignItems: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <ThemedText
            style={{
              fontFamily: 'Actay',
              fontSize: 16,
              color: '#D64105',
            }}> На главную </ThemedText>
        </Pressable>

      </View>
    </ScreenContainer>
  );
}
