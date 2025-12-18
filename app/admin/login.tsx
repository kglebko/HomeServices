import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Вариант 1: Относительный путь (должен работать)
import { apiClient } from '@lib/api/client';

// Вариант 2: Или используйте require
// const { apiClient } = require('../../lib/api/client');

// Вариант 3: Или напишите inline клиент
const BASE_URL = 'http://25.21.56.83:5001';

interface LoginCredentials {
    username: string;
    password: string;
}

export default function AdminLoginScreen() {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!credentials.username.trim() || !credentials.password.trim()) {
            Alert.alert('Ошибка', 'Введите логин и пароль');
            return;
        }

        setLoading(true);

        try {
            // Вариант 1: Используем apiClient
            const response = await apiClient.post<{ token: string; admin: any }>(
                '/api/auth/login',
                credentials,
                false
            );

            // Вариант 2: Или напрямую делаем запрос
            /*
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            */

            if (response.success && response.data?.token) {
                await AsyncStorage.setItem('adminToken', response.data.token);
                await AsyncStorage.setItem('adminData', JSON.stringify(response.data.admin));

                // Используем as any для обхода проверки типов
                router.replace('/(admin)' as any);

                Alert.alert('Успешно', 'Вход выполнен');
            } else {
                Alert.alert('Ошибка', response.error || 'Неверные учетные данные');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>
                    <Ionicons name="shield-checkmark" size={80} color="#4361ee" />
                    <Text style={styles.logoText}>Админ-панель</Text>
                    <Text style={styles.subtitle}>Home Services</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Вход в админ-панель</Text>

                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Логин"
                            value={credentials.username}
                            onChangeText={(text) => setCredentials({...credentials, username: text})}
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Пароль"
                            value={credentials.password}
                            onChangeText={(text) => setCredentials({...credentials, password: text})}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            editable={!loading}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                            disabled={loading}
                        >
                            <Ionicons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="log-in-outline" size={20} color="#fff" />
                                <Text style={styles.loginButtonText}>Войти</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        disabled={loading}
                    >
                        <Ionicons name="arrow-back" size={20} color="#4361ee" />
                        <Text style={styles.backButtonText}>Вернуться в приложение</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4361ee',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 25,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    eyeIcon: {
        padding: 5,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4361ee',
        borderRadius: 10,
        height: 50,
        marginTop: 10,
        gap: 10,
    },
    disabledButton: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 10,
        padding: 12,
    },
    backButtonText: {
        color: '#4361ee',
        fontSize: 16,
    },
});