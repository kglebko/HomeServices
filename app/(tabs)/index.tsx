import { fetchLatestNews, getFullImageUrl, NewsItem } from '@/api/newsApi';
import { NewsCard } from '@/components/news/NewsCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ServiceTile } from '@/components/services/ServiceTile';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            setLoadingNews(true);
            const news = await fetchLatestNews();
            // Берем только первые 2 новости для главного экрана
            setNewsItems(news.slice(0, 2));
        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
            setNewsItems([]);
        } finally {
            setLoadingNews(false);
        }
    };

    const handleNewsPress = (newsId: number) => {
        router.push(`/news/${newsId}` as any);
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
                        onPress={() => router.push('/(tabs)/finance/paymentScreen' as any)}
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
                    <TouchableOpacity onPress={() => router.push('/news' as any)}>
                        <ThemedText type="littleLabel">Все новости</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {loadingNews ? (
                    <ActivityIndicator size="small" color="#D64105" style={{ marginVertical: 20 }} />
                ) : newsItems.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {newsItems.map((news) => {
                            const imageUrl = getFullImageUrl(news.imageUrl);
                            // Если нет изображения, используем placeholder
                            const placeholderImage = Image.resolveAssetSource(require('../../assets/images/home54.png'));
                            const finalImageUri = imageUrl || placeholderImage?.uri || '';
                            
                            return (
                                <NewsCard
                                    key={news.id}
                                    imageUri={finalImageUri}
                                    title={news.title}
                                    time={news.timeAgo || 'недавно'}
                                    category={news.category}
                                    onPress={() => handleNewsPress(news.id)}
                                />
                            );
                        })}
                    </ScrollView>
                ) : (
                    <ThemedText type="littleLabel" style={{ paddingVertical: 20, textAlign: 'center' }}>
                        Новостей пока нет
                    </ThemedText>
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