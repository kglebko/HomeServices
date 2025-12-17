import React, { useState, useEffect } from 'react';
import { View, Image, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';

import { WeekDaysSelector } from '@/components/request/WeekDaysSelector';
import { TimeSlotsSelector } from '@/components/request/TimeSlotsSelector';
import { CommentInputWithAttach } from '@/components/request/CommentInputWithAttach';

export default function ServiceRequestScreen() {
    const navigation = useNavigation();
    const { title } = useLocalSearchParams<{ title?: string }>();

    const [day, setDay] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({
        day: false,
        time: false,
        comment: false
    });

    // Устанавливаем заголовок при монтировании
    useEffect(() => {
        navigation.setOptions({
            title: 'Оформление заявки',
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

    const validateForm = () => {
        const newErrors = {
            day: !day,
            time: !time,
            comment: comment.trim().length === 0
        };

        setErrors(newErrors);

        if (newErrors.day || newErrors.time || newErrors.comment) {
            let errorMessage = 'Пожалуйста, заполните:\n';
            if (newErrors.day) errorMessage += '• День недели\n';
            if (newErrors.time) errorMessage += '• Время\n';
            if (newErrors.comment) errorMessage += '• Комментарий';

            Alert.alert('Не все поля заполнены', errorMessage);
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Переход на экран подтверждения
            router.push('/request-success' as any);
        }
    };

    return (
        <ScreenContainer scrollable>
            {/* Заголовок услуги с иконкой */}
            <ThemedView withBackground={false} style={{
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
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
                    fontFamily: 'ActayWide-Bold',
                    fontSize: 20,
                    textAlign: 'center',
                    color: '#DCDCDC'
                }}>
                    {title || 'Услуга'}
                </ThemedText>
            </ThemedView>

            {/* День недели */}
            <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <ThemedText type="default" style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#DCDCDC'
                    }}>
                        День недели
                    </ThemedText>
                    {errors.day && (
                        <ThemedText style={{
                            fontSize: 12,
                            color: '#FF5252',
                        }}>
                            Обязательное поле
                        </ThemedText>
                    )}
                </View>
                <WeekDaysSelector value={day} onChange={setDay} />
            </View>

            {/* Время */}
            <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <ThemedText type="default" style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#DCDCDC'
                    }}>
                        Время
                    </ThemedText>
                    {errors.time && (
                        <ThemedText style={{
                            fontSize: 12,
                            color: '#FF5252',
                        }}>
                            Обязательное поле
                        </ThemedText>
                    )}
                </View>
                <TimeSlotsSelector value={time} onChange={setTime} />
            </View>

            {/* Комментарий */}
            <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <ThemedText type="default" style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#DCDCDC'
                    }}>
                        Комментарий
                    </ThemedText>
                    {errors.comment && (
                        <ThemedText style={{
                            fontSize: 12,
                            color: '#FF5252',
                        }}>
                            Обязательное поле
                        </ThemedText>
                    )}
                </View>
                <CommentInputWithAttach value={comment} onChange={setComment} />
            </View>

            {/* Блок стоимости */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                paddingHorizontal: 8,
            }}>
                <ThemedText style={{
                    fontFamily: 'ActayWide-Bold',
                    fontSize: 15,
                    color: '#DCDCDC',
                }}>
                    Стоимость
                </ThemedText>

                <ThemedText style={{
                    fontFamily: 'ActayWide-Bold',
                    fontSize: 15,
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
                onPress={handleSubmit}
            />
        </ScreenContainer>
    );
}