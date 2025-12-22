import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { router } from 'expo-router';

export default function RequestsLayout() {
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
                    title: 'Заявки',
                    headerTitleStyle: {
                        fontFamily: 'Actay-Bold',
                        fontSize: 16,
                    },
                    headerLeft: () => null,
                    gestureEnabled: false,
                    headerBackVisible: false,
                }}
            />
        </Stack>
    );
}