import React from 'react';
import { View, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { router } from 'expo-router';
import { NewsCard } from '@/components/news/NewsCard';
import { ServiceTile } from '@/components/services/ServiceTile';

export default function HomeScreen() {
  return (
    <ScreenContainer scrollable>
      {/* ---- Блок с оплатой ---- */}
      <ThemedCard style={{ marginTop: 65, padding: 16 }}>
        <ThemedView
          withBackground={false}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
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
            style={{ width: 140, paddingVertical: 12, marginLeft: 16 }}
            onPress={() => router.push('/finance/paymentScreen')}
          />
        </ThemedView>
      </ThemedCard>

      {/* ---- НОВОСТИ ---- */}
      <ThemedView withBackground={false} style={{ marginTop: 9, marginBottom: 8 }}>
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
          <ThemedText type="littleLabel">Все новости</ThemedText>
        </ThemedView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <NewsCard
            image={require('../../assets/images/news1.png')}
            title="Каждый подъезд дома был украшен к Новому году!"
            time="Вчера 19:00"
          />
          <NewsCard
            image={require('../../assets/images/news2.png')}
            title="Обновление системы оплаты"
            time="2 дня назад"
          />
        </ScrollView>
      </ThemedView>

      {/* ---- УСЛУГИ ---- */}
      <ThemedView withBackground={false} style={{ marginTop: 9 }}>
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
          <ThemedText type="littleLabel">Все услуги</ThemedText>
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
