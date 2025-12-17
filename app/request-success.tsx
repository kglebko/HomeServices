import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { Pressable } from 'react-native';

export default function RequestSuccessScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleGoToRequests = () => {
        router.replace('/(tabs)/requests');
    };

    const handleGoHome = () => {
        router.replace('/(tabs)');
    };

    return (
        <ScreenContainer>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 24,
            }}>
                {/* Первый текст */}
                <ThemedText style={{
                    fontFamily: 'ActayWide-Bold',
                    fontSize: 24,
                    color: '#DCDCDC',
                    textAlign: 'center',
                    marginBottom: 32,
                }}>
                    Заявка создана!
                </ThemedText>

                {/* Иконка успеха */}
                <Image
                    source={require('../assets/images/success.png')}
                    style={{
                        width: 120,
                        height: 120,
                        marginBottom: 32,
                    }}
                />

                {/* Второй текст */}
                <ThemedText style={{
                    fontFamily: 'Actay',
                    fontSize: 16,
                    color: '#8A8A8A',
                    textAlign: 'center',
                    lineHeight: 24,
                    marginBottom: 40,
                }}>
                    {'Заявка будет обработана в течение 2 часов. Отслеживайте ее статус в разделе "Заявки"'}
                </ThemedText>

                {/* Кнопка просмотра заявок */}
                <ThemedButton
                    title="Перейти к заявкам"
                    style={{
                        width: '100%',
                        marginBottom: 16,
                        paddingVertical: 16,
                    }}
                    onPress={handleGoToRequests}
                />

                {/* Кнопка на главную */}
                <Pressable
                    onPress={handleGoHome}
                    style={({ pressed }) => ({
                        paddingVertical: 16,
                        width: '100%',
                        alignItems: 'center',
                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <ThemedText style={{
                        fontFamily: 'Actay',
                        fontSize: 16,
                        color: '#D64105',
                    }}>
                        На главную
                    </ThemedText>
                </Pressable>
            </View>
        </ScreenContainer>
    );
}