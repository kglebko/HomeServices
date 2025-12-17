import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { router } from 'expo-router';

export default function ChatsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#1E1E1E' },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'Actay-Bold',
                    fontSize: 16,
                },
                headerLeft: ({ canGoBack }) =>
                    canGoBack ? (
                        <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
                            <Ionicons name="chevron-back" size={24} color="#D64105" />
                        </Pressable>
                    ) : null,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Чаты',
                    headerLeft: () => null,
                    headerBackVisible: false,
                    gestureEnabled: false,
                }}
            />

            <Stack.Screen
                name="management"
                options={{ title: 'Управляющая компания' }}
            />

            <Stack.Screen
                name="life"
                options={{ title: 'Жизнь ЖК' }}
            />

            <Stack.Screen
                name="house"
                options={{ title: 'Чат дома' }}
            />
        </Stack>
    );
}