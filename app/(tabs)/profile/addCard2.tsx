import { AddCardScreenStyles as styles } from "@/components/AddCardScreenStyles";
import { ScreenContainer } from "@/components/ScreenContainer";
import { apiService } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddCardScreen() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cvv, setCvv] = useState("");

  // Форматирование номера карты (добавление пробелов через каждые 4 цифры)
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, "").replace(/[^0-9]/g, "");
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted.substring(0, 19); // Максимум 16 цифр + 3 пробела
  };

  // Форматирование срока действия (MM/YY)
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length >= 3) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  // Обработка ввода номера карты
  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  // Обработка ввода срока действия
  const handleExpiryDateChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    setExpiryDate(formatted);
  };

  // Валидация данных карты
  const validateCardData = (): string | null => {
    const cleanedCardNumber = cardNumber.replace(/\s+/g, '');
    if (cleanedCardNumber.length < 13 || cleanedCardNumber.length > 19) {
      return "Номер карты должен содержать от 13 до 19 цифр";
    }

    if (!expiryDate || expiryDate.length !== 5) {
      return "Введите срок действия карты (MM/YY)";
    }

    const [month, year] = expiryDate.split('/');
    const monthNum = parseInt(month, 10);
    if (monthNum < 1 || monthNum > 12) {
      return "Неверный месяц";
    }

    if (!cardholderName || cardholderName.trim().length < 2) {
      return "Введите имя держателя карты";
    }

    if (!cvv || cvv.length !== 3) {
      return "CVV должен содержать 3 цифры";
    }

    return null;
  };

  // Обработка добавления карты
  const handleAddCard = async () => {
    const validationError = validateCardData();
    if (validationError) {
      Alert.alert("Ошибка", validationError);
      return;
    }

    try {
      // Извлекаем месяц и год из формата MM/YY
      const [expiryMonth, expiryYear] = expiryDate.split('/');
      const cleanedCardNumber = cardNumber.replace(/\s+/g, '');

      const response = await apiService.addCard({
        cardNumber: cleanedCardNumber,
        expiryMonth,
        expiryYear,
        cardholderName: cardholderName.trim().toUpperCase(),
        cvv,
      });

      if (response.success) {
        Alert.alert("Успешно", "Карта успешно добавлена", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Ошибка", response.message || "Не удалось добавить карту");
      }
    } catch (error: any) {
      console.error('Error adding card:', error);
      Alert.alert("Ошибка", error.message || "Не удалось добавить карту. Проверьте подключение к серверу.");
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
        

          {/* Поля ввода */}
          <View style={styles.inputsContainer}>
            {/* Номер карты */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Номер карты</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.input}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor="#666"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  keyboardType="numeric"
                  maxLength={19}
                />
                {cardNumber ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#4CAF50"
                    style={styles.inputIcon}
                  />
                ) : null}
              </View>
            </View>

            {/* Срок действия и CVV в одной строке */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.inputLabel}>Срок действия</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#666"
                  value={expiryDate}
                  onChangeText={handleExpiryDateChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.input}
                    placeholder="000"
                    placeholderTextColor="#666"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                  <Ionicons
                    name="lock-closed"
                    size={16}
                    color="#666"
                    style={styles.inputIcon}
                  />
                </View>
              </View>
            </View>

            {/* Имя и фамилия */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Имя и фамилия</Text>
              <TextInput
                style={styles.input}
                placeholder="ИМЯ ФАМИЛИЯ"
                placeholderTextColor="#666"
                value={cardholderName}
                onChangeText={setCardholderName}
                autoCapitalize="characters"
              />
            </View>

            {/* Подсказка про CVV */}
            <View style={styles.cvvHint}>
              <Ionicons name="information-circle" size={16} color="#666" />
              <Text style={styles.cvvHintText}>
                CVV — 3 цифры на обратной стороне карты
              </Text>
            </View>
          </View>

          {/* Кнопка добавления */}
          <TouchableOpacity
            style={[
              styles.Button,
              (!cardNumber || !expiryDate || !cardholderName || !cvv) &&
                styles.addButtonDisabled,
            ]}
            onPress={handleAddCard}
            disabled={!cardNumber || !expiryDate || !cardholderName || !cvv}
         >
            <Text style={styles.ButtonText}>Добавить карту</Text>
          </TouchableOpacity>

          {/* Безопасность */}
          <View style={styles.securityInfo}>
            <Ionicons name="shield-checkmark" size={20} color="#10CB55" />
            <Text style={styles.securityText}>
              Ваши данные защищены и передаются по зашифрованному соединению
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}