import { ForgotPassword as styles } from "@/components/ForgotPassword";
import { ScreenContainer } from "@/components/ScreenContainer";
import { apiService } from "@/services/api";
import { storage } from "@/services/storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [contact, setContact] = useState("");
  const [isEmail, setIsEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Загружаем контакт пользователя из профиля
  useEffect(() => {
    const loadUserContact = async () => {
      try {
        const userData = await storage.getUser();
        if (userData) {
          // Используем телефон или email из профиля
          const userContact = userData.phone || userData.email;
          if (userContact) {
            setContact(userContact);
            setIsEmail(userContact.includes("@"));
          }
        }
      } catch (error) {
        console.error('Error loading user contact:', error);
      }
    };
    loadUserContact();
  }, []);

  // Определяем, что ввел пользователь: email или телефон
  const detectInputType = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    
    if (emailRegex.test(text)) {
      setIsEmail(true);
    } else if (phoneRegex.test(text) && text.replace(/\D/g, '').length >= 11) {
      setIsEmail(false);
    }
  };

  // Форматирование номера телефона для Беларуси
const formatPhoneNumber = (text: string) => {
  const cleaned = text.replace(/\D/g, '');
  
  if (cleaned.length === 0) return "";
  
  // Убираем код страны 375 если пользователь ввел его без +
  let digits = cleaned;
  if (digits.startsWith('375')) {
    digits = digits.substring(3);
  }
  
  // Форматирование в зависимости от длины
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
  
  // Максимальная длина: +375 (29) 123-45-67
  return `+375 (${digits.substring(0, 2)}) ${digits.substring(2, 5)}-${digits.substring(5, 7)}-${digits.substring(7, 9)}`;
};


  // Обработка ввода
  const handleContactChange = (text: string) => {
    // Если начинается с цифры или +, считаем это телефоном
    if (/^[\d\+]/.test(text)) {
      const formatted = formatPhoneNumber(text);
      setContact(formatted);
      setIsEmail(false);
    } else {
      setContact(text);
      detectInputType(text);
    }
  };

  // Валидация ввода
  const validateContact = () => {
    const trimmedContact = contact.trim();
    
    if (!trimmedContact) {
      return "Пожалуйста, введите email или номер телефона";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    const phoneDigits = trimmedContact.replace(/\D/g, '');
    
    if (emailRegex.test(trimmedContact)) {
      return null;
    } else if (phoneRegex.test(trimmedContact) && phoneDigits.length >= 10) {
      return null;
    } else {
      return "Пожалуйста, введите корректный email или номер телефона";
    }
  };

  

  // Определяем placeholder в зависимости от ввода
  const getPlaceholder = () => {
    if (contact && isEmail) {
      return "example@email.com";
    } else if (contact && !isEmail) {
      return "+375";
    }
    return "+375 или example@email.com";
  };

  // Отправка кода для восстановления пароля
  const handleSendCode = async () => {
    Keyboard.dismiss();
    
    const validationError = validateContact();
    if (validationError) {
      Alert.alert("Ошибка", validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Нормализуем контакт (убираем форматирование телефона)
      const normalizedContact = contact.trim();
      
      // Сохраняем контакт для дальнейшего использования
      await storage.saveResetPasswordContact(normalizedContact);
      
      // Отправляем код через API
      const response = await apiService.sendCode(normalizedContact);
      
      if (response.success) {
        // Успешно - переходим на экран ввода кода
        router.push("/profile/enterCode2");
        
        // Показываем информацию о коде
        setTimeout(() => {
          Alert.alert(
            "Код отправлен",
            `Код подтверждения отправлен на ${isEmail ? 'email' : 'телефон'}: ${normalizedContact}\n\nПримечание: В режиме разработки код будет показан в консоли сервера.`
          );
        }, 500);
      } else {
        Alert.alert("Ошибка", response.message || "Не удалось отправить код");
      }
    } catch (error: any) {
      console.error('Send code error:', error);
      Alert.alert("Ошибка", error.message || "Не удалось отправить код. Проверьте подключение к серверу.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          

          {/* Описание */}
          <Text style={styles.description}>
            Забыли пароль?{"\n"}
            Введите номер телефона или e-mail,{"\n"}
            на который будет прислан{"\n"}
            код подтверждения
          </Text>

          {/* Поле ввода */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {isEmail ? "Email" : "Номер телефона"}
            </Text>
            
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={getPlaceholder()}
                placeholderTextColor="#666"
                value={contact}
                onChangeText={handleContactChange}
                keyboardType={isEmail ? "email-address" : "phone-pad"}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete={isEmail ? "email" : "tel"}
              />
              
              {contact ? (
                <View style={styles.inputIconContainer}>
                  <Ionicons
                    name={isEmail ? "mail" : "phone-portrait"}
                    size={20}
                    color="#D64105"
                    style={styles.inputIcon}
                  />
                </View>
              ) : null}
            </View>

            {/* Подсказка */}
            <Text style={styles.hintText}>
              {isEmail 
                ? "На указанный email придет код подтверждения"
                : "На указанный номер придет SMS с кодом подтверждения"
              }
            </Text>
          </View>

          {/* Кнопка отправки кода */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!contact.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={handleSendCode}
            disabled={!contact.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>
              {isLoading ? "Отправка..." : "Отправить код"}
            </Text>
          </TouchableOpacity>

          {/* Альтернативный вариант */}
          <TouchableOpacity
            style={styles.alternativeButton}
            onPress={() => {
              setIsEmail(!isEmail);
              setContact("");
            }}
          >
            <Text style={styles.alternativeButtonText}>
              {isEmail 
                ? "Восстановить через номер телефона"
                : "Восстановить через email"
              }
            </Text>
          </TouchableOpacity>

          {/* Информация */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color="#666" />
            <Text style={styles.infoText}>
              Код подтверждения будет действителен {"\n"}в течение 10 минут
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

