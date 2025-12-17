import React from 'react';
import { Image, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type NewsCardProps = {
    image: any;
    title: string;
    time: string;
    category?: string;
    onPress?: () => void;
} & TouchableOpacityProps;

export function NewsCard({
                             image,
                             title,
                             time,
                             category,
                             onPress,
                             ...touchableProps
                         }: NewsCardProps) {

    const cardContent = (
        <ThemedCard style={{ width: 260, marginRight: 16, padding: 0 }}>
            <Image
                source={image}
                style={{
                    width: '100%',
                    height: 155,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}
            />

            <ThemedView withBackground={false} style={{ padding: 12 }}>
                {/* Категория (если передана) */}
                {category && (
                    <ThemedView
                        withBackground={false}
                        style={{
                            backgroundColor: '#2A2A2A',
                            alignSelf: 'flex-start',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 10,
                            marginBottom: 8
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: 10,
                                color: '#8A8A8A',
                                fontFamily: 'Actay'
                            }}
                        >
                            {category}
                        </ThemedText>
                    </ThemedView>
                )}

                {/* Заголовок */}
                <ThemedText
                    style={{
                        fontFamily: 'Actay',
                        fontSize: 14,
                        color: '#DCDCDC',
                        lineHeight: 18
                    }}
                    numberOfLines={2}
                >
                    {title}
                </ThemedText>

                {/* Время */}
                <ThemedText
                    type="littleLabel"
                    style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: '#8A8A8A'
                    }}
                >
                    {time}
                </ThemedText>
            </ThemedView>
        </ThemedCard>
    );

    // Если есть обработчик нажатия, оборачиваем в TouchableOpacity
    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                {...touchableProps}
            >
                {cardContent}
            </TouchableOpacity>
        );
    }

    return cardContent;
}