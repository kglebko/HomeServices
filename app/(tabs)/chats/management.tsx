import React from 'react';
import { View, Text } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';

export default function ManagementChatScreen() {
    return (
        <ScreenContainer>
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
                Чат с управляющей компанией
            </Text>
        </ScreenContainer>
    );
}