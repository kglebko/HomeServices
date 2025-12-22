// app/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { router, useFocusEffect } from 'expo-router';
import { NewsCard } from '@/components/news/NewsCard';
import { ServiceTile } from '@/components/services/ServiceTile';
import { fetchLatestNews, NewsItem, getRelativeTime, getFullImageUrl } from '@/api/newsApi';
import { fetchLatestServices, ServiceItem } from '@/api/servicesApi';
import { useThemeColor } from '@/hooks/use-theme-color';

type CurrentBill = {
    id: number;
    accruedAmount: number;
    status: 'Оплачено' | 'Не оплачено';
    period?: string;
};

export default function HomeScreen() {
    const red = useThemeColor({}, 'accentRed');
    const green = useThemeColor({}, 'green');

    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [currentBill, setCurrentBill] = useState<CurrentBill | null>(null);

    const [newsLoading, setNewsLoading] = useState(true);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [billLoading, setBillLoading] = useState(true);

    const [newsError, setNewsError] = useState<string | null>(null);

    const userId = 1;

    // Базовый URL ДЛЯ ФИНАНСОВ (как в старом работающем коде)
    const baseUrl = Platform.OS === 'android'
        ? 'http://10.0.2.2:8080'
        : 'http://192.168.31.18:8080'; // ← ВАЖНО: используем старый работающий IP для iOS

    // Загрузка новостей
    const loadNews = async () => {
        try {
            setNewsLoading(true);
            setNewsError(null);
            console.log('🔄 Загрузка новостей для userId:', userId);

            // fetchLatestNews использует свой getBaseUrl из api/newsApi.ts
            const news = await fetchLatestNews(userId);
            console.log(`✅ Загружено ${news.length} новостей`);

            setNewsItems(news);
        } catch (err: any) {
            setNewsError(err.message || 'Ошибка загрузки новостей');
            console.error('❌ Ошибка загрузки новостей:', err);
        } finally {
            setNewsLoading(false);
        }
    };

    // Загрузка услуг
    const loadServices = async () => {
        try {
            setServicesLoading(true);
            console.log('🔄 Загрузка услуг...');
            const servicesData = await fetchLatestServices();
            console.log(`✅ Загружено ${servicesData.length} услуг`);
            setServices(servicesData);
        } catch (err: any) {
            console.error('❌ Ошибка загрузки услуг:', err);
        } finally {
            setServicesLoading(false);
        }
    };

    // Загрузка текущего счета (ТОЧНО КАК В РАБОТАЮЩЕМ КОДЕ)
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
            setBillLoading(false);
        }
    };

    // Первоначальная загрузка
    useEffect(() => {
        loadNews();
        loadServices();
        fetchCurrentBill();
    }, []);

    // Обновление при фокусе
    useFocusEffect(
        useCallback(() => {
            setBillLoading(true);
            fetchCurrentBill();
            // Дополнительно обновляем новости
            loadNews();
        }, [])
    );

    const handleNewsPress = (newsId: number) => {
        router.push(`/news/${newsId}`);
    };

    const handleServicePress = (service: ServiceItem) => {
        const timeRange = service.workHours || '10:00-20:00';
        const [startTime, endTime] = timeRange.split('-');

        router.push({
            pathname: '/request',
            params: {
                serviceId: service.id.toString(),
                title: service.name,
                price: service.price.toString(),
                workHours: timeRange,
                startTime: startTime.trim(),
                endTime: endTime?.trim()
            },
        });
    };

    const handlePaymentPress = () => {
        if (!currentBill) return;

        router.push({
            pathname: '/finance/paymentForServices',
            params: { billId: currentBill.id },
        });
    };

    const getTimeForDisplay = (news: NewsItem): string => {
        return news.timeAgo || getRelativeTime(news.updatedAt);
    };

    const getServiceIcon = (serviceName: string): any => {
        const iconMap: Record<string, any> = {
            'Сантехник': require('../../assets/icons/santehnik.png'),
            'Электрик': require('../../assets/icons/electric.png'),
            'Слесарь': require('../../assets/icons/slesar.png'),
            'Клининг': require('../../assets/icons/cleaning.png'),
            'Грузчик': require('../../assets/icons/gruzchik.png'),
            'Мастер': require('../../assets/icons/master.png'),
        };
        return iconMap[serviceName] || require('../../assets/icons/master.png');
    };

    return (
        <ScreenContainer scrollable>
            {/* ---- БЛОК ОПЛАТЫ ---- */}
            {billLoading ? (
                <ThemedCard style={{ marginTop: 65, padding: 24, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <ThemedText style={{ marginTop: 12, color: '#8A8A8A' }}>
                        Загрузка информации о счете...
                    </ThemedText>
                </ThemedCard>
            ) : currentBill ? (
                <ThemedCard style={{ marginTop: 65, padding: 16 }}>
                    <ThemedView
                        withBackground={false}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <ThemedView withBackground={false} style={{ flexShrink: 1 }}>
                            <ThemedText type="label">Сумма платежа</ThemedText>

                            <ThemedView withBackground={false} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <ThemedText type="paymentAmount">
                                    {currentBill.accruedAmount.toFixed(2).replace('.', ',')}
                                </ThemedText>
                                <ThemedText type="paymentCurrency">руб.</ThemedText>
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
                <ThemedCard style={{ alignItems: 'center', padding: 24, marginTop: 65 }}>
                    <Ionicons name="checkmark-circle-outline" size={48} color={green} />
                    <ThemedText style={{ color: green, marginTop: 12, fontSize: 16, fontWeight: '500' }}>
                        Все счета оплачены
                    </ThemedText>
                </ThemedCard>
            )}

            {/* ---- НОВОСТИ ---- */}
            <ThemedView withBackground={false} style={{ marginTop: 9, marginBottom: 8 }}>
                <ThemedView
                    withBackground={false}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}
                >
                    <ThemedText type="sectionTitle" style={{ fontFamily: 'ActayWide-Bold', fontSize: 16 }}>
                        Новости
                    </ThemedText>
                    <TouchableOpacity onPress={() => router.push('/news')}>
                        <ThemedText type="littleLabel">Все новости</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {newsLoading ? (
                    <View style={{ height: 250, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="small" color="#ffffff" />
                        <ThemedText style={{ marginTop: 12, color: '#8A8A8A' }}>Загрузка новостей...</ThemedText>
                    </View>
                ) : newsError ? (
                    <View style={{ height: 250, justifyContent: 'center', alignItems: 'center' }}>
                        <ThemedText style={{ color: '#ff6b6b' }}>{newsError}</ThemedText>
                        <ThemedButton
                            title="Повторить"
                            onPress={loadNews}
                            style={{ marginTop: 10, paddingHorizontal: 20 }}
                        />
                    </View>
                ) : newsItems.length === 0 ? (
                    <View style={{ height: 250, justifyContent: 'center', alignItems: 'center' }}>
                        <ThemedText style={{ color: '#8A8A8A' }}>Новостей пока нет</ThemedText>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {newsItems.map((news) => {
                            const imageUrl = getFullImageUrl(news.imageUrl);

                            return (
                                <NewsCard
                                    key={news.id}
                                    imageUri={imageUrl}
                                    title={news.title}
                                    time={getTimeForDisplay(news)}
                                    category={news.category}
                                    onPress={() => handleNewsPress(news.id)}
                                />
                            );
                        })}
                    </ScrollView>
                )}
            </ThemedView>

            {/* ---- УСЛУГИ ---- */}
            <ThemedView withBackground={false} style={{ marginTop: 9 }}>
                <ThemedView
                    withBackground={false}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}
                >
                    <ThemedText type="sectionTitle" style={{ fontFamily: 'ActayWide-Bold', fontSize: 16 }}>
                        Услуги
                    </ThemedText>
                    <TouchableOpacity onPress={() => router.push('/services')}>
                        <ThemedText type="littleLabel">Все услуги</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {servicesLoading ? (
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        minHeight: 200
                    }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <View key={i} style={{
                                width: '48%',
                                marginBottom: 12,
                                padding: 16,
                                backgroundColor: '#2A2A2A',
                                borderRadius: 12,
                                alignItems: 'center'
                            }}>
                                <ActivityIndicator size="small" color="#ffffff" />
                                <ThemedText style={{
                                    marginTop: 8,
                                    fontSize: 12,
                                    color: '#8A8A8A'
                                }}>
                                    Загрузка...
                                </ThemedText>
                            </View>
                        ))}
                    </View>
                ) : (
                    <ThemedView
                        withBackground={false}
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            marginTop: 0,
                        }}
                    >
                        {services.map((service) => (
                            <ServiceTile
                                key={service.id}
                                icon={getServiceIcon(service.name)}
                                title={service.name}
                                time={service.workHours || '10:00-20:00'}
                                price={`от ${service.price} руб.`}
                                onPress={() => handleServicePress(service)}
                            />
                        ))}
                    </ThemedView>
                )}
            </ThemedView>
        </ScreenContainer>
    );
}