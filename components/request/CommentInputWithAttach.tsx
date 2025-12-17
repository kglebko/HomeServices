import React from 'react';
import { View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';

type Props = {
    value: string;
    onChange: (text: string) => void;
};

export function CommentInputWithAttach({ value, onChange }: Props) {
    const openAttachMenu = () => {
        Alert.alert('Добавить', '', [
            { text: 'Фото' },
            { text: 'Галерея' },
            { text: 'Файл' },
            { text: 'Отмена', style: 'cancel' },
        ]);
    };

    return (
        <View style={{
            backgroundColor: '#DCDCDC',
            borderRadius: 12,
            position: 'relative',
            minHeight: 120,
        }}>
            {/* СКРЕПКА в ЛЕВОМ нижнем углу - УВЕЛИЧЕННАЯ */}
            <TouchableOpacity
                onPress={openAttachMenu}
                activeOpacity={0.7}
                style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: 44, // Увеличенная область нажатия
                    height: 44,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10, // Поверх других элементов
                }}
            >
                <Image
                    source={require('../../assets/images/add.png')}
                    style={{
                        width: 22, // Увеличенный размер иконки
                        height: 26,
                        resizeMode: 'contain',
                    }}
                />
            </TouchableOpacity>

            {/* Поле ввода с отступом слева для скрепки */}
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Опишите проблему..."
                placeholderTextColor="rgba(0,0,0,0.5)"
                multiline
                style={{
                    padding: 20,
                    paddingLeft: 40, // Большой отступ слева для скрепки
                    paddingRight: 12,
                    textAlignVertical: 'top',
                    color: '#000',
                    minHeight: 100,
                    fontSize: 16,
                    fontFamily: 'Actay',
                }}
            />
        </View>
    );
}
