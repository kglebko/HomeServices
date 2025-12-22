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
import { fetchLatestNews, NewsItem, getRelativeTime } from '@/api/newsApi';
import { fetchLatestServices, ServiceItem } from '@/api/servicesApi';
import { useThemeColor } from '@/hooks/use-theme-color';

type CurrentBill = {
    id: number;
    accruedAmount: number;
    status: 'Оплачено' | 'Не оплачено';
    period?: string;
};

// Функция для получения полного URL изображения
const getFullImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    const LOCAL_IP = '192.168.0.104'; // Замените на свой IP
    const BASE_URL = `http://${LOCAL_IP}:8080`;
    if (imageUrl.startsWith('/uploads/')) return `${BASE_URL}${imageUrl}`;
    return `${BASE_URL}/uploads/${imageUrl}`;
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
    const baseUrl = Platform.OS === 'android'
        ? 'http://10.0.2.2:8080'
        : 'http://192.168.31.18:8080';

    // ---- Загрузка данных ----
    const loadNews = async () => {
        try {
            setNewsLoading(true);
            setNewsError(null);
            const news = await fetchLatestNews();
            setNewsItems(news);
        } catch (err: any) {
            setNewsError(err.message || 'Ошибка загрузки новостей');
        } finally {
            setNewsLoading(false);
        }
    };

    const loadServices = async () => {
        try {
            setServicesLoading(true);
            const servicesData = await fetchLatestServices();
            setServices(servicesData);
        } catch (err: any) {
            console.error('Ошибка загрузки услуг:', err);
        } finally {
            setServicesLoading(false);
        }
    };

    const fetchCurrentBill = async () => {
        try {
            setBillLoading(true);
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

    useEffect(() => {
        loadNews();
        loadServices();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCurrentBill();
        }, [])
    );

    // ---- Обработчики ----
    const handlePaymentPress = () => {
        if (!currentBill) return;
        router.push({ pathname: '/finance/paymentScreen', params: { billId: currentBill.id } });
    };

    const handleNewsPress = (newsId: number) => {
        router.push(`../news/${newsId}`);
    };

    const handleServicePress = (service: ServiceItem) => {
        const timeRange = service.workHours || '10:00-20:00';
        const [startTime, endTime] = timeRange.split('-');
        router.push({
            pathname: '/requests', // <-- корректный путь
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

    const getTimeForDisplay = (news: NewsItem) => news.timeAgo || getRelativeTime(news.updatedAt);
    const getServiceIcon = (name: string) => {
        const icons: Record<string, any> = {
            'Сантехник': require('../../assets/icons/santehnik.png'),
            'Электрик': require('../../assets/icons/electric.png'),
            'Слесарь': require('../../assets/icons/slesar.png'),
            'Клининг': require('../../assets/icons/cleaning.png'),
            'Грузчик': require('../../assets/icons/gruzchik.png'),
            'Мастер': require('../../assets/icons/master.png'),
        };
        return icons[name] || require('../../assets/icons/master.png');
    };

    return (
        <ScreenContainer scrollable>
            {/* ---- ПЛАШКА ОПЛАТЫ ---- */}
            {billLoading ? (
                <ThemedCard style={{ marginTop: 65, padding: 24, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <ThemedText style={{ marginTop: 12, color: '#8A8A8A' }}>Загрузка информации о счете...</ThemedText>
                </ThemedCard>
            ) : currentBill ? (
                <ThemedCard style={{ marginTop: 65, padding: 16 }}>
                    <ThemedView withBackground={false} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <ThemedView withBackground={false} style={{ flexShrink: 1 }}>
                            <ThemedText type="label">Сумма платежа {currentBill.period ? `за ${currentBill.period}` : ''}</ThemedText>
                            <ThemedView withBackground={false} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                <ThemedText type="paymentAmount">{currentBill.accruedAmount.toFixed(2).replace('.', ',')}</ThemedText>
                                <ThemedText type="paymentCurrency"> руб.</ThemedText>
                            </ThemedView>
                            <ThemedText type="label" colorName={currentBill.status === 'Оплачено' ? 'green' : 'accentRed'} style={{ marginTop: 6 }}>
                                {currentBill.status}
                            </ThemedText>
                        </ThemedView>
                        {currentBill.status === 'Не оплачено' && (
                            <ThemedButton title="Оплатить" style={{ width: 140, paddingVertical: 12, marginLeft: 16 }} onPress={handlePaymentPress} />
                        )}
                    </ThemedView>
                </ThemedCard>
            ) : (
                <ThemedCard style={{ alignItems: 'center', padding: 24, marginTop: 65 }}>
                    <Ionicons name="checkmark-circle-outline" size={48} color={green} />
                    <ThemedText style={{ color: green, marginTop: 12, fontSize: 16, fontWeight: '500' }}>Все счета оплачены</ThemedText>
                </ThemedCard>
            )}

            {/* ---- НОВОСТИ ---- */}
            <ThemedView withBackground={false} style={{ marginTop: 24, marginBottom: 8 }}>
                <ThemedView withBackground={false} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                    <ThemedText type="sectionTitle" style={{ fontFamily: 'ActayWide-Bold', fontSize: 16 }}>Новости</ThemedText>
                    <TouchableOpacity onPress={() => router.push('../news')}>
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
                        <ThemedButton title="Повторить" onPress={loadNews} style={{ marginTop: 10, paddingHorizontal: 20 }} />
                    </View>
                ) : newsItems.length === 0 ? (
                    <View style={{ height: 250, justifyContent: 'center', alignItems: 'center' }}>
                        <ThemedText style={{ color: '#8A8A8A' }}>Новостей пока нет</ThemedText>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {newsItems.map(news => (
                            <NewsCard key={news.id} imageUri={getFullImageUrl(news.imageUrl)} title={news.title} time={getTimeForDisplay(news)} category={news.category} onPress={() => handleNewsPress(news.id)} />
                        ))}
                    </ScrollView>
                )}
            </ThemedView>

            {/* ---- УСЛУГИ ---- */}
            <ThemedView withBackground={false} style={{ marginTop: 16 }}>
                <ThemedView withBackground={false} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <ThemedText type="sectionTitle" style={{ fontFamily: 'ActayWide-Bold', fontSize: 16 }}>Услуги</ThemedText>
                    <TouchableOpacity onPress={() => router.push('../services')}>
                        <ThemedText type="littleLabel">Все услуги</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {servicesLoading ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', minHeight: 200 }}>
                        {[1,2,3,4,5,6].map(i => (
                            <View key={i} style={{ width:'48%', marginBottom:12, padding:16, backgroundColor:'#2A2A2A', borderRadius:12, alignItems:'center' }}>
                                <ActivityIndicator size="small" color="#ffffff" />
                                <ThemedText style={{ marginTop:8, fontSize:12, color:'#8A8A8A' }}>Загрузка...</ThemedText>
                            </View>
                        ))}
                    </View>
                ) : (
                    <ThemedView style={{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginTop:0 }} withBackground={false}>
                        {services.map(service => (
                            <ServiceTile key={service.id} icon={getServiceIcon(service.name)} title={service.name} time={service.workHours || '10:00-20:00'} price={`от ${service.price} руб.`} onPress={() => handleServicePress(service)} />
                        ))}
                    </ThemedView>
                )}
            </ThemedView>
        </ScreenContainer>
    );
}
