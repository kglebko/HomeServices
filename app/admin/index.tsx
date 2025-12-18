import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://25.21.56.83:5001/api';

interface NewsItem {
    id: number;
    title: string;
    content: string;
    category: string;
    image_url?: string;
    author: string;
    created_at: string;
}

export default function NewsAdminScreen() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            if (!token) {
                Alert.alert('Ошибка', 'Требуется авторизация');
                return;
            }

            setLoading(true);
            const response = await fetch(`${API_URL}/news/admin/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNews(data);
            } else {
                Alert.alert('Ошибка', 'Не удалось загрузить новости');
            }
        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
            Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadNews();
    };

    const handleDelete = async (id: number) => {
        Alert.alert(
            'Удалить новость',
            'Вы уверены, что хотите удалить эту новость?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('adminToken');
                            const response = await fetch(`${API_URL}/news/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (response.ok) {
                                Alert.alert('Успешно', 'Новость удалена');
                                loadNews();
                            } else {
                                Alert.alert('Ошибка', 'Не удалось удалить новость');
                            }
                        } catch (error) {
                            console.error('Ошибка удаления:', error);
                            Alert.alert('Ошибка', 'Не удалось удалить новость');
                        }
                    }
                }
            ]
        );
    };

    const renderNewsItem = ({ item }: { item: NewsItem }) => (
        <View style={styles.newsItem}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsCategory}>{item.category}</Text>
            <Text style={styles.newsDate}>
                {new Date(item.created_at).toLocaleDateString('ru-RU')}
            </Text>
            <Text style={styles.newsAuthor}>Автор: {item.author}</Text>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="create-outline" size={20} color="#4361ee" />
                    <Text style={styles.editButtonText}>Редактировать</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color="#f72585" />
                    <Text style={styles.deleteButtonText}>Удалить</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4361ee" />
                <Text style={styles.loadingText}>Загрузка новостей...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Управление новостями</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add-circle" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Добавить</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={news}
                renderItem={renderNewsItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#4361ee']}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="newspaper-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>Новостей пока нет</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4361ee',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    listContainer: {
        padding: 16,
    },
    newsItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    newsCategory: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    newsDate: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    newsAuthor: {
        fontSize: 12,
        color: '#888',
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f7ff',
        padding: 8,
        borderRadius: 6,
        gap: 6,
    },
    editButtonText: {
        color: '#4361ee',
        fontSize: 14,
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff0f3',
        padding: 8,
        borderRadius: 6,
        gap: 6,
    },
    deleteButtonText: {
        color: '#f72585',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginTop: 12,
        fontWeight: '600',
    },
});