import React from 'react';
import { View, Text } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';

export default function LifeChatScreen() {
    return (
        <ScreenContainer>
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
                Чат "Жизнь ЖК"
            </Text>
        </ScreenContainer>
    );
}