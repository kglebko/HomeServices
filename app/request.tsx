import React, { useState, useEffect, useMemo } from 'react';
import { View, Image, Pressable, Platform } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';

import { WeekDaysSelector } from '@/components/request/WeekDaysSelector';
import { TimeSlotsSelector } from '@/components/request/TimeSlotsSelector';
import { CommentInputWithAttach } from '@/components/request/CommentInputWithAttach';
import { SystemAlert } from '@/components/SystemAlert';


const getWeekRangeText = () => {
    const today = new Date();
    const currentDay = today.getDay();

    const monday = new Date(today);
    const daysToMonday = currentDay === 0 ? 1 : (currentDay === 1 ? 0 : 1 - currentDay);
    monday.setDate(today.getDate() + daysToMonday);

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
    const { title, serviceId, price, startTime: paramStartTime, endTime: paramEndTime } = useLocalSearchParams<{
        title?: string,
        serviceId?: string,
        price?: string,
        startTime?: string,
        endTime?: string
    }>();

    const [day, setDay] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({
        day: false,
        time: false,
        comment: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const weekRangeText = useMemo(() => getWeekRangeText(), []);

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

            setAlertTitle('Не все поля заполнены');
            setAlertMessage(errorMessage);
            setShowAlert(true);
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Преобразуем день недели в дату
            type WeekDay = 'Пн' | 'Вт' | 'Ср' | 'Чт' | 'Пт';

            const convertDayToDate = (dayOfWeek: string) => {
                const daysMap: Record<WeekDay, number> = {
                    Пн: 1,
                    Вт: 2,
                    Ср: 3,
                    Чт: 4,
                    Пт: 5,
                };

                if (!dayOfWeek || !(dayOfWeek in daysMap)) {
                    throw new Error('Некорректный день недели');
                }

                const today = new Date();
                const currentDay = today.getDay();

                const targetDay = daysMap[dayOfWeek as WeekDay];

                let daysToAdd = 0;
                if (currentDay === 0) {
                    daysToAdd = targetDay;
                } else if (currentDay === targetDay) {
                    daysToAdd = 7;
                } else if (currentDay < targetDay) {
                    daysToAdd = targetDay - currentDay;
                } else {
                    daysToAdd = (7 - currentDay) + targetDay;
                }

                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + daysToAdd);
                return targetDate;
            };


            // Исправление №1: Функция для добавления ведущего нуля к времени
            const fixTimeFormat = (timeStr: string) => {
                if (!timeStr) return "00:00:00";

                // Убираем диапазон (если "10:00 – 12:00" → "10:00")
                let cleanTime = timeStr.split('–')[0]?.trim() || timeStr;

                // Разделяем часы и минуты
                const parts = cleanTime.split(':');
                if (parts.length < 2) return "00:00:00";

                // Добавляем ведущий ноль к часам если нужно
                let hours = parts[0];
                if (hours.length === 1) hours = '0' + hours; // "9" → "09"

                const minutes = parts[1] || '00';

                return `${hours}:${minutes}:00`; // Добавляем секунды
            };

            const selectedDate = convertDayToDate(day!);

            // Исправление №2: Используем функцию fixTimeFormat
            const selectedStartTime = fixTimeFormat(time!);

            // Рассчитываем время окончания (добавляем 2 часа)
            const startParts = selectedStartTime.split(':');
            const startHours = parseInt(startParts[0]);
            let endHours = startHours + 2;
            if (endHours >= 24) endHours -= 24;

            // Форматируем время окончания с ведущим нулём
            const selectedEndTime = endHours.toString().padStart(2, '0') + ':' + startParts[1] + ':00';

            // Данные для отправки
            const requestData = {
                serviceId: parseInt(serviceId || '2'),
                selectedDate: selectedDate.toISOString().split('T')[0],
                selectedStartTime: selectedStartTime, // Теперь "09:00:00" а не "9:00:00"
                selectedEndTime: selectedEndTime,
                comment: comment,
                userId: 1,
                estimatedPrice: parseFloat(price || '20.00')
            };

            console.log('Отправка данных:', requestData);

            const baseUrl = Platform.OS === 'android'
                ? 'http://10.0.2.2:8080'
                : 'http://192.168.31.18:8080';

            const response = await fetch(`${baseUrl}/api/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('Заявка создана:', result);

            router.push({
                pathname: '/request-success',
                params: { requestId: result.id.toString() }
            } as any);

        } catch (error: any) {
            console.error('Ошибка:', error);

            setAlertTitle('Ошибка создания заявки');
            setAlertMessage(error.message || 'Не удалось создать заявку');
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
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
                    {price ? `от ${price} руб.` : 'от 20 руб.'}
                </ThemedText>
            </View>

            {/* Кнопка */}
            <ThemedButton
                title={isSubmitting ? "Отправка..." : "Оформить заявку"}
                style={{
                    marginTop: 0,
                    marginBottom: 40
                }}
                onPress={handleSubmit}
                disabled={isSubmitting}
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