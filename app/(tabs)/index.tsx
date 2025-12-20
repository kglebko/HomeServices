// app/index.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { router } from 'expo-router';
import { NewsCard } from '@/components/news/NewsCard';
import { ServiceTile } from '@/components/services/ServiceTile';
import { fetchLatestNews, NewsItem, getFullImageUrl, getRelativeTime } from '@/api/newsApi';
import { fetchLatestServices, ServiceItem } from '@/api/servicesApi';

export default function HomeScreen() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadNews();
        loadServices();
    }, []);

    const loadNews = async () => {
        try {
            setLoading(true);
            setError(null);
            const news = await fetchLatestNews();
            setNewsItems(news);
        } catch (err: any) {
            setError(err.message || 'Ошибка загрузки новостей');
            console.error('Error loading news:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadServices = async () => {
        try {
            setServicesLoading(true);
            const servicesData = await fetchLatestServices();
            setServices(servicesData);
        } catch (err: any) {
            console.error('Error loading services:', err);
        } finally {
            setServicesLoading(false);
        }
    };

    const handleNewsPress = (newsId: number) => {
        router.push(`/news/${newsId}`);
    };

    const handleServicePress = (service: ServiceItem) => {
        router.push({
            pathname: '/request',
            params: {
                serviceId: service.id.toString(),
                title: service.name,
                price: service.price.toString(),
            },
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
                    <TouchableOpacity onPress={() => router.push('/news')}>
                        <ThemedText type="littleLabel">Все новости</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {loading ? (
                    <View style={{ height: 250, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="small" color="#ffffff" />
                        <ThemedText style={{ marginTop: 12, color: '#8A8A8A' }}>Загрузка новостей...</ThemedText>
                    </View>
                ) : error ? (
                    <View style={{ height: 250, justifyContent: 'center', alignItems: 'center' }}>
                        <ThemedText style={{ color: '#ff6b6b' }}>{error}</ThemedText>
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
                        {newsItems.map((news) => (
                            <NewsCard
                                key={news.id}
                                imageUri={getFullImageUrl(news.imageUrl)}
                                title={news.title}
                                time={getTimeForDisplay(news)}
                                category={news.category}
                                onPress={() => handleNewsPress(news.id)}
                            />
                        ))}
                    </ScrollView>
                )}
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