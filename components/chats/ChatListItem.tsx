import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type ChatListItemProps = {
    image: any;
    title: string;
    message: string;
    time: string;
    unreadCount?: number;
    onPress: () => void;
};

export function ChatListItem({
                                 image,
                                 title,
                                 message,
                                 time,
                                 unreadCount = 0,
                                 onPress,
                             }: ChatListItemProps) {
    return (
        <>
            <TouchableOpacity onPress={onPress}>
                <ThemedView
                    withBackground={false}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 5,   // ⬅️ отступы по бокам
                        paddingVertical: 12,
                    }}
                >
                    {/* Иконка */}
                    <Image
                        source={image}
                        style={{
                            width: 65,
                            height: 65,
                            borderRadius: 32.5,
                            marginRight: 14,
                        }}
                    />

                    {/* Текстовая часть */}
                    <View style={{ flex: 1 }}>
                        <ThemedText
                            style={{
                                fontFamily: 'ActayWide-Bold',
                                fontSize: 16,
                            }}
                            numberOfLines={1}
                        >
                            {title}
                        </ThemedText>

                        <ThemedText
                            style={{
                                fontFamily: 'Actay',
                                fontSize: 12,
                                marginTop: 4,
                                opacity: 0.7,
                            }}
                            numberOfLines={1}
                        >
                            {message}
                        </ThemedText>
                    </View>

                    {/* Правая часть */}
                    <View style={{ alignItems: 'flex-end' }}>
                        <ThemedText
                            style={{
                                fontFamily: 'Actay',
                                fontSize: 14,
                                opacity: 0.6,
                            }}
                        >
                            {time}
                        </ThemedText>

                        {unreadCount > 0 && (
                            <View
                                style={{
                                    marginTop: 6,
                                    minWidth: 22,
                                    height: 22,
                                    borderRadius: 11,
                                    backgroundColor: '#D9D9D9',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingHorizontal: 6,
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontFamily: 'Actay',
                                        fontSize: 12,
                                        color: '#000',
                                    }}
                                >
                                    {unreadCount}
                                </ThemedText>
                            </View>
                        )}
                    </View>
                </ThemedView>
            </TouchableOpacity>

            {/* Разделитель */}
            <View
                style={{
                    height: 1,
                    backgroundColor: '#454545',
                    marginLeft: 20,
                }}
            />
        </>
    );
}
