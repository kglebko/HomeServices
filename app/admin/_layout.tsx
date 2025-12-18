import React, { useEffect, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiClient } from '@lib/api/client';

// Вариант 2: Или используйте require
// const { apiClient } = require('../../lib/api/client');

export default function AdminLayout() {
    const segments = useSegments();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('adminToken');

            if (!token && segments[1] !== 'login') {
                router.replace('/login');
                return;
            }

            if (token) {
                const response = await apiClient.post<{ valid: boolean }>(
                    '/api/auth/verify',
                    { token },
                    false
                );

                if (!response.success || !response.data?.valid) {
                    await AsyncStorage.removeItem('adminToken');
                    await AsyncStorage.removeItem('adminData');
                    router.replace('/login');
                }
            }
        } catch (error) {
            console.error('Auth check error:', error);
            if (segments[1] !== 'login') {
                router.replace('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4361ee" />
            </View>
        );
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: '#f8fafc',
                }
            }}
        >
            <Stack.Screen name="login" />
            <Stack.Screen name="index" />
            <Stack.Screen name="news/index" />
            <Stack.Screen name="news/create" />
            <Stack.Screen name="news/[id]" />
            <Stack.Screen name="services/index" />
            <Stack.Screen name="services/create" />
            <Stack.Screen name="posts/index" />
            <Stack.Screen name="posts/create" />
        </Stack>
    );
}