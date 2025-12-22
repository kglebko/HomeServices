// screens/RegistrationScreen.tsx
import { Registration as styles } from "@/components/Registration";
import { ScreenContainer } from '@/components/ScreenContainer';
import { apiService } from '@/services/api';
import { storage } from '@/services/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

export default function RegistrationScreen() {
  const router = useRouter();
  const [contact, setContact] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const contactInputRef = useRef<TextInput>(null);

  // Моковые данные жильца (в реальном приложении будут приходить из QR-кода или API)
  const residentData = {
    firstName: 'Константин',
    lastName: 'Глебко',
    patronymic: 'Романович',
    fullName: 'Глебко Константин Романович', // Для отображения
    address: 'ул. Пономаренко 54-54',
    accountNumber: '2093350054',
    residentsCount: '4'
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Переключение между телефоном и email
  const toggleInputType = () => {
    const newIsEmail = !isEmail;
    setIsEmail(newIsEmail);
    setContact('');
    
    setTimeout(() => {
      contactInputRef.current?.focus();
    }, 100);
  };

  // Валидация контакта
  const validateContact = () => {
    if (!contact.trim()) {
      return "Введите телефон или email";
    }
    
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact)) {
        return "Введите корректный email";
      }
    } else {
      // Проверка телефона (только цифры, минимум 9 символов)
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(contact)) {
        return "Введите корректный номер телефона";
      }
    }
    
    return null;
  };

  // Отправка кода
  const handleSendCode = async () => {
    Keyboard.dismiss();
    
    const validationError = validateContact();
    if (validationError) {
      Alert.alert("Ошибка", validationError);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Сохраняем контакт для дальнейшего использования
      await storage.saveRegistrationContact(contact);
      
      // Отправляем код через API
      const response = await apiService.sendCode(contact);
      
      console.log('Send code response:', response);
      
      if (response.success) {
        // Успешно - переходим на экран ввода кода
        router.push("/login/enterCode");
        
        // Показываем информацию о коде (только после перехода)
        setTimeout(() => {
          Alert.alert(
            "Код отправлен",
            `Код подтверждения отправлен на ${isEmail ? 'email' : 'телефон'}: ${contact}\n\nПримечание: В режиме разработки код будет показан в консоли сервера.`
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

  return (
    <ScreenContainer>
      <ScrollView  showsVerticalScrollIndicator={false}  >
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
              <View style={styles.dataCard}>
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

                {/* Разделитель */}
                <View style={styles.separator} />

                {/* Информация */}
                <View style={styles.infoBox}>
                  <Ionicons name="information-circle" size={16} color="#4CAF50" />
                  <Text style={styles.infoText}>
                    Проверьте данные перед отправкой кода подтверждения
                  </Text>
                </View>
              </View>

              {/* Поле для телефона/email */}
              <View style={styles.contactContainer}>
                <View style={styles.contactHeader}>
                  <Text style={styles.contactLabel}>Телефон / E-mail</Text>
                  
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
                    returnKeyType="done"
                    onSubmitEditing={handleSendCode}
                  />
                  
                  <View style={styles.inputIconContainer}>
                    <Ionicons
                      name={isEmail ? "mail" : "phone-portrait"}
                      size={20}
                      color="#D64105"
                    />
                  </View>
                </View>
                
                <Text style={styles.hintText}>
                  {isEmail 
                    ? "На этот email будет отправлен код подтверждения" 
                    : "На этот номер будет отправлен SMS с кодом подтверждения"
                  }
                </Text>
              </View>

              {/* Кнопка отправки кода */}
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!contact.trim()) && styles.sendButtonDisabled,
                  isLoading && styles.sendButtonLoading,
                ]}
                onPress={handleSendCode}
                disabled={!contact.trim() || isLoading}
              >
                {isLoading ? (
                  <Text style={styles.sendButtonText}>Отправка...</Text>
                ) : (
                  <Text style={styles.sendButtonText}>Отправить код</Text>
                )}
              </TouchableOpacity>

              

              {/* Кнопка назад */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={20} color="#D64105" />
                <Text style={styles.backButtonText}>Вернуться к сканированию</Text>
              </TouchableOpacity>
            </View>
          
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      </ScrollView>
    </ScreenContainer>
  );
}

