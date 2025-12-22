// app/news/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { fetchNewsById, getFullImageUrl, NewsItem, getRelativeTime, toggleNewsLike } from '@/api/newsApi';

const ORANGE_COLOR = '#FF6B35';

export default function NewsDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const userId = 1;

    useEffect(() => {
        loadNews();
    }, [id]);

    useEffect(() => {
        navigation.setOptions({
            title: 'Новость',
            headerStyle: { backgroundColor: '#1E1E1E', elevation: 0, shadowOpacity: 0 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontFamily: 'Actay-Bold', fontSize: 16 },
            headerTitleAlign: 'center',
            headerLeft: () => (
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => ({
                        marginLeft: 16, padding: 8, marginRight: -8,
                        opacity: pressed ? 0.7 : 1, backgroundColor: 'transparent', borderRadius: 0
                    })}
                    android_ripple={null}
                >
                    <Image
                        source={require('../../assets/images/back.png')}
                        style={{ width: 24, height: 24 }}
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
            setImageError(false);

            const newsId = id ? parseInt(id) : 1;
            const newsData = await fetchNewsById(newsId, userId);

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

    const handleLikePress = async () => {
        if (!news || isLiking) return;

        try {
            setIsLiking(true);
            const currentLikes = news.likesCount;
            const currentIsLiked = news.isLiked || false;

            const updatedNews = {
                ...news,
                likesCount: currentIsLiked ? currentLikes - 1 : currentLikes + 1,
                isLiked: !currentIsLiked
            };
            setNews(updatedNews);

            const result = await toggleNewsLike(news.id, userId);

            if (!result.success) {
                setNews({
                    ...news,
                    likesCount: currentLikes,
                    isLiked: currentIsLiked
                });
            }
        } catch (error) {
            console.error('Ошибка при обновлении лайка:', error);
            setNews(news);
        } finally {
            setIsLiking(false);
        }
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
    const likeIconColor = news.isLiked ? ORANGE_COLOR : '#8A8A8A';
    const likeIconName = news.isLiked ? 'heart' : 'heart-outline';

    return (
        <ScreenContainer scrollable>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ position: 'relative', marginBottom: 20 }}>
                    {imageUri ? (
                        <>
                            <Image
                                source={{ uri: imageUri }}
                                style={{ width: '100%', height: 240, borderRadius: 12 }}
                                resizeMode="cover"
                                onError={handleImageError}
                            />
                            {imageError && (
                                <View style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: '#2A2A2A', borderRadius: 12,
                                    justifyContent: 'center', alignItems: 'center'
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
                            width: '100%', height: 240, backgroundColor: '#2A2A2A', borderRadius: 12,
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Ionicons name="image-outline" size={64} color="#8A8A8A" />
                            <ThemedText style={{ color: '#8A8A8A', marginTop: 12 }}>
                                Нет изображения
                            </ThemedText>
                        </View>
                    )}
                </View>

                <View style={{
                    backgroundColor: '#2A2A2A',
                    alignSelf: 'flex-start',
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 16,
                    marginBottom: 16
                }}>
                    <ThemedText style={{ fontSize: 14, color: '#8A8A8A', fontFamily: 'Actay' }}>
                        {news.category}
                    </ThemedText>
                </View>

                <ThemedText style={{
                    fontFamily: 'ActayWide-Bold',
                    fontSize: 28,
                    color: '#DCDCDC',
                    marginBottom: 16,
                    lineHeight: 34
                }}>
                    {news.title}
                </ThemedText>

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
                        <ThemedText style={{ fontSize: 16, color: '#8A8A8A', fontFamily: 'Actay', marginBottom: 4 }}>
                            {news.timeAgo || getRelativeTime(news.updatedAt)}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 14, color: '#DCDCDC', fontFamily: 'Actay' }}>
                            Автор: {news.author}
                        </ThemedText>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <TouchableOpacity
                            style={{ alignItems: 'center' }}
                            onPress={handleLikePress}
                            disabled={isLiking}
                        >
                            {isLiking ? (
                                <ActivityIndicator size={24} color={likeIconColor} />
                            ) : (
                                <Ionicons
                                    name={likeIconName}
                                    size={24}
                                    color={likeIconColor}
                                />
                            )}
                            <ThemedText style={{ fontSize: 12, color: '#8A8A8A', marginTop: 4 }}>
                                {news.likesCount}
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
            </ScrollView>
        </ScreenContainer>
    );
}