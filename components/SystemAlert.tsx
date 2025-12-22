// components/SystemAlert.tsx - Темный системный стиль
import React from 'react';
import { Modal, View, Text, TouchableOpacity, Platform } from 'react-native';

type SystemAlertProps = {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
};

export function SystemAlert({ visible, title, message, onClose }: SystemAlertProps) {
    const isIOS = Platform.OS === 'ios';

    if (!visible) return null;

    // Темные цвета для системного Alert
    const colors = {
        background: isIOS ? '#1C1C1E' : '#121212', // iOS 13+ Dark / Android Dark
        text: '#FFFFFF',
        secondaryText: '#8E8E93',
        separator: '#38383A',
        button: '#0A84FF', // iOS Blue
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.6)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
            }}>
                <View style={{
                    backgroundColor: colors.background,
                    borderRadius: isIOS ? 13 : 12,
                    width: 270,
                    overflow: 'hidden',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.3,
                            shadowRadius: 20,
                        },
                        android: {
                            elevation: 24,
                        },
                    }),
                }}>
                    {/* Заголовок */}
                    <View style={{
                        padding: isIOS ? 16 : 20,
                        paddingBottom: isIOS ? 12 : 16,
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: '600',
                            textAlign: 'center',
                            color: colors.text,
                            fontFamily: isIOS ? '-apple-system' : 'Roboto',
                        }}>
                            {title}
                        </Text>
                        {message ? (
                            <Text style={{
                                fontSize: 13,
                                textAlign: 'center',
                                color: colors.secondaryText,
                                marginTop: 6,
                                fontFamily: isIOS ? '-apple-system' : 'Roboto',
                            }}>
                                {message}
                            </Text>
                        ) : null}
                    </View>

                    {/* Разделитель */}
                    <View style={{
                        height: 1,
                        backgroundColor: colors.separator,
                    }} />

                    {/* Кнопка */}
                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            padding: isIOS ? 16 : 18,
                            alignItems: 'center',
                        }}
                        activeOpacity={0.6}
                    >
                        <Text style={{
                            fontSize: 17,
                            fontWeight: '600',
                            color: colors.button,
                            fontFamily: isIOS ? '-apple-system' : 'Roboto',
                        }}>
                            OK
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}