import { View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { NewsCard } from '@/components/news/NewsCard';
import { ServiceTile } from '@/components/services/ServiceTile';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router, useFocusEffect } from 'expo-router';

type CurrentBill = {
  id: number;
  accruedAmount: number;
  status: 'Оплачено' | 'Не оплачено';
  period?: string;
};

export default function HomeScreen() {
  const red = useThemeColor({}, 'accentRed');
  const green = useThemeColor({}, 'green');

  const [currentBill, setCurrentBill] = useState<CurrentBill | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = 1;
  const baseUrl = Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'
    : 'http://192.168.31.18:8080';

  const NEWS_ITEMS = [
    {
      id: 1,
      image: require('../../assets/images/news1.png'),
      title: "Каждый подъезд дома был украшен к Новому году!",
      time: "Вчера 19:00",
      category: "Праздники",
    },
    {
      id: 2,
      image: require('../../assets/images/news2.png'),
      title: "Обновление системы оплаты",
      time: "2 дня назад",
      category: "Уведомление",
    },
  ];

  const fetchCurrentBill = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/finance/current/${userId}`);
      const data = await response.json();

      if (data?.id) {
        setCurrentBill({
          id: data.id,
          accruedAmount: data.accruedAmount,
          status: data.status,
          period: data.period,
        });
      } else {
        setCurrentBill(null);
      }
    } catch (e) {
      console.error('Ошибка загрузки счета:', e);
      setCurrentBill(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCurrentBill();
    }, [])
  );

  const handlePaymentPress = () => {
    if (!currentBill) return;

    router.push({
      pathname: '/(tabs)/finance/paymentForServices',
      params: { billId: currentBill.id },
    });
  };

  const handleNewsPress = (newsId: number) => {
    router.push(`/news/${newsId}` as any);
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ThemedText>Загрузка...</ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      {/* ---- Блок с оплатой (динамический из бэкенда) ---- */}
      {currentBill ? (
        <ThemedCard style={{ marginTop: 40, padding: 16 }}>
          <ThemedView withBackground={false} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <ThemedView withBackground={false} style={{ flexShrink: 1 }}>
              <ThemedText type="label">
                Сумма платежа {currentBill.period ? `за ${currentBill.period}` : ''}
              </ThemedText>

              <ThemedView withBackground={false} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <ThemedText type="paymentAmount">
                  {currentBill.accruedAmount.toFixed(2).replace('.', ',')}
                </ThemedText>
                <ThemedText type="paymentCurrency"> руб.</ThemedText>
              </ThemedView>

              <ThemedText 
                type="label" 
                colorName={currentBill.status === 'Оплачено' ? 'green' : 'accentRed'} 
                style={{ marginTop: 6 }}
              >
                {currentBill.status}
              </ThemedText>
            </ThemedView>

            {currentBill.status === 'Не оплачено' && (
              <ThemedButton
                title="Оплатить"
                style={{ width: 140, paddingVertical: 12, marginLeft: 16 }}
                onPress={handlePaymentPress}
              />
            )}

          </ThemedView>
        </ThemedCard>
      ) : (
        <ThemedCard style={{ alignItems: 'center', padding: 24, marginTop: 40 }}>
          <Ionicons name="checkmark-circle-outline" size={48} color={green} />
          <ThemedText style={{ color: green, marginTop: 12, fontSize: 16, fontWeight: '500' }}>
            Все счета оплачены
          </ThemedText>
        </ThemedCard>
      )}

      {/* ---- НОВОСТИ ---- */}
      <ThemedView withBackground={false} style={{ marginTop: 24, marginBottom: 8 }}>
        <ThemedView
          withBackground={false}
          style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}
        >
          <ThemedText
            type="sectionTitle"
            style={{ fontFamily: 'ActayWide-Bold', fontSize: 16 }}
          >
            Новости
          </ThemedText>
          <TouchableOpacity onPress={() => router.push('/news' as any)}>
            <ThemedText type="littleLabel">Все новости</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {NEWS_ITEMS.map((news) => (
            <NewsCard
              key={news.id}
              image={news.image}
              title={news.title}
              time={news.time}
              category={news.category}
              onPress={() => handleNewsPress(news.id)}
            />
          ))}
        </ScrollView>
      </ThemedView>

      {/* ---- УСЛУГИ ---- */}
      <ThemedView withBackground={false} style={{ marginTop: 16 }}>
        <ThemedView
          withBackground={false}
          style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}
        >
          <ThemedText
            type="sectionTitle"
            style={{ fontFamily: 'ActayWide-Bold', fontSize: 16 }}
          >
            Услуги
          </ThemedText>
          <TouchableOpacity onPress={() => router.push('/services' as any)}>
            <ThemedText type="littleLabel">Все услуги</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView
          withBackground={false}
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginTop: 0,
          }}
        >
          <ServiceTile
            icon={require('../../assets/icons/santehnik.png')}
            title="Сантехник"
            time="10:00–19:00"
            price="от 20 руб."
          />
          <ServiceTile
            icon={require('../../assets/icons/electric.png')}
            title="Электрик"
            time="10:00–20:00"
            price="от 20 руб."
            onPress={() =>
              router.push({
                pathname: '/request',
                params: {
                  title: 'Электрик',
                  icon: 'electric',
                },
              })
            }
          />
          <ServiceTile
            icon={require('../../assets/icons/slesar.png')}
            title="Слесарь"
            time="10:00–20:00"
            price="от 30 руб."
          />
          <ServiceTile
            icon={require('../../assets/icons/cleaning.png')}
            title="Клининг"
            time="10:00–20:00"
            price="от 50 руб."
          />
          <ServiceTile
            icon={require('../../assets/icons/gruzchik.png')}
            title="Грузчик"
            time="10:00–19:00"
            price="от 40 руб."
          />
          <ServiceTile
            icon={require('../../assets/icons/master.png')}
            title="Мастер"
            price="от 100 руб."
          />
        </ThemedView>
      </ThemedView>
    </ScreenContainer>
  );
}