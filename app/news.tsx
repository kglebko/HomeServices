// app/news/index.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedCard } from '@/components/themed-card';
import { Ionicons } from '@expo/vector-icons';
import { fetchAllNews, NewsItem, getFullImageUrl, getRelativeTime } from '@/api/newsApi';

export default function AllNewsScreen() {
    const [allNews, setAllNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        loadNews();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: 'Все новости',
            headerStyle: {
                backgroundColor: '#1E1E1E',
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontFamily: 'Actay-Bold',
                fontSize: 16,
            },
            headerTitleAlign: 'center',
            headerLeft: () => (
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => ({
                        marginLeft: 16,
                        padding: 8,
                        marginRight: -8,
                        opacity: pressed ? 0.7 : 1,
                        backgroundColor: 'transparent',
                        borderRadius: 0,
                    })}
                    android_ripple={null}
                >
                    <Image
                        source={require('@/assets/images/back.png')}
                        style={{
                            width: 24,
                            height: 24,
                        }}
                    />
                </Pressable>
            ),
            headerBackVisible: false,
        });
    }, [navigation]);

    const loadNews = async () => {
        try {
            setLoading(true);
            setError(null);
            const news = await fetchAllNews();
            setAllNews(news);
        } catch (err: any) {
            setError(err.message || 'Ошибка загрузки новостей');
            console.error('Error loading all news:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRelativeTimeForNews = (newsItem: NewsItem): string => {
        return newsItem.timeAgo || getRelativeTime(newsItem.updatedAt);
    };

    if (loading) {
        return (
            <ScreenContainer scrollable>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer scrollable>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ThemedText style={{ color: '#ff6b6b', textAlign: 'center', padding: 20 }}>
                        {error}
                    </ThemedText>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#2A2A2A',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 8,
                            marginTop: 20,
                        }}
                        onPress={loadNews}
                    >
                        <ThemedText style={{ color: '#DCDCDC' }}>Повторить попытку</ThemedText>
                    </TouchableOpacity>
                </View>
            </ScreenContainer>
        );
    }

    if (allNews.length === 0) {
        return (
            <ScreenContainer scrollable>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ThemedText style={{ color: '#8A8A8A' }}>Новостей пока нет</ThemedText>
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer scrollable>
            <ScrollView showsVerticalScrollIndicator={false}>
                {allNews.map((news) => {
                    const imageUri = getFullImageUrl(news.imageUrl);

                    return (
                        <TouchableOpacity
                            key={news.id}
                            onPress={() => router.push(`/news/${news.id}`)}
                            activeOpacity={0.8}
                            style={{ marginBottom: 20 }}
                        >
                            <ThemedCard style={{ padding: 0, overflow: 'hidden' }}>
                                {/* Изображение */}
                                {imageUri ? (
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={{
                                            width: '100%',
                                            height: 180,
                                        }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={{
                                        width: '100%',
                                        height: 180,
                                        backgroundColor: '#2A2A2A',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Ionicons name="image-outline" size={48} color="#8A8A8A" />
                                        <ThemedText style={{ color: '#8A8A8A', marginTop: 8 }}>
                                            Нет изображения
                                        </ThemedText>
                                    </View>
                                )}

                                {/* Контент */}
                                <View style={{ padding: 16 }}>
                                    {/* Категория */}
                                    <View style={{
                                        backgroundColor: '#333333',
                                        alignSelf: 'flex-start',
                                        paddingHorizontal: 12,
                                        paddingVertical: 4,
                                        borderRadius: 16,
                                        marginBottom: 8,
                                        borderWidth: 1,
                                        borderColor: '#2A2A2A',
                                    }}>
                                        <ThemedText style={{
                                            fontSize: 11,
                                            color: '#8A8A8A',
                                            fontFamily: 'Actay',
                                            fontWeight: '500',
                                        }}>
                                            {news.category}
                                        </ThemedText>
                                    </View>

                                    {/* Заголовок */}
                                    <ThemedText style={{
                                        fontFamily: 'ActayWide-Bold',
                                        fontSize: 18,
                                        color: '#DCDCDC',
                                        marginBottom: 12,
                                        lineHeight: 24,
                                    }}>
                                        {news.title}
                                    </ThemedText>

                                    {/* Время и автор */}
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 8,
                                    }}>
                                        <ThemedText style={{
                                            fontSize: 14,
                                            color: '#8A8A8A',
                                            fontFamily: 'Actay',
                                            flex: 1,
                                        }}>
                                            {getRelativeTimeForNews(news)} • {news.author}
                                        </ThemedText>
                                    </View>

                                    {/* Лайки и комментарии */}
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        gap: 20,
                                        borderTopWidth: 1,
                                        borderTopColor: '#2A2A2A',
                                        paddingTop: 12,
                                        marginTop: 4,
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}>
                                            <Ionicons name="heart-outline" size={18} color="#8A8A8A" />
                                            <ThemedText style={{
                                                fontSize: 14,
                                                color: '#8A8A8A',
                                                fontFamily: 'Actay',
                                            }}>
                                                {news.likesCount}
                                            </ThemedText>
                                        </View>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}>
                                            <Ionicons name="chatbubble-outline" size={18} color="#8A8A8A" />
                                            <ThemedText style={{
                                                fontSize: 14,
                                                color: '#8A8A8A',
                                                fontFamily: 'Actay',
                                            }}>
                                                {news.commentsCount}
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>
                            </ThemedCard>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </ScreenContainer>
    );
}