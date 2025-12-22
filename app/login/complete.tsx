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
  Modal,
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
  const [showUserAgreement, setShowUserAgreement] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  
  // Рефы для управления фокусом
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  // Данные из QR-кода (загружаются из storage)
  const [residentData, setResidentData] = useState({
    first_name: 'Константин',
    last_name: 'Глебко',
    patronymic: 'Романович',
    address: 'ул. Пономаренко 54-54',
    accountNumber: '',
    residents_count: 4
  });

  // Загружаем контакт и лицевой счет при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      // Загружаем контакт
      const savedContact = await storage.getRegistrationContact();
      if (savedContact) {
        setContact(savedContact);
      } else {
        Alert.alert("Ошибка", "Контакт не найден. Пожалуйста, начните регистрацию заново.", [
          { text: "OK", onPress: () => router.back() }
        ]);
        return;
      }

      // Загружаем лицевой счет из QR-кода
      const accountNumber = await storage.getAccountNumber();
      if (accountNumber) {
        setResidentData(prev => ({
          ...prev,
          accountNumber: accountNumber
        }));
      }
    };
    loadData();
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
            
            // Переходим на главную
            router.replace("/(tabs)");
        } else {
            Alert.alert("Ошибка", "Не удалось завершить регистрацию. Попробуйте еще раз.");
        }
        
    } catch (error: any) {
        Alert.alert("Ошибка", error.message || "Не удалось завершить регистрацию. Попробуйте еще раз.");
    } finally {
        setIsLoading(false);
    }
  };

  // Открытие пользовательского соглашения
  const openUserAgreement = () => {
    setShowUserAgreement(true);
  };

  // Открытие правил обработки данных
  const openPrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
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
                
                  <View style={styles.nameFieldRow}>
                    <View style={styles.dataLabelContainer}>
                      <Ionicons name="person" size={16} color="#D64105" />
                      <Text style={styles.dataLabel}>Имя:</Text>
                    </View>
                    <Text style={styles.dataValue}>{residentData.first_name}</Text>
                  </View>
                

                {/* Фамилия - отдельное поле */}
                
                  <View style={styles.nameFieldRow}>
                    <View style={styles.dataLabelContainer}>
                      <Ionicons name="person" size={16} color="#D64105" />
                      <Text style={styles.dataLabel}>Фамилия:</Text>
                    </View>
                    <Text style={styles.dataValue}>{residentData.last_name}</Text>
                  </View>
                

                {/* Отчество - отдельное поле */}
               
                  <View style={styles.nameFieldRow}>
                    <View style={styles.dataLabelContainer}>
                      <Ionicons name="person" size={16} color="#D64105" />
                      <Text style={styles.dataLabel}>Отчество:</Text>
                    </View>
                    <Text style={styles.dataValue}>{residentData.patronymic}</Text>
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
                <View style={styles.optionItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <TouchableOpacity
                      onPress={() => setAgreeTerms(!agreeTerms)}
                      style={{ marginRight: 8 }}
                    >
                      <View style={[
                        styles.checkbox,
                        agreeTerms && styles.checkboxChecked,
                        { marginTop: 2 }
                      ]}>
                        {agreeTerms && (
                          <Ionicons name="checkmark" size={14} color="#fff" />
                        )}
                      </View>
                    </TouchableOpacity>
                    <View style={styles.termsContainer}>
                      <Text style={styles.optionText}>
                        Принимаю условия{' '}
                        <Text 
                          style={styles.link} 
                          onPress={openUserAgreement}
                        >
                          Пользовательского соглашения
                        </Text>
                        {' '}и согласен(-с) с{' '}
                        <Text 
                          style={styles.link} 
                          onPress={openPrivacyPolicy}
                        >
                          Правилами обработки персональных данных
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
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

      {/* Модальное окно пользовательского соглашения */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showUserAgreement}
        onRequestClose={() => setShowUserAgreement(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Пользовательское соглашение</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowUserAgreement(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true}>
              <Text style={styles.modalText}>
                Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между администрацией мобильного приложения «HomeServices» (далее — «Приложение») и пользователем (далее — «Пользователь») при использовании Приложения.
              </Text>
              
              <Text style={styles.modalSectionTitle}>1. Общие положения</Text>
              <Text style={styles.modalText}>
                1.1. Используя Приложение, Пользователь подтверждает, что он прочитал, понял и согласен соблюдать настоящее Соглашение.
              </Text>
              <Text style={styles.modalText}>
                1.2. Приложение предоставляет услуги по управлению коммунальными услугами, включая просмотр счетов, оплату услуг, подачу показаний счетчиков и другие функции.
              </Text>
              <Text style={styles.modalText}>
                1.3. Администрация оставляет за собой право изменять настоящее Соглашение в любое время. Изменения вступают в силу с момента их публикации в Приложении.
              </Text>

              <Text style={styles.modalSectionTitle}>2. Регистрация и учетная запись</Text>
              <Text style={styles.modalText}>
                2.1. Для использования Приложения Пользователь должен пройти процедуру регистрации, предоставив достоверную информацию.
              </Text>
              <Text style={styles.modalText}>
                2.2. Пользователь несет ответственность за сохранность своих учетных данных (логин, пароль) и за все действия, совершенные с использованием его учетной записи.
              </Text>
              <Text style={styles.modalText}>
                2.3. Пользователь обязуется немедленно уведомлять Администрацию о любом несанкционированном использовании его учетной записи.
              </Text>

              <Text style={styles.modalSectionTitle}>3. Права и обязанности Пользователя</Text>
              <Text style={styles.modalText}>
                3.1. Пользователь имеет право использовать Приложение в соответствии с его функциональными возможностями.
              </Text>
              <Text style={styles.modalText}>
                3.2. Пользователь обязуется:
              </Text>
              <View style={styles.modalList}>
                <Text style={styles.modalListItem}>• Предоставлять достоверную информацию при регистрации и использовании Приложения</Text>
                <Text style={styles.modalListItem}>• Не передавать свои учетные данные третьим лицам</Text>
                <Text style={styles.modalListItem}>• Не использовать Приложение в незаконных целях</Text>
                <Text style={styles.modalListItem}>• Не предпринимать попыток взлома или нарушения работы Приложения</Text>
                <Text style={styles.modalListItem}>• Соблюдать требования законодательства Республики Беларусь</Text>
              </View>

              <Text style={styles.modalSectionTitle}>4. Права и обязанности Администрации</Text>
              <Text style={styles.modalText}>
                4.1. Администрация обязуется обеспечивать работоспособность Приложения в пределах разумного.
              </Text>
              <Text style={styles.modalText}>
                4.2. Администрация имеет право приостановить или прекратить доступ Пользователя к Приложению в случае нарушения настоящего Соглашения.
              </Text>
              <Text style={styles.modalText}>
                4.3. Администрация не несет ответственности за временные сбои в работе Приложения, связанные с техническими работами или обстоятельствами непреодолимой силы.
              </Text>

              <Text style={styles.modalSectionTitle}>5. Интеллектуальная собственность</Text>
              <Text style={styles.modalText}>
                5.1. Все материалы Приложения, включая дизайн, тексты, графику, логотипы, являются объектами интеллектуальной собственности Администрации.
              </Text>
              <Text style={styles.modalText}>
                5.2. Пользователь не имеет права копировать, распространять или использовать материалы Приложения без письменного разрешения Администрации.
              </Text>

              <Text style={styles.modalSectionTitle}>6. Ответственность</Text>
              <Text style={styles.modalText}>
                6.1. Администрация не несет ответственности за ущерб, причиненный Пользователю в результате использования или невозможности использования Приложения.
              </Text>
              <Text style={styles.modalText}>
                6.2. Пользователь несет полную ответственность за достоверность предоставленной информации и за последствия ее использования.
              </Text>

              <Text style={styles.modalSectionTitle}>7. Заключительные положения</Text>
              <Text style={styles.modalText}>
                7.1. Настоящее Соглашение регулируется законодательством Республики Беларусь.
              </Text>
              <Text style={styles.modalText}>
                7.2. Все споры решаются путем переговоров, а при невозможности достижения соглашения — в судебном порядке.
              </Text>
              <Text style={styles.modalText}>
                7.3. Если какое-либо положение настоящего Соглашения признано недействительным, остальные положения остаются в силе.
              </Text>

              <Text style={[styles.modalText, { marginTop: 20, fontFamily: "Actay-Bold" }]}>
                Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Модальное окно правил обработки персональных данных */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPrivacyPolicy}
        onRequestClose={() => setShowPrivacyPolicy(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Правила обработки персональных данных</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowPrivacyPolicy(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true}>
              <Text style={styles.modalText}>
                Настоящие Правила обработки персональных данных (далее — «Правила») определяют порядок обработки и защиты персональных данных пользователей мобильного приложения «HomeServices» (далее — «Приложение»).
              </Text>
              
              <Text style={styles.modalSectionTitle}>1. Общие положения</Text>
              <Text style={styles.modalText}>
                1.1. Настоящие Правила разработаны в соответствии с Законом Республики Беларусь «О защите персональных данных» и иными нормативными правовыми актами Республики Беларусь.
              </Text>
              <Text style={styles.modalText}>
                1.2. Администрация Приложения (далее — «Оператор») обязуется соблюдать конфиденциальность персональных данных Пользователей.
              </Text>
              <Text style={styles.modalText}>
                1.3. Используя Приложение, Пользователь дает свое согласие на обработку его персональных данных в соответствии с настоящими Правилами.
              </Text>

              <Text style={styles.modalSectionTitle}>2. Категории обрабатываемых данных</Text>
              <Text style={styles.modalText}>
                2.1. Оператор обрабатывает следующие категории персональных данных:
              </Text>
              <View style={styles.modalList}>
                <Text style={styles.modalListItem}>• Фамилия, имя, отчество</Text>
                <Text style={styles.modalListItem}>• Номер телефона</Text>
                <Text style={styles.modalListItem}>• Адрес места жительства</Text>
                <Text style={styles.modalListItem}>• Номер лицевого счета</Text>
                <Text style={styles.modalListItem}>• Данные о количестве проживающих</Text>
                <Text style={styles.modalListItem}>• Данные о показаниях счетчиков</Text>
                <Text style={styles.modalListItem}>• Данные об оплате коммунальных услуг</Text>
                <Text style={styles.modalListItem}>• Технические данные устройства (IP-адрес, тип устройства, версия ОС)</Text>
              </View>

              <Text style={styles.modalSectionTitle}>3. Цели обработки персональных данных</Text>
              <Text style={styles.modalText}>
                3.1. Персональные данные обрабатываются в следующих целях:
              </Text>
              <View style={styles.modalList}>
                <Text style={styles.modalListItem}>• Предоставление доступа к функциональным возможностям Приложения</Text>
                <Text style={styles.modalListItem}>• Идентификация Пользователя при входе в Приложение</Text>
                <Text style={styles.modalListItem}>• Обработка запросов и обращений Пользователей</Text>
                <Text style={styles.modalListItem}>• Отправка уведомлений и информационных сообщений</Text>
                <Text style={styles.modalListItem}>• Улучшение качества работы Приложения</Text>
                <Text style={styles.modalListItem}>• Соблюдение требований законодательства</Text>
              </View>

              <Text style={styles.modalSectionTitle}>4. Способы обработки персональных данных</Text>
              <Text style={styles.modalText}>
                4.1. Обработка персональных данных осуществляется с использованием средств автоматизации и без использования таких средств.
              </Text>
              <Text style={styles.modalText}>
                4.2. Оператор применяет необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования, предоставления, распространения.
              </Text>

              <Text style={styles.modalSectionTitle}>5. Сроки обработки персональных данных</Text>
              <Text style={styles.modalText}>
                5.1. Персональные данные обрабатываются в течение срока, необходимого для достижения целей обработки, или в течение срока, установленного законодательством.
              </Text>
              <Text style={styles.modalText}>
                5.2. После достижения целей обработки или истечения срока хранения персональные данные подлежат уничтожению или обезличиванию.
              </Text>

              <Text style={styles.modalSectionTitle}>6. Права Пользователя</Text>
              <Text style={styles.modalText}>
                6.1. Пользователь имеет право:
              </Text>
              <View style={styles.modalList}>
                <Text style={styles.modalListItem}>• Получать информацию, касающуюся обработки его персональных данных</Text>
                <Text style={styles.modalListItem}>• Требовать уточнения, блокирования или уничтожения персональных данных</Text>
                <Text style={styles.modalListItem}>• Отозвать согласие на обработку персональных данных</Text>
                <Text style={styles.modalListItem}>• Обжаловать действия Оператора в уполномоченном органе по защите прав субъектов персональных данных</Text>
              </View>

              <Text style={styles.modalSectionTitle}>7. Передача персональных данных третьим лицам</Text>
              <Text style={styles.modalText}>
                7.1. Оператор не передает персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством.
              </Text>
              <Text style={styles.modalText}>
                7.2. Оператор может передавать персональные данные уполномоченным органам государственной власти в случаях, предусмотренных законодательством.
              </Text>

              <Text style={styles.modalSectionTitle}>8. Меры по защите персональных данных</Text>
              <Text style={styles.modalText}>
                8.1. Оператор принимает необходимые меры для защиты персональных данных, включая:
              </Text>
              <View style={styles.modalList}>
                <Text style={styles.modalListItem}>• Использование современных методов шифрования данных</Text>
                <Text style={styles.modalListItem}>• Ограничение доступа к персональным данным</Text>
                <Text style={styles.modalListItem}>• Регулярное обновление систем защиты</Text>
                <Text style={styles.modalListItem}>• Обучение персонала правилам работы с персональными данными</Text>
              </View>

              <Text style={styles.modalSectionTitle}>9. Контактная информация</Text>
              <Text style={styles.modalText}>
                9.1. По всем вопросам, связанным с обработкой персональных данных, Пользователь может обращаться к Оператору через форму обратной связи в Приложении или по электронной почте.
              </Text>

              <Text style={styles.modalSectionTitle}>10. Изменение Правил</Text>
              <Text style={styles.modalText}>
                10.1. Оператор оставляет за собой право вносить изменения в настоящие Правила. Изменения вступают в силу с момента их публикации в Приложении.
              </Text>
              <Text style={styles.modalText}>
                10.2. Продолжение использования Приложения после внесения изменений означает согласие Пользователя с новыми Правилами.
              </Text>

              <Text style={[styles.modalText, { marginTop: 20, fontFamily: "Actay-Bold" }]}>
                Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

