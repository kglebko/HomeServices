import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';
import { ThemedCard } from '@/components/themed-card';

import { WeekDaysSelector } from '@/components/request/WeekDaysSelector';
import { TimeSlotsSelector } from '@/components/request/TimeSlotsSelector';
import { CommentInputWithAttach } from '@/components/request/CommentInputWithAttach';

export default function ServiceRequestScreen() {
    const navigation = useNavigation();
    const { title } = useLocalSearchParams<{ title?: string }>();

    const [day, setDay] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [comment, setComment] = useState('');

    // Устанавливаем заголовок при монтировании
    useEffect(() => {
        navigation.setOptions({
            title: 'Оформление заявки',
            headerStyle: { backgroundColor: '#1E1E1E' },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontFamily: 'Actay-Bold',
                fontSize: 16,
            },
            headerTitleAlign: 'center',
            headerLeft: () => null,
            headerBackVisible: false,
        });
    }, [navigation]);

    return (
        <ScreenContainer scrollable>
            {/* Заголовок услуги с иконкой - ЦЕНТРИРОВАННЫЙ */}
            <ThemedView withBackground={false} style={{
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center' // Центрируем
            }}>
                <Image
                    source={require('../assets/icons/electric.png')}
                    style={{
                        width: 24,
                        height: 24,
                        marginRight: 8
                    }}
                />
                <ThemedText style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center' // Центрируем текст
                }}>
                    {title || 'Услуга'}
                </ThemedText>
            </ThemedView>

            {/* День недели - БЕЗ ThemedCard, только заголовок */}
            <View style={{ marginBottom: 24 }}>
                <ThemedText type="default" style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    День недели
                </ThemedText>
                <WeekDaysSelector value={day} onChange={setDay} />
            </View>

            {/* Время - БЕЗ ThemedCard, только заголовок */}
            <View style={{ marginBottom: 24 }}>
                <ThemedText type="default" style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    Время
                </ThemedText>
                <TimeSlotsSelector value={time} onChange={setTime} />
            </View>

            {/* Комментарий */}
            <View style={{ marginBottom: 24 }}>
                <ThemedText type="default" style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    Комментарий
                </ThemedText>
                <CommentInputWithAttach value={comment} onChange={setComment} />
            </View>

            {/* БЛОК СТОИМОСТИ - добавлено */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
                paddingHorizontal: 8,
            }}>
                <ThemedText type="default" style={{
                    fontSize: 16,
                    color: '#DCDCDC',

                }}>
                    Стоимость
                </ThemedText>

                <ThemedText style={{
                    fontFamily: 'ActayWide-Bold',
                    fontSize: 16,
                    color: '#DCDCDC',
                }}>
                    от 20 руб.
                </ThemedText>
            </View>

            {/* Кнопка */}
            <ThemedButton
                title="Оформить заявку"
                style={{
                    marginTop: 0,
                    marginBottom: 40
                }}
                onPress={() => router.back()}
            />
        </ScreenContainer>
    );
}