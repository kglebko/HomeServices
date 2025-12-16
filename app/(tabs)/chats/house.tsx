import React from 'react';
import { View, Text } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';

export default function HouseChatScreen() {
    return (
        <ScreenContainer>
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
                Общий чат дома
            </Text>
        </ScreenContainer>
    );
}