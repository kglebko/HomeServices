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
            const convertDayToDate = (dayOfWeek: string) => {
                const daysMap: Record<string, number> = {
                    'Пн': 1, 'Вт': 2, 'Ср': 3, 'Чт': 4, 'Пт': 5
                };

                const today = new Date();
                const currentDay = today.getDay();
                let targetDay = daysMap[dayOfWeek] || 1;

                // Находим ближайший день
                let daysToAdd = 0;
                if (currentDay === 0) {
                    daysToAdd = targetDay;
                } else if (currentDay <= targetDay) {
                    daysToAdd = targetDay - currentDay;
                } else {
                    daysToAdd = 7 - currentDay + targetDay;
                }

                if (daysToAdd === 0) daysToAdd = 7;

                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + daysToAdd);
                return targetDate;
            };

            // Извлекаем только время начала из выбранного значения
            // Если time содержит диапазон (например "10:00 – 12:00"), берем первую часть
            const extractStartTime = (timeValue: string) => {
                if (timeValue.includes('–')) {
                    return timeValue.split('–')[0].trim();
                } else if (timeValue.includes('-')) {
                    return timeValue.split('-')[0].trim();
                }
                return timeValue;
            };

            // Получаем время окончания:
            // 1. Из параметров endTime, если передано
            // 2. Из выбранного времени, если это диапазон
            // 3. Добавляем 2 часа к начальному времени
            const getEndTime = (startTime: string) => {
                // Если передано время окончания из параметров
                if (paramEndTime) {
                    return paramEndTime;
                }

                // Если выбранный time содержит диапазон
                if (time && time.includes('–')) {
                    const parts = time.split('–');
                    return parts[1]?.trim() || '12:00';
                } else if (time && time.includes('-')) {
                    const parts = time.split('-');
                    return parts[1]?.trim() || '12:00';
                }

                // По умолчанию добавляем 2 часа к начальному времени
                const [hours, minutes] = startTime.split(':').map(Number);
                let endHours = hours + 2;
                if (endHours >= 24) endHours -= 24;
                return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            };

            const selectedDate = convertDayToDate(day!);
            const startTimeValue = extractStartTime(time!);
            const endTimeValue = getEndTime(startTimeValue);

            // Данные для отправки
            const requestData = {
                serviceId: parseInt(serviceId || '2'),
                selectedDate: selectedDate.toISOString().split('T')[0],
                selectedStartTime: startTimeValue + ':00',
                selectedEndTime: endTimeValue + ':00',
                comment: comment,
                userId: 1,
                estimatedPrice: parseFloat(price || '20.00')
            };

            console.log('Отправка данных:', requestData);

            // URL бэкенда
            const baseUrl = Platform.OS === 'android'
                ? 'http://10.0.2.2:8080'
                : 'http://192.168.31.18:8080'; // Ваш IP

            // Отправляем запрос
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

            // Переход на экран успеха
            router.push({
                pathname: '/request-success',
                params: { requestId: result.id.toString() }
            } as any);

        } catch (error: any) {
            console.error('Ошибка:', error);

            let errorMessage = 'Не удалось создать заявку. ';
            if (error.message.includes('Network request failed')) {
                errorMessage += 'Проблема с сетью. Проверьте:\n1. Запущен ли бэкенд\n2. IP адрес сервера';
            } else {
                errorMessage += error.message;
            }

            setAlertTitle('Ошибка создания заявки');
            setAlertMessage(errorMessage);
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