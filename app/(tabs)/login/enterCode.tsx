import { CodeScreenStyles as styles } from "@/components/CodeScreenStyles";
import { ScreenContainer } from "@/components/ScreenContainer";
import { apiService } from "@/services/api";
import { storage } from "@/services/storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CodeVerificationScreen() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [contact, setContact] = useState<string>("");
  const inputsRef = useRef<(TextInput | null)[]>([]);

  // Загружаем контакт при монтировании компонента
  useEffect(() => {
    const loadContact = async () => {
      const savedContact = await storage.getRegistrationContact();
      if (savedContact) {
        setContact(savedContact);
      }
    };
    loadContact();
  }, []);

  
  // Таймер для повторной отправки кода
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  // Обработка изменения кода
  const handleCodeChange = (text: string, index: number) => {
    // Разрешаем только цифры
    const numericText = text.replace(/[^0-9]/g, "");
    
    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);

    // Автопереход к следующему полю
    if (numericText && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    // Автоподтверждение при заполнении всех полей
    if (index === 3 && numericText) {
      const fullCode = newCode.join("");
      if (fullCode.length === 4) {
        handleVerifyCode(fullCode);
      }
    }
  };

  // Обработка удаления символов
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Повторная отправка кода
  const handleResendCode = async () => {
    if (isResendEnabled && contact) {
      try {
        await apiService.sendCode(contact);
        Alert.alert("Код отправлен", "Новый код подтверждения отправлен на ваше устройство");
        setTimer(60);
        setIsResendEnabled(false);
        setCode(["", "", "", ""]);
        inputsRef.current[0]?.focus();
      } catch (error: any) {
        Alert.alert("Ошибка", error.message || "Не удалось отправить код. Попробуйте еще раз.");
      }
    }
  };

  // Подтверждение кода
  const handleVerifyCode = async (verificationCode: string) => {
    Keyboard.dismiss();
    
    if (!contact) {
      Alert.alert("Ошибка", "Контакт не найден. Пожалуйста, начните регистрацию заново.");
      return;
    }
    
    try {
      const response = await apiService.verifyCode(contact, verificationCode);
      
      if (response.success && response.data) {
        // Код подтвержден, переходим к созданию пароля
        router.push("/login/complete");
      } else {
        Alert.alert("Ошибка!", "Неверный код подтверждения");
        setCode(["", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch (error: any) {
      Alert.alert("Ошибка!", error.message || "Неверный код подтверждения");
      setCode(["", "", "", ""]);
      inputsRef.current[0]?.focus();
    }
  };

  // Продолжить
  const handleContinue = () => {
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      handleVerifyCode(fullCode);
    } else {
      Alert.alert("Внимание", "Пожалуйста, введите все 4 цифры кода");
      inputsRef.current[code.findIndex((c) => c === "")]?.focus();
    }
  };


  

  return (
    <ScreenContainer>
    <ScrollView>
       

        {/* Заголовок */}
        <Text style={styles.title}>Введите код</Text>

        {/* Описание */}
        <Text style={styles.description}>
          Мы выслали вам Код подтверждения{"\n"}
          на ваше устройство
        </Text>

        {/* Поля для ввода кода */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputsRef.current[index] = ref;
              }}
              style={[
                styles.codeInput,
                digit && styles.codeInputFilled,
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Подсказка */}
        <Text style={styles.hintText}>Введите 4-значный код из SMS</Text>

        {/* Таймер и повторная отправка */}
        <View style={styles.resendContainer}>
          <Text style={styles.timerText}>
            {isResendEnabled ? "Код не пришел?" : `Отправить код еще раз через ${timer} сек`}
          </Text>
          
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={!isResendEnabled}
          >
            <Text style={[
              styles.resendText,
              isResendEnabled && styles.resendTextActive
            ]}>
              Отправить код еще раз
            </Text>
          </TouchableOpacity>
        </View>

        {/* Кнопка продолжить */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            code.join("").length === 4 && styles.continueButtonActive
          ]}
          onPress={handleContinue}
          disabled={code.join("").length !== 4}
        >
          <Text style={styles.continueButtonText}>Продолжить</Text>
        </TouchableOpacity>

        {/* Иконка для визуального акцента */}
        <View style={styles.iconContainer}>
          <Ionicons name="mail" size={100} color="#D64105" opacity={0.2} />
        </View>
    </ScrollView>
    </ScreenContainer>
  );
}

