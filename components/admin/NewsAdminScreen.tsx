import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
    TextInput,
    Modal,
    ScrollView,
    Image,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://25.21.56.83:5001/api';

// Определите типы прямо в файле, если не работает импорт
interface News {
    id: number;
    title: string;
    content: string;
    full_content?: string;
    category: string;
    image_url?: string;
    author: string;
    likes: number;
    comments: number;
    created_at: string;
    updated_at: string;
    is_published: boolean;
}

interface ImageInfo {
    uri: string;
    type: string;
    name: string;
}

interface NewsFormData {
    title: string;
    content: string;
    full_content: string;
    category: string;
    author: string;
    image: ImageInfo | null;
}

const categories = ['Праздники', 'Уведомление', 'Ремонт', 'Собрание', 'Мероприятия', 'Объявление'];

export default function NewsAdminScreen() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);

    const [formData, setFormData] = useState<NewsFormData>({
        title: '',
        content: '',
        full_content: '',
        category: 'Праздники',
        author: 'Совет дома',
        image: null
    });

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
                const error = await response.json();
                Alert.alert('Ошибка', error.error || 'Не удалось загрузить новости');
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

    const handleAddPress = () => {
        setEditingNews(null);
        setFormData({
            title: '',
            content: '',
            full_content: '',
            category: 'Праздники',
            author: 'Совет дома',
            image: null
        });
        setModalVisible(true);
    };

    const handleEditPress = (item: News) => {
        setEditingNews(item);
        setFormData({
            title: item.title,
            content: item.content,
            full_content: item.full_content || item.content,
            category: item.category,
            author: item.author,
            image: item.image_url ? {
                uri: `${API_URL.replace('/api', '')}${item.image_url}`,
                type: 'image/jpeg',
                name: 'existing_image.jpg'
            } : null
        });
        setModalVisible(true);
    };

    const handleDeletePress = (id: number) => {
        Alert.alert(
            'Удалить новость',
            'Вы уверены, что хотите удалить эту новость?',
            [
                { text: 'Отмена', style: 'cancel' },
                { text: 'Удалить', style: 'destructive', onPress: () => deleteNews(id) }
            ]
        );
    };

    const deleteNews = async (id: number) => {
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
                const error = await response.json();
                Alert.alert('Ошибка', error.error || 'Ошибка удаления');
            }
        } catch (error) {
            console.error('Ошибка удаления:', error);
            Alert.alert('Ошибка', 'Не удалось удалить новость');
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Ошибка', 'Разрешение на доступ к галерее не предоставлено');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setFormData({
                ...formData,
                image: {
                    uri: result.assets[0].uri,
                    type: 'image/jpeg',
                    name: `news_${Date.now()}.jpg`
                }
            });
        }
    };

    const handleSubmit = async () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            Alert.alert('Ошибка', 'Заполните обязательные поля');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('adminToken');
            const form = new FormData();

            form.append('title', formData.title);
            form.append('content', formData.content);
            form.append('full_content', formData.full_content || formData.content);
            form.append('category', formData.category);
            form.append('author', formData.author);

            if (formData.image && formData.image.uri) {
                form.append('image', formData.image as any);
            }

            const url = editingNews ?
                `${API_URL}/news/${editingNews.id}` :
                `${API_URL}/news`;

            const method = editingNews ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: form,
            });

            if (response.ok) {
                Alert.alert('Успешно', editingNews ? 'Новость обновлена' : 'Новость создана');
                setModalVisible(false);
                loadNews();
            } else {
                const error = await response.json();
                Alert.alert('Ошибка', error.error || 'Ошибка сохранения');
            }
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            Alert.alert('Ошибка', 'Не удалось сохранить новость');
        }
    };

    const renderNewsItem = ({ item }: { item: News }) => (
        <View style={styles.newsItem}>
            <View style={styles.newsHeader}>
                <View style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(item.category) }
                ]}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.dateText}>
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                </Text>
            </View>

            <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>

            {item.image_url && (
                <Image
                    source={{ uri: `${API_URL.replace('/api', '')}${item.image_url}` }}
                    style={styles.newsImage}
                    resizeMode="cover"
                />
            )}

            <Text style={styles.newsContent} numberOfLines={3}>
                {item.content}
            </Text>

            <View style={styles.newsFooter}>
                <Text style={styles.authorText}>Автор: {item.author}</Text>
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditPress(item)}
                    >
                        <Ionicons name="create-outline" size={20} color="#4361ee" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeletePress(item.id)}
                    >
                        <Ionicons name="trash-outline" size={20} color="#f72585" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const getCategoryColor = (category: string): string => {
        const colors: { [key: string]: string } = {
            'Праздники': '#ff6b6b',
            'Уведомление': '#4ecdc4',
            'Ремонт': '#45b7d1',
            'Собрание': '#96ceb4',
            'Мероприятия': '#feca57',
            'Объявление': '#ff9ff3'
        };
        return colors[category] || '#8395a7';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Управление новостями</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddPress}
                >
                    <Ionicons name="add-circle" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Добавить</Text>
                </TouchableOpacity>
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4361ee" />
                    <Text style={styles.loadingText}>Загрузка новостей...</Text>
                </View>
            ) : (
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
                            <Text style={styles.emptySubtext}>
                                Нажмите &quot;Добавить&quot; чтобы создать первую новость
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Модальное окно формы */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {editingNews ? 'Редактировать новость' : 'Добавить новость'}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    style={styles.closeButton}
                                >
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Заголовок *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.title}
                                    onChangeText={(text) => setFormData({...formData, title: text})}
                                    placeholder="Введите заголовок"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Категория</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.categoryScroll}
                                >
                                    {categories.map((cat) => (
                                        <TouchableOpacity
                                            key={cat}
                                            style={[
                                                styles.categoryOption,
                                                formData.category === cat && styles.categoryOptionActive
                                            ]}
                                            onPress={() => setFormData({...formData, category: cat})}
                                        >
                                            <Text style={[
                                                styles.categoryOptionText,
                                                formData.category === cat && styles.categoryOptionTextActive
                                            ]}>
                                                {cat}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Краткое содержание *</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={formData.content}
                                    onChangeText={(text) => setFormData({...formData, content: text})}
                                    placeholder="Краткое содержание для списка новостей"
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Полный текст</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={formData.full_content}
                                    onChangeText={(text) => setFormData({...formData, full_content: text})}
                                    placeholder="Полный текст новости (если отличается от краткого)"
                                    multiline
                                    numberOfLines={6}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Автор</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.author}
                                    onChangeText={(text) => setFormData({...formData, author: text})}
                                    placeholder="Совет дома"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Изображение</Text>
                                <TouchableOpacity
                                    style={styles.imageButton}
                                    onPress={pickImage}
                                >
                                    <Ionicons name="image-outline" size={24} color="#4361ee" />
                                    <Text style={styles.imageButtonText}>
                                        {formData.image ? 'Изменить изображение' : 'Выбрать изображение'}
                                    </Text>
                                </TouchableOpacity>

                                {formData.image && (
                                    <View style={styles.imagePreview}>
                                        <Image
                                            source={{ uri: formData.image.uri }}
                                            style={styles.previewImage}
                                            resizeMode="cover"
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => setFormData({...formData, image: null})}
                                        >
                                            <Ionicons name="close-circle" size={24} color="#f72585" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Отмена</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.submitButton]}
                                    onPress={handleSubmit}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {editingNews ? 'Обновить' : 'Создать'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fb',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
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
    newsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 12,
        color: '#666',
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    newsImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 12,
    },
    newsContent: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 12,
    },
    newsFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    authorText: {
        fontSize: 13,
        color: '#777',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    editButton: {
        padding: 6,
    },
    deleteButton: {
        padding: 6,
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
    emptySubtext: {
        fontSize: 14,
        color: '#aaa',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    formGroup: {
        paddingHorizontal: 20,
        marginTop: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    categoryScroll: {
        flexDirection: 'row',
    },
    categoryOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    categoryOptionActive: {
        backgroundColor: '#4361ee',
        borderColor: '#4361ee',
    },
    categoryOptionText: {
        fontSize: 14,
        color: '#666',
    },
    categoryOptionTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    imageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 2,
        borderColor: '#4361ee',
        borderStyle: 'dashed',
        borderRadius: 8,
        gap: 12,
    },
    imageButtonText: {
        color: '#4361ee',
        fontWeight: '600',
    },
    imagePreview: {
        marginTop: 12,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    modalActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 24,
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    submitButton: {
        backgroundColor: '#4361ee',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});