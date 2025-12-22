import { ChangePasswordScreenStyles as styles } from "@/components/ChangePasswordScreenStyles";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Смена пароля
  const handleChangePassword = () => {
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

    

    // Здесь будет API-запрос на смену пароля
    console.log("Смена пароля:", {
      oldPassword,
      newPassword,
      confirmPassword,
    });

    // Имитация успешной смены пароля
    Alert.alert(
      "Успешно!",
      "Пароль успешно изменен",
      [
        {
          text: "OK",
           onPress: () => {
            // Переход после подтверждения
            router.push("/login");
          },
        }
      ]
    );
  };


  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          

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
              ( !newPassword || !confirmPassword) && styles.changeButtonDisabled
            ]}
           
           onPress={handleChangePassword}
            disabled={ !newPassword || !confirmPassword}
          >
            <Text style={styles.changeButtonText}>Сменить пароль</Text>
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

