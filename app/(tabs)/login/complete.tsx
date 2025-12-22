// screens/CompleteRegistrationScreen.tsx
import React, { useEffect, useRef, useState } from 'react';

import { Registration as styles } from "@/components/Registration";
import { ScreenContainer } from '@/components/ScreenContainer';
import { apiService } from "@/services/api";
import { storage } from "@/services/storage";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

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
  const [contact, setContact] = useState<string>("");
  
  // Рефы для управления фокусом
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  // Данные из QR-кода (в реальном приложении будут приходить с предыдущего экрана)
  const residentData = {
    first_name: 'Константин',
    last_name: 'Глебко',
    patronymic: 'Романович',
    address: 'ул. Пономаренко 54-54',
    accountNumber: '2093350054',
    residents_count: 4
  };

  // Загружаем контакт при монтировании компонента
  useEffect(() => {
    const loadContact = async () => {
      const savedContact = await storage.getRegistrationContact();
      if (savedContact) {
        setContact(savedContact);
      } else {
        Alert.alert("Ошибка", "Контакт не найден. Пожалуйста, начните регистрацию заново.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      }
    };
    loadContact();
  }, []);

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
    
    if (!contact) {
        Alert.alert("Ошибка", "Контакт не найден. Пожалуйста, начните регистрацию заново.");
        return;
    }
    
    setIsLoading(true);
    
    try {
        // Выполняем регистрацию через API
        const response = await apiService.register({
            contact,
            password,
            firstName: residentData.first_name,
            lastName: residentData.last_name,
            patronymic: residentData.patronymic,
            address: residentData.address,
            accountNumber: residentData.accountNumber,
            residentsCount: residentData.residents_count,
            role: 'user' // Устанавливаем роль по умолчанию для новых пользователей
        });
        
        if (response.success && response.data) {
            // Сохраняем токен и данные пользователя
            await storage.saveToken(response.data.token);
            await storage.saveUser(response.data.user);
            await storage.clearRegistrationContact();
            
            // Сначала переходим на главную
            router.replace("/(tabs)");
            
            // Затем показываем уведомление (после небольшой задержки)
            setTimeout(() => {
                Alert.alert(
                    "Регистрация завершена!",
                    "Ваш аккаунт успешно создан"
                );
            }, 500);
        } else {
            Alert.alert("Ошибка", "Не удалось завершить регистрацию. Попробуйте еще раз.");
        }
        
    } catch (error: any) {
        Alert.alert("Ошибка", error.message || "Не удалось завершить регистрацию. Попробуйте еще раз.");
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
              {/* Заголовок */}
              <View style={styles.header}>
                <Text style={styles.title}>Регистрация</Text>
              </View>

              {/* Карточка с данными жильца */}
            <View style={styles.dataCard2}>
                {/* Имя - отдельное поле */}
                <View style={styles.nameField}>
                  <View style={styles.nameFieldRow}>
                    <View style={styles.dataLabelContainer}>
                      <Ionicons name="person" size={16} color="#D64105" />
                      <Text style={styles.dataLabel}>Имя:</Text>
                    </View>
                    <Text style={styles.dataValue}>{residentData.first_name}</Text>
                  </View>
                </View>

                {/* Фамилия - отдельное поле */}
                <View style={styles.nameField}>
                  <View style={styles.nameFieldRow}>
                    <View style={styles.dataLabelContainer}>
                      <Ionicons name="person" size={16} color="#D64105" />
                      <Text style={styles.dataLabel}>Фамилия:</Text>
                    </View>
                    <Text style={styles.dataValue}>{residentData.last_name}</Text>
                  </View>
                </View>

                {/* Отчество - отдельное поле */}
                <View style={styles.nameField}>
                  <View style={styles.nameFieldRow}>
                    <View style={styles.dataLabelContainer}>
                      <Ionicons name="person" size={16} color="#D64105" />
                      <Text style={styles.dataLabel}>Отчество:</Text>
                    </View>
                    <Text style={styles.dataValue}>{residentData.patronymic}</Text>
                  </View>
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
                <Text style={styles.dataValue}>{residentData.residents_count}</Text>
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
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

