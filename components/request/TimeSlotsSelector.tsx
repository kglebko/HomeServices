import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const TIMES = ['9:00 – 12:00', '13:00 – 15:00', '17:00 – 19:00', '19:00 – 21:00'];

type Props = {
    value: string | null;
    onChange: (time: string) => void;
};

export function TimeSlotsSelector({ value, onChange }: Props) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {TIMES.map((time) => {
                const active = value === time;

                return (
                    <TouchableOpacity key={time} onPress={() => onChange(time)} style={{ marginRight: 8 }}>
                        <ThemedView
                            style={{
                                width: 110,
                                height: 40,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: active ? '#E65100' : '#2B2B2B',
                            }}
                        >
                            <ThemedText style={{ color: '#ffffff', fontSize: 16, fontWeight: active ? 'bold' : 'normal' }}>
                                {time}
                            </ThemedText>
                        </ThemedView>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}
