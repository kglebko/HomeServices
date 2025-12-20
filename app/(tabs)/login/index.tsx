import { LoginAccount as loginStyles } from "@/components/LoginAccount";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const router = useRouter();
    const [contact, setContact] = useState("");
    const [password, setPassword] = useState("");
    const [isEmail, setIsEmail] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Рефы для управления фокусом
    const contactInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    // Скрытие клавиатуры при тапе в любое место
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    // Форматирование номера телефона
    const formatPhoneNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');

        if (cleaned.length === 0) return "";

        let digits = cleaned;
        if (digits.startsWith('375')) {
            digits = digits.substring(3);
        }

        if (digits.length === 0) return "+375 ";

        if (digits.length <= 2) {
            return `+375 (${digits}`;
        }

        if (digits.length <= 5) {
            return `+375 (${digits.substring(0, 2)}) ${digits.substring(2)}`;
        }

        if (digits.length <= 7) {
            return `+375 (${digits.substring(0, 2)}) ${digits.substring(2, 5)}-${digits.substring(5)}`;
        }

        if (digits.length <= 9) {
            return `+375 (${digits.substring(0, 2)}) ${digits.substring(2, 5)}-${digits.substring(5, 7)}-${digits.substring(7)}`;
        }

        return `+375 (${digits.substring(0, 2)}) ${digits.substring(2, 5)}-${digits.substring(5, 7)}-${digits.substring(7, 9)}`;
    };

    // Обработка ввода телефона/email
    const handleContactChange = (text: string) => {

        if (!isEmail && /^[\d\+]/.test(text)) {
            const formatted = formatPhoneNumber(text);
            setContact(formatted);
        } else {
            
            setContact(text);
        }
    };

    // Валидация формы
    const validateForm = () => {
        if (!contact.trim()) {
            return "Введите телефон или email";
        }

        if (!password.trim()) {
            return "Введите пароль";
        }

        if (password.length < 6) {
            return "Пароль должен быть не менее 6 символов";
        }

        return null;
    };

    // Вход в аккаунт
    const handleLogin = async () => {
        Keyboard.dismiss();

        const validationError = validateForm();
        if (validationError) {
            Alert.alert("Ошибка", validationError);
            return;
        }

        setIsLoading(true);

        try {
            // Проверяем, являются ли введенные данные админскими
            const normalizedContact = contact.toLowerCase().trim();

            // Проверка на админские учетные данные
            if ((normalizedContact === "admin@gmail.com" || normalizedContact === "admin") &&
                password === "123456") {

                console.log('🔐 Админ вход успешен');

                // Сохраняем админские данные (ТОЛЬКО ЛОКАЛЬНО, БЕЗ ЗАПРОСА НА СЕРВЕР)
                await AsyncStorage.setItem('adminToken', 'admin_token_123456');
                await AsyncStorage.setItem('adminData', JSON.stringify({
                    id: 1,
                    email: "admin@gmail.com",
                    username: "Администратор",
                    role: "admin"
                }));

                console.log('💾 Данные сохранены локально');

                // Очищаем поля
                setContact("");
                setPassword("");

                // Переход в админ-панель - ПРЯМОЙ ПЕРЕХОД
                console.log('🔄 Переход в /admin');

                // Небольшая задержка для стабильности
                setTimeout(() => {
                    router.replace("/admin-simple");
                }, 50);

            } else {
                // Здесь будет обычный вход пользователя
                console.log("👤 Обычный вход в аккаунт:", {
                    contact,
                    isEmail,
                    password,
                    rememberMe,
                });

                // Имитация запроса
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Сохраняем данные если выбрано "Запомнить вход"
                if (rememberMe) {
                    await AsyncStorage.setItem('userToken', 'user_token_' + Date.now());
                }

                // Успешный вход - переходим на главную
                Alert.alert("Успешно", "Вы вошли в аккаунт", [
                    {
                        text: "OK",
                        onPress: () => {
                            router.replace("/(tabs)");
                        },
                    },
                ]);
            }

        } catch (error) {
            console.error('❌ Ошибка входа:', error);
            Alert.alert("Ошибка", "Неверный логин или пароль");
        } finally {
            setIsLoading(false);
        }
    };

    // Переключение между телефоном и email
    const toggleInputType = () => {
        const newIsEmail = !isEmail;
        setIsEmail(newIsEmail);

        // Очищаем поле при смене типа
        setContact("");

        // Перефокусируемся на поле ввода
        setTimeout(() => {
            contactInputRef.current?.focus();
        }, 100);
    };

    // Фокус на следующее поле (пароль)
    const focusPassword = () => {
        passwordInputRef.current?.focus();
    };

    // Функция для автозаполнения админских данных (опционально)
    const fillAdminCredentials = () => {
        setContact("admin@gmail.com");
        setPassword("123456");
        setIsEmail(true);
    };

    return (
        <ScreenContainer>
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    {/* Заголовок */}
                    <TouchableWithoutFeedback onPress={dismissKeyboard}>
                        <View>
                            <Text style={loginStyles.title}>Войти {"\n"}в аккаунт</Text>

                            {/* Скрытая кнопка для автозаполнения админских данных (опционально) */}
                            <TouchableOpacity
                                style={{ position: 'absolute', right: 0, top: 0 }}
                                onPress={fillAdminCredentials}
                                onLongPress={fillAdminCredentials}
                            >
                                <Ionicons name="shield" size={20} color="transparent" />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>

                    {/* Поля ввода */}
                    <View style={loginStyles.inputsContainer}>
                        {/* Телефон / E-mail с переключателем */}
                        <View style={loginStyles.inputGroup}>
                            <View style={loginStyles.inputHeader}>
                                <Text style={loginStyles.inputLabel}>Телефон / E-mail</Text>

                                {/* Кнопка переключения типа */}
                                <TouchableOpacity
                                    style={loginStyles.toggleButton}
                                    onPress={toggleInputType}
                                >
                                    <Ionicons
                                        name={isEmail ? "phone-portrait" : "mail"}
                                        size={16}
                                        color="#D64105"
                                    />
                                    <Text style={loginStyles.toggleButtonText}>
                                        {isEmail ? "Телефон" : "Email"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={loginStyles.inputWrapper}>
                                <TextInput
                                    ref={contactInputRef}
                                    style={loginStyles.input}
                                    placeholder={isEmail ? "example@email.com" : "+375 (XX) XXX-XX-XX"}
                                    placeholderTextColor="#666"
                                    value={contact}
                                    onChangeText={handleContactChange}
                                    keyboardType={isEmail ? "email-address" : "phone-pad"}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete={isEmail ? "email" : "tel"}
                                    returnKeyType="next"
                                    onSubmitEditing={focusPassword}
                                    blurOnSubmit={false}
                                />

                                {/* Иконка типа ввода */}
                                <View style={loginStyles.inputIconContainer}>
                                    <Ionicons
                                        name={isEmail ? "mail" : "phone-portrait"}
                                        size={20}
                                        color="#D64105"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Пароль */}
                        <View style={loginStyles.inputGroup}>
                            <Text style={loginStyles.inputLabel}>Пароль</Text>
                            <View style={loginStyles.inputWrapper}>
                                <TextInput
                                    ref={passwordInputRef}
                                    style={loginStyles.input}
                                    placeholder="Введите пароль"
                                    placeholderTextColor="#666"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="done"
                                    onSubmitEditing={handleLogin}
                                />
                                <TouchableOpacity
                                    style={loginStyles.inputIconContainer}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off" : "eye"}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Опции */}
                        <View style={loginStyles.optionsContainer}>
                            {/* Запомнить вход */}
                            <TouchableOpacity
                                style={loginStyles.rememberContainer}
                                onPress={() => setRememberMe(!rememberMe)}
                            >
                                <View style={[
                                    loginStyles.checkbox,
                                    rememberMe && loginStyles.checkboxChecked
                                ]}>
                                    {rememberMe && (
                                        <Ionicons name="checkmark" size={14} color="#fff" />
                                    )}
                                </View>
                                <Text style={loginStyles.rememberText}>Запомнить вход</Text>
                            </TouchableOpacity>

                            {/* Забыли пароль */}
                            <TouchableOpacity onPress={() => router.push("/login/forgotPassword")}>
                                <Text style={loginStyles.forgotPasswordText}>Забыли пароль?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Кнопка входа */}
                    <TouchableOpacity
                        style={[
                            loginStyles.loginButton,
                            (!contact.trim() || !password.trim()) && loginStyles.loginButtonDisabled,
                            isLoading && loginStyles.loginButtonLoading,
                        ]}
                        onPress={handleLogin}
                        disabled={!contact.trim() || !password.trim() || isLoading}
                    >
                        {isLoading ? (
                            <Text style={loginStyles.loginButtonText}>Вход...</Text>
                        ) : (
                            <Text style={loginStyles.loginButtonText}>Войти</Text>
                        )}
                    </TouchableOpacity>

                    {/* Регистрация */}
                    <TouchableWithoutFeedback onPress={dismissKeyboard}>
                        <View style={loginStyles.registerContainer}>
                            <Text style={loginStyles.registerText}>Нет аккаунта?</Text>
                            <TouchableOpacity onPress={() => router.push("/login/scanQR")}>
                                <Text style={loginStyles.registerLink}>Регистрация</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>

                    {/* Информация */}
                    <TouchableWithoutFeedback onPress={dismissKeyboard}>
                        <View style={loginStyles.infoContainer}>
                            <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
                            <Text style={loginStyles.infoText}>
                                Ваши данные защищены
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ScreenContainer>
    );
}