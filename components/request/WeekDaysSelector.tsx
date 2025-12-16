import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

type Props = {
    value: string | null;
    onChange: (day: string) => void;
};

export function WeekDaysSelector({ value, onChange }: Props) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            {DAYS.map((day) => {
                const active = value === day;

                return (
                    <TouchableOpacity key={day} onPress={() => onChange(day)}>
                        <ThemedView
                            style={{
                                width: 65,
                                height: 40,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: active ? '#E65100' : '#2B2B2B',
                            }}
                        >
                            <ThemedText style={{ color: '#ffffff', fontWeight: active ? 'bold' : 'normal' }}>
                                {day}
                            </ThemedText>
                        </ThemedView>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
