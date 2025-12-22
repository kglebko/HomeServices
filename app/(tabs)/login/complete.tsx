// screens/CompleteRegistrationScreen.tsx
import React, { useState, useRef } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
} from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Registration as styles } from "@/components/Registration";

export default function CompleteRegistrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Рефы для управления фокусом
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  // Данные жильца (из QR-кода или предыдущего экрана)
   const residentData = {
    fullName: 'Глебко Константин Романович',
    address: 'ул. Пономаренко 54-54',
    accountNumber: '2093350054',
    residentsCount: '4'
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

 // Валидация пароля
  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Пароль должен быть не менее из 6 символов";
    }
    if (!/\d/.test(password)) {
      return "Пароль должен содержать хотя бы одну цифру";
    }
    if (!/[a-zA-Z]/.test(password)) {
      return "Пароль должен содержать хотя бы одну букву";
    }
    return null;
  };
  
// Обновите существующую функцию валидации формы (не удаляйте её, она нужна для кнопки):
const validateForm = () => {
  if (!password.trim()) {
    return "Введите пароль";
  }
  
  const passwordError = validatePassword(password);
  if (passwordError) {
    return passwordError;
  }
  
  if (password !== confirmPassword) {
    return "Пароли не совпадают";
  }
  
  if (!agreeTerms) {
    return "Необходимо согласиться с условиями";
  }
  
  return null;
};
  // Завершение регистрации
    const handleCompleteRegistration = async () => {
    Keyboard.dismiss();
    
    const validationError = validateForm();
    if (validationError) {
        Alert.alert("Ошибка", validationError);
        return;
    }
    
    setIsLoading(true);
    
    try {
        // Здесь будет API-запрос для завершения регистрации
        console.log("Завершение регистрации:", {
        ...residentData,
        password,
        rememberMe,
        agreeTerms
        });
        
        // Имитация запроса
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Успешная регистрация
        Alert.alert(
        "Регистрация завершена!",
        "Ваш аккаунт успешно создан",
        [
            {
            text: "Войти в аккаунт",
            onPress: () => {
                // Здесь будет переход на главный экран или экран входа
             router.replace("/(tabs)");
                
            }
            }
        ]
        );
        
    } catch (error) {
        Alert.alert("Ошибка", "Не удалось завершить регистрацию. Попробуйте еще раз.");
    } finally {
        setIsLoading(false);
    }
    };

  // Переход к соглашению
  const openUserAgreement = () => {
    Alert.alert(
      "Пользовательское соглашение",
      "Здесь будет текст пользовательского соглашения.\n\nВ реальном приложении можно открыть веб-страницу или модальное окно с текстом.",
      [
        { text: "Закрыть", style: "cancel" },
        { 
          text: "Открыть полностью", 
          onPress: () => Linking.openURL('https://example.com/user-agreement') 
        }
      ]
    );
  };

  // Переход к правилам обработки данных
  const openPrivacyPolicy = () => {
    Alert.alert(
      "Правила обработки персональных данных",
      "Здесь будет текст политики конфиденциальности.\n\nВ реальном приложении можно открыть веб-страницу или модальное окно с текстом.",
      [
        { text: "Закрыть", style: "cancel" },
        { 
          text: "Открыть полностью", 
          onPress: () => Linking.openURL('https://example.com/privacy-policy') 
        }
      ]
    );
  };

  // Переключение видимости пароля
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Переключение видимости подтверждения пароля
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Фокус на следующее поле
  const focusConfirmPassword = () => {
    confirmPasswordInputRef.current?.focus();
  };

  return (
    <ScreenContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          
            <View style={styles.container}>
              {/* Заголовок */}
              <View style={styles.header}>
                <Text style={styles.title}>Регистрация</Text>
              </View>

              {/* Карточка с данными жильца */}
            <View style={styles.dataCard2}>
                {/* ФИО */}
                <View style={styles.dataRow}>
                <View style={styles.dataLabelContainer}>
                    <Ionicons name="person" size={16} color="#D64105" />
                    <Text style={styles.dataLabel}>ФИО:</Text>
                </View>
                <Text style={styles.dataValue}>{residentData.fullName}</Text>
                </View>

                {/* Адрес */}
                <View style={styles.dataRow}>
                <View style={styles.dataLabelContainer}>
                    <Ionicons name="home" size={16} color="#D64105" />
                    <Text style={styles.dataLabel}>Адрес:</Text>
                </View>
                <Text style={styles.dataValue}>{residentData.address}</Text>
                </View>

                {/* Лицевой счет */}
                <View style={styles.dataRow}>
                <View style={styles.dataLabelContainer}>
                    <Ionicons name="card" size={16} color="#D64105" />
                    <Text style={styles.dataLabel}>Лицевой счет:</Text>
                </View>
                <Text style={styles.dataValue}>{residentData.accountNumber}</Text>
                </View>

                {/* Кол-во проживающих */}
                <View style={styles.dataRow}>
                <View style={styles.dataLabelContainer}>
                    <Ionicons name="people" size={16} color="#D64105" />
                    <Text style={styles.dataLabel}>Кол-во проживающих:</Text>
                </View>
                <Text style={styles.dataValue}>{residentData.residentsCount}</Text>
                </View>
            </View>

              

                {/* Поля для пароля */}
            <View style={styles.passwordContainer}>
            {/* Пароль */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Пароль</Text>
                <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Введите пароль"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={focusConfirmPassword}
                    blurOnSubmit={false}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#666"
                    />
                </TouchableOpacity>
                </View>
                {password ? (
                <Text style={[
                    styles.passwordHint,
                    validatePassword(password) ? styles.passwordError : styles.passwordSuccess
                ]}>
                    {validatePassword(password) || "Пароль надежный"}
                </Text>
                ) : (
                <Text style={styles.hintText}>Минимум 6 символов</Text>
                )}
            </View>

            {/* Подтвердите пароль */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Подтвердите пароль</Text>
                <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Повторите пароль"
                    placeholderTextColor="#666"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleCompleteRegistration}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#666"
                    />
                </TouchableOpacity>
                </View>
                {confirmPassword && password ? (
                <Text style={[
                    styles.passwordHint,
                    password === confirmPassword ? styles.passwordSuccess : styles.passwordError
                ]}>
                    {password === confirmPassword ? "Пароли совпадают" : "Пароли не совпадают"}
                </Text>
                ) : null}
            </View>
            </View>

              {/* Опции */}
              <View style={styles.optionsContainer}>
                {/* Запомнить вход */}
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked
                  ]}>
                    {rememberMe && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.optionText}>Запомните вход</Text>
                </TouchableOpacity>

                {/* Согласие с условиями */}
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => setAgreeTerms(!agreeTerms)}
                >
                  <View style={[
                    styles.checkbox,
                    agreeTerms && styles.checkboxChecked
                  ]}>
                    {agreeTerms && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                  <View style={styles.termsContainer}>
                    <Text style={styles.optionText}>
                      Принимаю условия{' '}
                      <Text style={styles.link} onPress={openUserAgreement}>
                        Пользовательского соглашения
                      </Text>
                      {' '}и согласен(-с) с{' '}
                      <Text style={styles.link} onPress={openPrivacyPolicy}>
                        Правилами обработки персональных данных
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Кнопка завершения */}
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  (!password.trim() || !confirmPassword.trim() || !agreeTerms) && styles.completeButtonDisabled,
                  isLoading && styles.completeButtonLoading,
                ]}
                onPress={handleCompleteRegistration}
                disabled={!password.trim() || !confirmPassword.trim() || !agreeTerms || isLoading}
              >
                {isLoading ? (
                  <Text style={styles.completeButtonText}>Создание аккаунта...</Text>
                ) : (
                  <Text style={styles.completeButtonText}>Завершить</Text>
                )}
              </TouchableOpacity>

              {/* Информация */}
              <View style={styles.infoContainer}>
                <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
                <Text style={styles.infoText}>
                  Ваш пароль защищен шифрованием
                </Text>
              </View>

              {/* Кнопка назад */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={20} color="#D64105" />
                <Text style={styles.backButtonText}>Вернуться назад</Text>
              </TouchableOpacity>
            </View>
        
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
        </ScrollView>
    </ScreenContainer>
  );
}

