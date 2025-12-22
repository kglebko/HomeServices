import React, { useEffect } from 'react';
import { View, ScrollView, Image, Pressable } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ServiceTile } from '@/components/services/ServiceTile';

const ALL_SERVICES = [
    {
        id: 1,
        icon: require('../../assets/icons/santehnik.png'),
        title: "Сантехник",
        time: "10:00–19:00",
        price: "от 20 руб.",
        serviceType: 'santehnik'
    },
    {
        id: 2,
        icon: require('../../assets/icons/electric.png'),
        title: "Электрик",
        time: "10:00–20:00",
        price: "от 20 руб.",
        serviceType: 'electric'
    },
    {
        id: 3,
        icon: require('../../assets/icons/slesar.png'),
        title: "Слесарь",
        time: "10:00–20:00",
        price: "от 30 руб.",
        serviceType: 'slesar'
    },
    {
        id: 4,
        icon: require('../../assets/icons/cleaning.png'),
        title: "Клининг",
        time: "10:00–20:00",
        price: "от 50 руб.",
        serviceType: 'cleaning'
    },
    {
        id: 5,
        icon: require('../../assets/icons/gruzchik.png'),
        title: "Грузчик",
        time: "10:00–19:00",
        price: "от 40 руб.",
        serviceType: 'gruzchik'
    },
    {
        id: 6,
        icon: require('../../assets/icons/master.png'),
        title: "Мастер",
        price: "от 100 руб.",
        serviceType: 'master'
    },
];

export default function ServicesScreen() {
    const navigation = useNavigation();

    // Устанавливаем заголовок при монтировании
    useEffect(() => {
        navigation.setOptions({
            title: 'Услуги',
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
            headerBackVisible: false,
        });
    }, [navigation]);

    const handleServicePress = (service: typeof ALL_SERVICES[0]) => {
        router.push({
            pathname: '../request',
            params: {
                title: service.title,
                icon: service.serviceType,
            },
        } as any);
    };

    return (
        <ScreenContainer scrollable>
            <ThemedView withBackground={false} style={{ paddingTop: 16 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ThemedView
                        withBackground={false}
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        {ALL_SERVICES.map((service) => (
                            <ServiceTile
                                key={service.id}
                                icon={service.icon}
                                title={service.title}
                                time={service.time}
                                price={service.price}
                                onPress={() => handleServicePress(service)}
                                style={{ marginBottom: 16 }}
                            />
                        ))}
                    </ThemedView>
                </ScrollView>
            </ThemedView>
        </ScreenContainer>
    );
}