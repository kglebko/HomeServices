import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function FinanceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#1E1E1E' },
        headerTintColor: '#fff',
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <Pressable
              onPress={() => router.back()}
              style={{ paddingHorizontal: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color="#D64105" />
            </Pressable>
          ) : null,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ 
          title: 'Финансы',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
          headerLeft: () => null,
          gestureEnabled: false,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="paymentForServices"
        options={{
          title: 'Оплата коммунальных услуг',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
        }}
      />
      <Stack.Screen
        name="paymentScreen"
        options={{
          title: 'Оплата коммунальных услуг',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
        }}
      />
      <Stack.Screen
        name="paymentHistory"
        options={{
          title: 'История платежей',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
        }}
      />
      <Stack.Screen
        name="meterHistory"
        options={{
          title: 'Предыдущие показания',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
        }}
      />

      <Stack.Screen
        name="paymentSuccess"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />


    </Stack>
  );
}
