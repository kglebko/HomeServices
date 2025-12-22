import React from 'react';
import { View, TextInput, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

type Props = {
    value: string;
    onChange: (text: string) => void;
};

// Функция для системного Alert
const showSystemAlert = (title: string, message: string, buttons?: any[]) => {
    setTimeout(() => {
        if (buttons) {
            Alert.alert(title, message, buttons);
        } else {
            Alert.alert(title, message);
        }
    }, 0);
};

export function CommentInputWithAttach({ value, onChange }: Props) {
    const openAttachMenu = () => {
        showSystemAlert(
            'Добавить вложение',
            'Выберите тип файла',
            [
                {
                    text: 'Сделать фото',
                    onPress: takePhoto
                },
                {
                    text: 'Из галереи',
                    onPress: pickImage
                },
                {
                    text: 'Файл',
                    onPress: pickDocument
                },
                {
                    text: 'Отмена',
                    style: 'cancel'
                },
            ]
        );
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            showSystemAlert('Ошибка', 'Необходимо разрешение на использование камеры');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const fileName = result.assets[0].fileName || 'фото.jpg';
            onChange(value + '\n[Фото добавлено: ' + fileName + ']');
            showSystemAlert('Успешно', 'Фото добавлено');
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showSystemAlert('Ошибка', 'Необходимо разрешение на доступ к галерее');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const fileName = result.assets[0].fileName || 'изображение.jpg';
            onChange(value + '\n[Изображение добавлено: ' + fileName + ']');
            showSystemAlert('Успешно', 'Изображение добавлено');
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
            });

            if (result.assets && result.assets.length > 0) {
                const fileName = result.assets[0].name || 'файл';
                onChange(value + '\n[Файл добавлен: ' + fileName + ']');
                showSystemAlert('Успешно', 'Файл добавлен');
            }
        } catch (error) {
            showSystemAlert('Ошибка', 'Не удалось выбрать файл');
        }
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
                    width: 44,
                    height: 44,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10,
                }}
            >
                <Image
                    source={require('../../assets/images/add.png')}
                    style={{
                        width: 22,
                        height: 26,
                        resizeMode: 'contain',
                    }}
                />
            </TouchableOpacity>

            {/* Поле ввода */}
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Опишите проблему..."
                placeholderTextColor="rgba(0,0,0,0.5)"
                multiline
                style={{
                    padding: 20,
                    paddingLeft: 40,
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