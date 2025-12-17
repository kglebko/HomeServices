import React, { useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Pressable } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';
import { Ionicons } from '@expo/vector-icons';

// Все новости в одном объекте
const ALL_NEWS = [
    {
        id: 1,
        image: require('../../assets/images/news1.png'),
        title: "Каждый подъезд дома был украшен к Новому году!",
        time: "Вчера 19:00",
        category: "Праздники",
        content: "Жители нашего дома совместными усилиями украсили все подъезды к Новому году. Были установлены гирлянды, новогодние елки и праздничные украшения. Особенно красиво выглядит главный вход с большими снежинками и световой инсталляцией.\n\nАктивное участие в украшении приняли семьи из подъездов №3 и №7, которые подготовили handmade украшения. Вечером 31 декабря планируется общее празднование с фейерверком.",
        author: "Совет дома",
        likes: 24,
        comments: 8,
        fullContent: `Жители нашего жилого комплекса проявили невероятную активность и творческий подход при подготовке к Новому году. Благодаря совместным усилиям все 8 подъездов нашего дома превратились в настоящую зимнюю сказку.

Основные украшения:
• Главный вход: световая инсталляция "Снегопад"
• Подъезд №1: гирлянды с цветными огнями
• Подъезд №2: handmade снежинки от детей
• Подъезд №3: новогодняя елка с игрушками
• Подъезды №4-8: тематические украшения в стиле "Зимняя сказка"

Особую благодарность хотим выразить:
- Семье Петровых (подъезд №3) за организацию
- Детскому кружку "Творчество" за украшения
- Управляющей компании за техническую поддержку

31 декабря в 22:00 приглашаем всех на общее празднование у главного входа!`
    },
    {
        id: 2,
        image: require('../../assets/images/news2.png'),
        title: "Обновление системы оплаты",
        time: "2 дня назад",
        category: "Уведомление",
        content: "С 1 января вводится новая система онлайн-оплаты коммунальных услуг.",
        author: "Управляющая компания",
        likes: 42,
        comments: 15,
        fullContent: `Уважаемые жильцы!

С 1 января 2024 года в нашем жилом комплексе вводится полностью обновленная система онлайн-оплаты коммунальных услуг.

Основные изменения:
1. Новая мобильная платформа
   - Удобный интерфейс
   - Быстрая оплата в 2 клика
   - История всех платежей

2. Отсутствие комиссий
   - Оплата через Сбербанк - 0%
   - Оплата картой любого банка - 0%
   - Перевод с электронных кошельков - 0%

3. Бонусная программа
   - За каждую оплату начисляются бонусы
   - 5% кэшбэк первым 100 оплатившим
   - Накопительная система скидок

4. Новые функции
   - Автоплатежи по расписанию
   - Квитанции в электронном виде
   - Уведомления о новых счетах

Как подключиться:
1. Скачайте обновленное приложение
2. Пройдите простую регистрацию
3. Привяжите лицевой счет
4. Начните оплачивать без комиссий!

Техподдержка: 8-800-555-35-35 (круглосуточно)`
    },
    {
        id: 3,
        image: require('../../assets/images/news3.png'),
        title: "Ремонт лифтов завершен",
        time: "5 дней назад",
        category: "Ремонт",
        content: "Завершен плановый ремонт лифтов в подъездах №2 и №5.",
        author: "Техническая служба",
        likes: 18,
        comments: 3,
        fullContent: `Информация о завершении ремонта лифтов...`
    },
    {
        id: 4,
        image: require('../../assets/images/news4.png'),
        title: "Встреча жильцов 15 декабря",
        time: "Неделю назад",
        category: "Собрание",
        content: "Приглашаем всех жильцов на ежегодное собрание.",
        author: "Совет дома",
        likes: 31,
        comments: 12,
        fullContent: `Информация о собрании жильцов...`
    },
    {
        id: 5,
        image: require('../../assets/images/news5.png'),
        title: "Новогодний корпоратив для детей",
        time: "2 недели назад",
        category: "Мероприятия",
        content: "26 декабря в 16:00 приглашаем детей на новогодний утренник.",
        author: "Культурный комитет",
        likes: 56,
        comments: 21,
        fullContent: `Информация о новогоднем утреннике...`
    },
    {
        id: 6,
        image: require('../../assets/images/news6.png'),
        title: "Изменение графика вывоза мусора",
        time: "3 недели назад",
        category: "Уведомление",
        content: "С понедельника меняется график вывоза мусора.",
        author: "Управляющая компания",
        likes: 22,
        comments: 7,
        fullContent: `Информация об изменении графика вывоза мусора...`
    }
];

export default function NewsDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation();

    // Правильно парсим ID и находим новость
    const newsId = id ? parseInt(id) : 1;
    const news = ALL_NEWS.find(item => item.id === newsId) || ALL_NEWS[0];

    // Устанавливаем заголовок
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
                    onPress={() => {
                        // Логика поделиться
                    }}
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

    return (
        <ScreenContainer scrollable>
            {/* Изображение */}
            <Image
                source={news.image}
                style={{
                    width: '100%',
                    height: 240,
                    borderRadius: 12,
                    marginBottom: 20,
                }}
            />

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
                        {news.time}
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
                            {news.likes}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <Ionicons name="chatbubble-outline" size={24} color="#8A8A8A" />
                        <ThemedText style={{ fontSize: 12, color: '#8A8A8A', marginTop: 4 }}>
                            {news.comments}
                        </ThemedText>
                    </TouchableOpacity>
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
                onPress={() => {
                    // Логика поделиться
                }}
            />
        </ScreenContainer>
    );
}