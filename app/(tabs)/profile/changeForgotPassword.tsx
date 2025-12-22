import { ChangePasswordScreenStyles as styles } from "@/components/ChangePasswordScreenStyles";
import { ScreenContainer } from "@/components/ScreenContainer";
import { apiService } from "@/services/api";
import { storage } from "@/services/storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState<string>("");
  const [code, setCode] = useState<string>("");

  // Загружаем контакт и код, проверяем, что код был подтвержден
  useEffect(() => {
    const loadData = async () => {
      const savedContact = await storage.getResetPasswordContact();
      const savedCode = await storage.getResetPasswordCode();
      
      if (!savedContact || !savedCode) {
        Alert.alert("Ошибка", "Данные не найдены. Пожалуйста, начните восстановление пароля заново.", [
          { text: "OK", onPress: () => router.replace("/profile/forgotPassword") }
        ]);
        return;
      }
      setContact(savedContact);
      setCode(savedCode);
    };
    loadData();
  }, []);

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

  // Сброс пароля
  const handleResetPassword = async () => {
    Keyboard.dismiss();

    // Проверка на пустые поля
    if (!newPassword || !confirmPassword) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
      return;
    }

    // Проверка нового пароля
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      Alert.alert("Ошибка", passwordError);
      return;
    }

    // Проверка совпадения паролей
    if (newPassword !== confirmPassword) {
      Alert.alert("Ошибка", "Новый пароль и подтверждение не совпадают");
      return;
    }

    if (!contact) {
      Alert.alert("Ошибка", "Контакт не найден. Пожалуйста, начните восстановление пароля заново.");
      router.replace("/profile/forgotPassword");
      return;
    }

    if (!code) {
      Alert.alert("Ошибка", "Код не найден. Пожалуйста, начните восстановление пароля заново.");
      router.replace("/profile/forgotPassword");
      return;
    }

    setIsLoading(true);

    try {
      // Используем сохраненный код для сброса пароля
      const response = await apiService.resetPassword(contact, code, newPassword);
      
      if (response.success) {
        // Очищаем сохраненный контакт и код
        await storage.clearResetPasswordContact();
        
        Alert.alert(
          "Успешно!",
          "Пароль успешно изменен",
          [
            {
              text: "OK",
              onPress: () => {
                // Переход на профиль
                router.replace("/(tabs)/profile");
              },
            }
          ]
        );
      } else {
        Alert.alert("Ошибка", response.message || "Не удалось изменить пароль. Попробуйте еще раз.");
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      Alert.alert("Ошибка", error.message || "Не удалось изменить пароль. Попробуйте еще раз.");
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
            Введите новый пароль
          </Text>

          {/* Поля ввода */}
          <View style={styles.inputsContainer}>
           
           

            {/* Новый пароль */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Новый пароль</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Введите новый пароль"
                  placeholderTextColor="#666"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {newPassword ? (
                <Text style={[
                  styles.passwordHint,
                  validatePassword(newPassword) ? styles.passwordError : styles.passwordSuccess
                ]}>
                  {validatePassword(newPassword) || "Пароль надежный"}
                </Text>
              ) : null}
            </View>

            {/* Подтверждение пароля */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Повторите новый пароль</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Повторите новый пароль"
                  placeholderTextColor="#666"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
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
              {confirmPassword && newPassword ? (
                <Text style={[
                  styles.passwordHint,
                  newPassword === confirmPassword ? styles.passwordSuccess : styles.passwordError
                ]}>
                  {newPassword === confirmPassword ? "Пароли совпадают" : "Пароли не совпадают"}
                </Text>
              ) : null}
            </View>

        

            </View>

          {/* Кнопка смены пароля */}
          <TouchableOpacity
            style={[
              styles.changeButton,
              (!newPassword || !confirmPassword || isLoading) && styles.changeButtonDisabled
            ]}
            onPress={handleResetPassword}
            disabled={!newPassword || !confirmPassword || isLoading}
          >
            <Text style={styles.changeButtonText}>
              {isLoading ? "Изменение пароля..." : "Сменить пароль"}
            </Text>
          </TouchableOpacity>

          {/* Информация о безопасности */}
          <View style={styles.securityInfo}>
            <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
            <Text style={styles.securityText}>
              Рекомендуем использовать надежный пароль из букв, цифр и специальных символов
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

