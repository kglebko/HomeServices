import { ProfileScreenStyles as styles } from "@/components/ProfileScreenStyles"; // Импорт стилей
import { ScreenContainer } from "@/components/ScreenContainer";
import { apiService, PaymentCard } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Определение типа карты по номеру
const getCardType = (cardNumber: string): string => {
  const firstDigit = cardNumber.replace(/\D/g, '')[0];
  if (firstDigit === '4') return 'Visa';
  if (firstDigit === '5') return 'MasterCard';
  if (firstDigit === '3') return 'American Express';
  return 'Unknown';
};

// Получение изображения карты по типу
const getCardImage = (cardType: string) => {
  switch (cardType) {
    case 'Visa':
      return require("@/assets/images/card2.png");
    case 'MasterCard':
      return require("@/assets/images/card1.png");
    default:
      return require("@/assets/images/card3.png");
  }
};

export default function AddCardScreen() {
  const router = useRouter();
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Загрузка карт
  const loadCards = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getCards();
      
      console.log('Cards response:', response);
      
      if (response.success) {
        // Если data есть и это массив, используем его, иначе пустой массив
        if (response.data && Array.isArray(response.data)) {
          setCards(response.data);
        } else if (response.data === null || response.data === undefined) {
          // Если data null или undefined, устанавливаем пустой массив (сервер вернул пустой ответ)
          console.log('Server returned null/undefined data, using empty array');
          setCards([]);
        } else {
          // Если data не массив, устанавливаем пустой массив
          console.warn('Response data is not an array:', response.data);
          setCards([]);
        }
      } else {
        console.error('Failed to load cards:', response.message);
        // При ошибке устанавливаем пустой массив
        setCards([]);
        if (response.message) {
          Alert.alert("Ошибка", response.message);
        }
      }
    } catch (error: any) {
      console.error('Error loading cards:', error);
      // При ошибке устанавливаем пустой массив
      setCards([]);
      
      // Показываем ошибку только если это не ошибка авторизации
      if (error?.status !== 401 && error?.status !== 403) {
        Alert.alert("Ошибка", error.message || "Не удалось загрузить карты");
      } else if (error?.status === 401 || error?.status === 403) {
        // Если ошибка авторизации, просто показываем пустой список
        console.log('Unauthorized access to cards - showing empty list');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Обновляем список карт при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [loadCards])
  );

  // Удаление карты
  const handleDeleteCard = async (cardId: number) => {
    Alert.alert(
      "Удалить карту?",
      "Вы уверены, что хотите удалить эту карту?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(cardId);
              const response = await apiService.deleteCard(cardId);
              if (response.success) {
                Alert.alert("Успешно", "Карта удалена");
                loadCards(); // Перезагружаем список
              } else {
                Alert.alert("Ошибка", response.message || "Не удалось удалить карту");
              }
            } catch (error: any) {
              Alert.alert("Ошибка", error.message || "Не удалось удалить карту");
            } finally {
              setIsDeleting(null);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#D64105" />
          <Text style={{ color: '#fff', marginTop: 16, fontFamily: 'Actay' }}>
            Загрузка карт...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView>
        <View style={styles.Row}>
          <Text style={styles.subtitle}>Платежные карты</Text>
        </View>

        {cards.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Ionicons name="card-outline" size={64} color="#666" />
            <Text style={{ color: '#666', marginTop: 16, fontFamily: 'Actay', textAlign: 'center' }}>
              У вас пока нет добавленных карт
            </Text>
          </View>
        ) : (
          cards.map((card) => {
            const cardType = card.cardType || 'Unknown';
            const cardImage = getCardImage(cardType);
            
            return (
              <TouchableOpacity 
                key={card.id} 
                style={styles.cardItem}
                onLongPress={() => handleDeleteCard(card.id)}
              >
                <Image source={cardImage} style={styles.cardImage} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.cardName}>{cardType}</Text>
                    {card.isDefault && (
                      <View style={{ 
                        backgroundColor: '#D64105', 
                        paddingHorizontal: 6, 
                        paddingVertical: 2, 
                        borderRadius: 4 
                      }}>
                        <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'Actay' }}>
                          По умолчанию
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardNumber}>• • • • {card.cardNumberLast4}</Text>
                  <Text style={{ color: '#666', fontSize: 12, fontFamily: 'Actay', marginTop: 4 }}>
                    {card.cardholderName} • {card.expiryMonth}/{card.expiryYear}
                  </Text>
                </View>
                {isDeleting === card.id ? (
                  <ActivityIndicator size="small" color="#D64105" />
                ) : (
                  <Ionicons 
                    name="trash-outline" 
                    size={20} 
                    color="#D64105" 
                    onPress={() => handleDeleteCard(card.id)}
                  />
                )}
              </TouchableOpacity>
            );
          })
        )}

        <TouchableOpacity 
          style={styles.Button} 
          onPress={() => router.push("/profile/addCard2")}
        >
          <Text style={styles.ButtonText}>Добавить карту</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
