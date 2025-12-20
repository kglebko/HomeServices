// components/news/NewsCard.tsx
import React from 'react';
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { ThemedCard } from '@/components/themed-card';
import { ThemedText } from '@/components/themed-text';

type NewsCardProps = {
    imageUri: string; // Изменили на URI
    title: string;
    time: string;
    category?: string;
    onPress?: () => void;
} & TouchableOpacityProps;

export function NewsCard({
                             imageUri,
                             title,
                             time,
                             category,
                             onPress,
                             ...touchableProps
                         }: NewsCardProps) {

    const cardContent = (
        <ThemedCard style={{
            width: 260,
            marginRight: 16,
            padding: 0,
            height: 250,
        }}>
            <Image
                source={{ uri: imageUri }} // Используем uri
                style={{
                    width: '100%',
                    height: 140,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}
                resizeMode="cover"
            />

            <View style={{
                padding: 12,
                paddingTop: 8,
                flex: 1,
            }}>
                {/* Категория */}
                {category && (
                    <View
                        style={{
                            backgroundColor: '#333333',
                            alignSelf: 'flex-start',
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 16,
                            marginBottom: 8,
                            borderWidth: 1,
                            borderColor: '#2A2A2A',
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: 11,
                                color: '#8A8A8A',
                                fontFamily: 'Actay',
                                fontWeight: '500',
                            }}
                        >
                            {category}
                        </ThemedText>
                    </View>
                )}

                {/* Заголовок */}
                <ThemedText
                    style={{
                        fontFamily: 'Actay',
                        fontSize: 14,
                        color: '#DCDCDC',
                        lineHeight: 18,
                        flex: 1,
                    }}
                    numberOfLines={category ? 2 : 3}
                    ellipsizeMode="tail"
                >
                    {title}
                </ThemedText>

                {/* Время */}
                <ThemedText
                    type="littleLabel"
                    style={{
                        fontSize: 12,
                        color: '#8A8A8A',
                        marginTop: 6,
                        fontFamily: 'Actay',
                    }}
                >
                    {time}
                </ThemedText>
            </View>
        </ThemedCard>
    );

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