import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AddCardScreen() {
  const router = useRouter();

  const cards = [
    { id: 1, name: "MasterCard", number: "5479", image: "https://i.imgur.com/GYMuJtM.png" },
    { id: 2, name: "Visa Smart Gold", number: "8788", image: "https://i.imgur.com/vVvQG5R.png" },
    { id: 3, name: "MasterCard", number: "5866", image: "https://i.imgur.com/GYMuJtM.png" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.time}>16:50</Text>
          <View style={styles.rightHeader}>
            <Text style={styles.lte}>LTE</Text>
            <View style={styles.battery}>
              <Text style={styles.batteryText}>59</Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <MaterialCommunityIcons
            name="credit-card-outline"
            size={26}
            color="#e95420"
            style={{ marginHorizontal: 6 }}
          />
          <Text style={styles.title}>Добавление карты</Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Платежные карты</Text>

        {/* Card List */}
        {cards.map((card) => (
          <TouchableOpacity key={card.id} style={styles.cardItem}>
            <Image source={{ uri: card.image }} style={styles.cardImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardNumber}>•••• {card.number}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}

        {/* Add Card Button */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Добавить карту</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
    paddingBottom: 50,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 20,
  },
  time: { color: "#fff", fontSize: 16 },
  rightHeader: { flexDirection: "row", alignItems: "center" },
  lte: { color: "#fff", marginRight: 6 },
  battery: {
    backgroundColor: "#ffb400",
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  batteryText: { fontWeight: "bold", color: "#000" },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginTop: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#fff",
    width: "90%",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    width: "90%",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cardImage: {
    width: 45,
    height: 28,
    marginRight: 10,
    resizeMode: "contain",
  },
  cardName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  cardNumber: {
    color: "#ccc",
  },
  addButton: {
    backgroundColor: "#e95420",
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 30,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
