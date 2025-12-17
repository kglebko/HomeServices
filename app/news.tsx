import React, { useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Pressable } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedCard } from '@/components/themed-card';
import { Ionicons } from '@expo/vector-icons';

const ALL_NEWS = [
    {
        id: 1,
        image: require('../assets/images/news1.png'),
        title: "Каждый подъезд дома был украшен к Новому году!",
        time: "Вчера 19:00",
        category: "Праздники",
        content: "Жители нашего дома совместными усилиями украсили все подъезды к Новому году. Были установлены гирлянды, новогодние елки и праздничные украшения. Особенно красиво выглядит главный вход с большими снежинками и световой инсталляцией.",
        author: "Совет дома",
        likes: 24,
        comments: 8
    },
    {
        id: 2,
        image: require('../assets/images/news2.png'),
        title: "Обновление системы оплаты",
        time: "2 дня назад",
        category: "Уведомление",
        content: "С 1 января вводится новая система онлайн-оплаты коммунальных услуг. Теперь вы можете оплачивать счета через мобильное приложение без комиссии. Для первых 100 оплат бонус - 5% кэшбэк.",
        author: "Управляющая компания",
        likes: 42,
        comments: 15
    },
    {
        id: 3,
        image: require('../assets/images/news3.png'),
        title: "Ремонт лифтов завершен",
        time: "5 дней назад",
        category: "Ремонт",
        content: "Завершен плановый ремонт лифтов в подъездах №2 и №5. Все лифты прошли техническое обслуживание и готовы к работе. Следующий плановый ремонт запланирован на июнь 2024 года.",
        author: "Техническая служба",
        likes: 18,
        comments: 3
    },
    {
        id: 4,
        image: require('../assets/images/news4.png'),
        title: "Встреча жильцов 15 декабря",
        time: "Неделю назад",
        category: "Собрание",
        content: "Приглашаем всех жильцов на ежегодное собрание 15 декабря в 19:00 в актовом зале. На повестке: утверждение бюджета на 2024 год, выборы председателя совета дома, обсуждение благоустройства территории.",
        author: "Совет дома",
        likes: 31,
        comments: 12
    },
    {
        id: 5,
        image: require('../assets/images/news5.png'),
        title: "Новогодний корпоратив для детей",
        time: "2 недели назад",
        category: "Мероприятия",
        content: "26 декабря в 16:00 приглашаем детей на новогодний утренник с Дедом Морозом и Снегурочкой. В программе: конкурсы, подарки, сладкий стол. Регистрация обязательна у управляющего.",
        author: "Культурный комитет",
        likes: 56,
        comments: 21
    },
    {
        id: 6,
        image: require('../assets/images/news6.png'),
        title: "Изменение графика вывоза мусора",
        time: "3 недели назад",
        category: "Уведомление",
        content: "С понедельника меняется график вывоза мусора. Теперь вывоз будет осуществляться по понедельникам, средам и пятницам с 8:00 до 12:00. Просим соблюдать новые правила.",
        author: "Управляющая компания",
        likes: 22,
        comments: 7
    }
];

export default function AllNewsScreen() {
    const navigation = useNavigation();

    // Устанавливаем заголовок при монтировании
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
                        source={require('../assets/images/back.png')}
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

    return (
        <ScreenContainer scrollable>
            {/* Список новостей */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {ALL_NEWS.map((news) => (
                    <TouchableOpacity
                        key={news.id}
                        onPress={() => router.push(`/news/${news.id}` as any)}
                        activeOpacity={0.8}
                        style={{ marginBottom: 20 }}
                    >
                        <ThemedCard style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Изображение */}
                            <Image
                                source={news.image}
                                style={{
                                    width: '100%',
                                    height: 180,
                                }}
                            />

                            {/* Контент */}
                            <View style={{ padding: 16 }}>
                                {/* Категория с вашим стилем */}
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
                                        {news.category} {/* Без toUpperCase() */}
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
                                        {news.time} • {news.author}
                                    </ThemedText>
                                </View>

                                {/* Лайки и комментарии на отдельной строке - выровнены по правому краю */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end', /* Выравнивание по правому краю */
                                    gap: 20,
                                    borderTopWidth: 1,
                                    borderTopColor: '#2A2A2A',
                                    paddingTop: 12,
                                    marginTop: 4,
                                }}>
                                    {/* Лайки */}
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
                                            {news.likes}
                                        </ThemedText>
                                    </View>

                                    {/* Комментарии */}
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
                                            {news.comments}
                                        </ThemedText>
                                    </View>
                                </View>
                            </View>
                        </ThemedCard>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ScreenContainer>
    );
}