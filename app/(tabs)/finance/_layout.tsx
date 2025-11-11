import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { router } from 'expo-router';

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
              <Ionicons name="chevron-back" size={24} color="#FD3C2C" />
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
    </Stack>
  );
}
