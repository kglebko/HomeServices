// app/news/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';
import { Ionicons } from '@expo/vector-icons';
import { fetchNewsById, getFullImageUrl, NewsItem, getRelativeTime } from '@/api/newsApi';

export default function NewsDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        loadNews();
    }, [id]);

    useEffect(() => {
        navigation.setOptions({
            title: 'Новость',
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
                        source={require('../../assets/images/back.png')}
                        style={{
                            width: 24,
                            height: 24,
                        }}
                    />
                </Pressable>
            ),
            headerRight: () => (
                <Pressable
                    onPress={() => console.log('Поделиться')}
                    style={({ pressed }) => ({
                        marginRight: 16,
                        padding: 8,
                        marginLeft: -8,
                        opacity: pressed ? 0.7 : 1,
                        backgroundColor: 'transparent',
                        borderRadius: 0,
                    })}
                    android_ripple={null}
                >
                    <Ionicons name="share-outline" size={24} color="#DCDCDC" />
                </Pressable>
            ),
            headerBackVisible: false,
        });
    }, [navigation]);

    const loadNews = async () => {
        try {
            setLoading(true);
            setError(null);
            setImageError(false);

            const newsId = id ? parseInt(id) : 1;
            const newsData = await fetchNewsById(newsId);

            if (!newsData) {
                setError('Новость не найдена');
                return;
            }

            setNews(newsData);
        } catch (err: any) {
            setError(err.message || 'Ошибка загрузки новости');
        } finally {
            setLoading(false);
        }
    };

    const getRelativeTimeForNews = (newsItem: NewsItem): string => {
        return newsItem.timeAgo || getRelativeTime(newsItem.updatedAt);
    };

    const handleImageError = () => {
        setImageError(true);
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

    if (!news) {
        return (
            <ScreenContainer scrollable>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ThemedText>Новость не найдена</ThemedText>
                </View>
            </ScreenContainer>
        );
    }

    const imageUri = getFullImageUrl(news.imageUrl);

    return (
        <ScreenContainer scrollable>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Изображение */}
                <View style={{ position: 'relative', marginBottom: 20 }}>
                    {imageUri ? (
                        <>
                            <Image
                                source={{ uri: imageUri }}
                                style={{
                                    width: '100%',
                                    height: 240,
                                    borderRadius: 12,
                                }}
                                resizeMode="cover"
                                onError={handleImageError}
                            />

                            {imageError && (
                                <View style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: '#2A2A2A',
                                    borderRadius: 12,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Ionicons name="image-outline" size={64} color="#8A8A8A" />
                                    <ThemedText style={{ color: '#8A8A8A', marginTop: 12 }}>
                                        Изображение недоступно
                                    </ThemedText>
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={{
                            width: '100%',
                            height: 240,
                            backgroundColor: '#2A2A2A',
                            borderRadius: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Ionicons name="image-outline" size={64} color="#8A8A8A" />
                            <ThemedText style={{ color: '#8A8A8A', marginTop: 12 }}>
                                Нет изображения
                            </ThemedText>
                        </View>
                    )}
                </View>

                {/* Категория */}
                <View style={{
                    backgroundColor: '#2A2A2A',
                    alignSelf: 'flex-start',
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 16,
                    marginBottom: 16
                }}>
                    <ThemedText style={{
                        fontSize: 14,
                        color: '#8A8A8A',
                        fontFamily: 'Actay'
                    }}>
                        {news.category}
                    </ThemedText>
                </View>

                {/* Заголовок */}
                <ThemedText style={{
                    fontFamily: 'ActayWide-Bold',
                    fontSize: 28,
                    color: '#DCDCDC',
                    marginBottom: 16,
                    lineHeight: 34
                }}>
                    {news.title}
                </ThemedText>

                {/* Информация о новости */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                    paddingBottom: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#2A2A2A'
                }}>
                    <View>
                        <ThemedText style={{
                            fontSize: 16,
                            color: '#8A8A8A',
                            fontFamily: 'Actay',
                            marginBottom: 4
                        }}>
                            {getRelativeTimeForNews(news)}
                        </ThemedText>
                        <ThemedText style={{
                            fontSize: 14,
                            color: '#DCDCDC',
                            fontFamily: 'Actay'
                        }}>
                            Автор: {news.author}
                        </ThemedText>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <TouchableOpacity style={{ alignItems: 'center' }}>
                            <Ionicons name="heart-outline" size={24} color="#8A8A8A" />
                            <ThemedText style={{ fontSize: 12, color: '#8A8A8A', marginTop: 4 }}>
                                {news.likesCount}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ alignItems: 'center' }}>
                            <Ionicons name="chatbubble-outline" size={24} color="#8A8A8A" />
                            <ThemedText style={{ fontSize: 12, color: '#8A8A8A', marginTop: 4 }}>
                                {news.commentsCount}
                            </ThemedText>
                        </TouchableOpacity>

                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name="eye-outline" size={24} color="#8A8A8A" />
                            <ThemedText style={{ fontSize: 12, color: '#8A8A8A', marginTop: 4 }}>
                                {news.viewCount}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Контент */}
                <View style={{ marginBottom: 32 }}>
                    <ThemedText style={{
                        fontFamily: 'Actay',
                        fontSize: 16,
                        color: '#DCDCDC',
                        lineHeight: 24,
                    }}>
                        {news.fullContent || news.content}
                    </ThemedText>
                </View>

                {/* Кнопки действий */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40 }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: '#2A2A2A',
                            paddingVertical: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 8
                        }}
                        onPress={() => console.log('Лайк')}
                    >
                        <Ionicons name="heart-outline" size={20} color="#DCDCDC" />
                        <ThemedText style={{
                            fontSize: 16,
                            color: '#DCDCDC',
                            fontFamily: 'Actay'
                        }}>
                            Нравится
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: '#2A2A2A',
                            paddingVertical: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 8
                        }}
                        onPress={() => console.log('Комментарий')}
                    >
                        <Ionicons name="chatbubble-outline" size={20} color="#DCDCDC" />
                        <ThemedText style={{
                            fontSize: 16,
                            color: '#DCDCDC',
                            fontFamily: 'Actay'
                        }}>
                            Комментировать
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Кнопка поделиться */}
                <ThemedButton
                    title="Поделиться новостью"
                    style={{ marginBottom: 40 }}
                    onPress={() => console.log('Поделиться новостью')}
                />
            </ScrollView>
        </ScreenContainer>
    );
}