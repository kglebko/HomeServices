import React, { useState, useEffect, useMemo } from 'react';
import { View, Image, Pressable } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';

import { WeekDaysSelector } from '@/components/request/WeekDaysSelector';
import { TimeSlotsSelector } from '@/components/request/TimeSlotsSelector';
import { CommentInputWithAttach } from '@/components/request/CommentInputWithAttach';
import { SystemAlert } from '@/components/SystemAlert';

// Функция для получения текста диапазона недели
const getWeekRangeText = () => {
    const today = new Date();
    const currentDay = today.getDay();

    // Находим понедельник текущей недели
    const monday = new Date(today);
    const daysToMonday = currentDay === 0 ? 1 : (currentDay === 1 ? 0 : 1 - currentDay);
    monday.setDate(today.getDate() + daysToMonday);

    // Находим пятницу текущей недели (только рабочие дни)
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}.${month}`;
    };

    return `${formatDate(monday)} - ${formatDate(friday)}`;
};

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

    // Состояние для алерта
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    // Получаем текст диапазона недели
    const weekRangeText = useMemo(() => getWeekRangeText(), []);

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
            let errorMessage = 'Для продолжения заполните:\n\n';
            if (newErrors.day) errorMessage += '•  День недели\n';
            if (newErrors.time) errorMessage += '•  Время\n';
            if (newErrors.comment) errorMessage += '•  Комментарий\n';
            errorMessage += '\nПосле заполнения нажмите "Оформить заявку" еще раз';

            // Показываем наш кастомный алерт
            setAlertTitle('Не все поля заполнены');
            setAlertMessage(errorMessage);
            setShowAlert(true);
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Здесь можно добавить логику отправки данных
            console.log('Отправка данных:', { day, time, comment });

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
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <ThemedText type="default" style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#DCDCDC'
                    }}>
                        День недели
                    </ThemedText>

                    {/* Диапазон дат текущей недели */}
                    <ThemedText type="default" style={{
                        fontSize: 12,
                        color: '#8E8E93',
                        fontFamily: 'System'
                    }}>
                        {weekRangeText}
                    </ThemedText>
                </View>
                <WeekDaysSelector value={day} onChange={setDay} />

                {/* Сообщение об ошибке (если есть) */}
                {errors.day && (
                    <ThemedText style={{
                        color: '#FF3B30',
                        fontSize: 12,
                        marginTop: 8,
                        marginLeft: 4
                    }}>
                        Пожалуйста, выберите день недели
                    </ThemedText>
                )}
            </View>

            {/* Время */}
            <View style={{ marginBottom: 24 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <ThemedText type="default" style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#DCDCDC'
                    }}>
                        Время
                    </ThemedText>
                </View>
                <TimeSlotsSelector value={time} onChange={setTime} />

                {/* Сообщение об ошибке (если есть) */}
                {errors.time && (
                    <ThemedText style={{
                        color: '#FF3B30',
                        fontSize: 12,
                        marginTop: 8,
                        marginLeft: 4
                    }}>
                        Пожалуйста, выберите время
                    </ThemedText>
                )}
            </View>

            {/* Комментарий */}
            <View style={{ marginBottom: 24 }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <ThemedText type="default" style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#DCDCDC'
                    }}>
                        Комментарий
                    </ThemedText>
                </View>
                <CommentInputWithAttach value={comment} onChange={setComment} />

                {/* Сообщение об ошибке (если есть) */}
                {errors.comment && (
                    <ThemedText style={{
                        color: '#FF3B30',
                        fontSize: 12,
                        marginTop: 8,
                        marginLeft: 4
                    }}>
                        Пожалуйста, добавьте комментарий
                    </ThemedText>
                )}
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

            {/* Наш системный алерт */}
            <SystemAlert
                visible={showAlert}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setShowAlert(false)}
            />
        </ScreenContainer>
    );
}