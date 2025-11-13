import { ScreenContainer } from "@/components/ScreenContainer";
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";




export default function ProfileScreen() {
  const router = useRouter();

  return (
    
    <ScreenContainer>
        
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://i.imgur.com/Pe7Q1tT.png" }} 
            style={styles.avatar}
          />
          <Text style={styles.name}>Константин Глебко</Text>
          <Text style={styles.status}>Статус: <Text style={styles.statusValue}>Проживающий</Text></Text>
          <Text style={styles.email}>konstantin1977@gmail.com</Text>
          <Text style={styles.phone}>+375 29 752 52 52</Text>
        </View>

        
        <View style={styles.infoBlock}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>Адрес: ул. Пономаренко 54-54</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="account-balance-wallet" size={20} color="#fff" />
            <Text style={styles.infoText}>Лицевой счет: 2093350054</Text>
          </View>

          <View style={styles.infoRow}>
            <FontAwesome5 name="users" size={20} color="#fff" />
            <Text style={styles.infoText}>Кол-во проживающих: 4</Text>
          </View>
        </View>

        
        <TouchableOpacity style={styles.button}>
          <Feather name="lock" size={20} color="#fff" />
          <Text style={styles.buttonText}>Сменить пароль</Text>
        </TouchableOpacity>

        <TouchableOpacity
         style={styles.button}
            onPress={() => router.push("/profile/addCard")} >
            <Feather name="credit-card" size={20} color="#fff" />
            <Text style={styles.buttonText}>Добавить карту</Text>
            </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("/")}>
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>

      
    
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 50,
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

  profileSection: {
    alignItems: "center",
    marginTop: 80,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontFamily: 'Actay-Bold',
  },
  status: {
    color: "#D64105" ,
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Actay-Bold',
  },
  statusValue: {
    fontSize: 14,
    color: "#D64105",
    fontFamily: 'Actay-Bold',
  },
  email: {
    color: "#ccc",
    marginTop: 6,
  },
  phone: {
    color: "#ccc",
  },

  infoBlock: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    padding: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingLeft: 10,
    
  },
  infoText: {
    color: "#fff",
    marginLeft: 10,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    width: "90%",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
  },
  logoutButton: {
    marginTop: 30,
    width: "90%",
    borderRadius: 12,
    backgroundColor: "#1f1f1f",
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#e95420",
    fontWeight: "600",
    fontSize: 16,
  },
});
