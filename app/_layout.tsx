import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { storage } from '@/services/storage';

export const unstable_settings = {
  anchor: 'login',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Actay: require('../assets/fonts/ActayRegular.otf'),
    'Actay-Bold': require('../assets/fonts/ActayBold.otf'),
  });

  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Проверка авторизации при загрузке и при изменении сегментов
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await storage.getToken();
        setIsAuthenticated(!!token);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Проверка авторизации при изменении сегментов (для обновления после регистрации/входа)
  useEffect(() => {
    const checkAuthOnSegmentChange = async () => {
      try {
        const token = await storage.getToken();
        const hasToken = !!token;
        setIsAuthenticated(hasToken);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    
    if (segments.length > 0) {
      checkAuthOnSegmentChange();
    }
  }, [segments]);

  // Навигация в зависимости от авторизации
  useEffect(() => {
    if (!fontsLoaded || isAuthenticated === null) return;

    const currentSegment = segments[0] as string;
    const inAuthGroup = currentSegment === '(tabs)';
    const inLoginGroup = currentSegment === 'login';

    if (!isAuthenticated && inAuthGroup) {
      // Если не авторизован, но пытается попасть в (tabs), перенаправляем на login
      router.replace('/login');
    } else if (isAuthenticated && inLoginGroup) {
      // Если авторизован и на экране логина, перенаправляем на (tabs)
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, fontsLoaded, router]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            gestureEnabled: false,
            animation: 'default',
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="news" options={{ headerShown: false }} />
        <Stack.Screen name="request" options={{ headerShown: false }} />
        <Stack.Screen name="request-success" options={{ headerShown: false }} />
        <Stack.Screen name="services" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
