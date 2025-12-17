import { ProfileScreenStyles as styles } from "@/components/ProfileScreenStyles"; // Импорт стилей
import { ScreenContainer } from "@/components/ScreenContainer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ThemedCard } from '@/components/themed-card';


export default function AddCardScreen() {
  const router = useRouter();

  const cards = [
    { id: 1, name: "MasterCard", number: "5479", image: require("@/assets/images/card1.png") },
    { id: 2, name: "Visa Smart Gold", number: "8788", image:require("@/assets/images/card2.png") },
    { id: 3, name: "MasterCard", number: "5866", image: require("@/assets/images/card3.png") },
  ];

  return (
    <ScreenContainer>
    <ScrollView>
      <View style={styles.Row}>
        <Text style={styles.subtitle}>Платежные карты</Text>
        <Ionicons name="trash" size={20} color="#D64105" />
      </View>

        {cards.map((card) => (
          <TouchableOpacity key={card.id} style={styles.cardItem}>
           <Image source={card.image} style={styles.cardImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardNumber}>• • • • {card.number}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D64105" />
          </TouchableOpacity>
        ))}

        
        <TouchableOpacity style={styles.Button} onPress={() => router.push("/profile/addCard2")} >
          <Text style={styles.ButtonText}>Добавить карту</Text>
        </TouchableOpacity>

      
    </ScrollView>
    </ScreenContainer>
  );
};
