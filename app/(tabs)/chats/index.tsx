// app/(tabs)/chats/index.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ChatListItem } from '@/components/chats/ChatListItem';
import { router } from 'expo-router';

export default function ChatsScreen() {
    return (
        <ScreenContainer>
            {/* Поиск */}
            <View
                style={{
                    marginHorizontal: 20,
                    marginTop: 12,
                    marginBottom: 8,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: '#2A2A2A',
                    paddingHorizontal: 12,
                    justifyContent: 'center',
                }}
            >
                <TextInput
                    placeholder="Поиск"
                    placeholderTextColor="#8A8A8A"
                    style={{
                        fontFamily: 'Actay',
                        fontSize: 14,
                        color: '#fff',
                    }}
                />
            </View>

            <TouchableOpacity
                onPress={() => router.push('/chats/management' as never)}
            >
                <ChatListItem
                    image={require('../../../assets/images/uk.png')}
                    title="Управляющая компания"
                    message="Здравствуйте! Ваша заявка закрыта"
                    time="15:00"
                    unreadCount={2}
                    onPress={() => {}} // Пустая функция, так как обработчик на TouchableOpacity
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('/chats/life' as never)}
            >
                <ChatListItem
                    image={require('../../../assets/images/life.png')}
                    title="Жизнь ЖК"
                    message="Подъезды украшены жителями"
                    time="15:00"
                    onPress={() => {}} // Пустая функция
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('/chats/house' as never)}
            >
                <ChatListItem
                    image={require('../../../assets/images/chat.png')}
                    title="Чат ЖК"
                    message="Вы видели вчерашние новости?"
                    time="ВТ"
                    unreadCount={5}
                    onPress={() => {}} // Пустая функция
                />
            </TouchableOpacity>
        </ScreenContainer>
    );
}