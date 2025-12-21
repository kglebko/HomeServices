import { LoginAccount as styles } from "@/components/LoginAccount";
import { ScreenContainer } from "@/components/ScreenContainer";
import { apiService } from "@/services/api";
import { storage } from "@/services/storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
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

  // Форматирование номера телефона для Беларуси (только для режима телефона)
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
    // Если в режиме телефона и начинается с цифры или +, форматируем как телефон
    if (!isEmail && /^[\d\+]/.test(text)) {
      const formatted = formatPhoneNumber(text);
      setContact(formatted);
    } else {
      // Иначе просто устанавливаем текст
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
      // Выполняем запрос на логин через API
      const response = await apiService.login(contact, password);
      
      if (response.success && response.data) {
        // Сохраняем токен и данные пользователя
        await storage.saveToken(response.data.token);
        await storage.saveUser(response.data.user);
        
        // Успешный вход - переходим на главную
        router.replace("/(tabs)");
        Alert.alert("Успешно", "Вы вошли в аккаунт");
      } else {
        Alert.alert("Ошибка", "Неверный логин или пароль");
      }
      
    } catch (error: any) {
      Alert.alert("Ошибка", error.message || "Неверный логин или пароль");
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
                <Text style={styles.title}>Войти {"\n"}в аккаунт</Text>
              </View>
            </TouchableWithoutFeedback>

            {/* Поля ввода */}
            <View style={styles.inputsContainer}>
              {/* Телефон / E-mail с переключателем */}
              <View style={styles.inputGroup}>
                <View style={styles.inputHeader}>
                  <Text style={styles.inputLabel}>Телефон / E-mail</Text>
                  
                  {/* Кнопка переключения типа */}
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={toggleInputType}
                  >
                    <Ionicons
                      name={isEmail ? "phone-portrait" : "mail"}
                      size={16}
                      color="#D64105"
                    />
                    <Text style={styles.toggleButtonText}>
                      {isEmail ? "Телефон" : "Email"}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.inputWrapper}>
                  <TextInput
                    ref={contactInputRef}
                    style={styles.input}
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
                  <View style={styles.inputIconContainer}>
                    <Ionicons
                      name={isEmail ? "mail" : "phone-portrait"}
                      size={20}
                      color="#D64105"
                    />
                  </View>
                </View>
                
                
              </View>

              {/* Пароль */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel} >Пароль</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    ref={passwordInputRef}
                    style={styles.input}
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
                    style={styles.inputIconContainer}
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
              <View style={styles.optionsContainer}>
                {/* Запомнить вход */}
                <TouchableOpacity
                  style={styles.rememberContainer}
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
                  <Text style={styles.rememberText}>Запомнить вход</Text>
                </TouchableOpacity>

                {/* Забыли пароль */}
                <TouchableOpacity onPress={() => router.push("/login/forgotPassword")}>
                  <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Кнопка входа */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                (!contact.trim() || !password.trim()) && styles.loginButtonDisabled,
                isLoading && styles.loginButtonLoading, 
              ]}
              onPress={handleLogin}
              disabled={!contact.trim() || !password.trim() || isLoading}
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Вход...</Text>
              ) : (
                <Text style={styles.loginButtonText}>Войти</Text>
              )}
            </TouchableOpacity>

            {/* Регистрация */}
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Нет аккаунта?</Text>
                <TouchableOpacity onPress={() => router.push("/login/scanQR")}>
                  <Text style={styles.registerLink}>Регистрация</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>

            {/* Информация */}
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <View style={styles.infoContainer}>
                <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
                <Text style={styles.infoText}>
                  Ваши данные защищены
                </Text>
              </View>
            </TouchableWithoutFeedback>
        
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScreenContainer>
  );
}