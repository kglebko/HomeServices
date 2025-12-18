import { ProfileScreenStyles as styles } from "@/components/ProfileScreenStyles"; // Импорт стилей
import { ScreenContainer } from "@/components/ScreenContainer";
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ThemedButton } from '@/components/themed-button';
import { Image, Text, TouchableOpacity, View, Modal, Pressable } from "react-native";


export default function ProfileScreen() {
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false); // Состояние для модалки

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    router.replace("/");
  };

  return (
    
    <ScreenContainer>
        
        <View style={styles.profileSection}>
          <Image source={require("@/assets/images/profile_image.png")} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>Константин Глебко</Text>
          <Text style={styles.status}>Статус: <Text style={styles.statusValue}>Проживающий</Text></Text>
          <Text style={styles.email}>konstantin1977@gmail.com</Text>
          <Text style={styles.phone}>+375 29 752 52 52</Text>
        </View>

        
        <View style={styles.infoBlock} >
          <TouchableOpacity style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#fff" />
            <Text style={styles.infoText}>Адрес:<Text style={styles.infoAdress}> ул. Пономаренко 54-54</Text></Text>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <MaterialIcons name="account-balance-wallet" size={20} color="#fff" />
            <Text style={styles.infoText}>Лицевой счет: <Text style={styles.infoNumber}>2093350054</Text></Text>
          </View>

          <View style={styles.infoLastRow} >
            <FontAwesome5 name="users" size={20} color="#fff" />
            <Text style={styles.infoText}>Кол-во проживающих: 4</Text>
          </View>
        </View>

        
        <TouchableOpacity style={styles.infoBlock} onPress={() => router.push("/profile/changePassword")}>
          <View style={styles.infoNewRow}>
            <Feather name="lock" size={20} color="#fff" />
            <Text style={styles.buttonText}>Сменить пароль</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoBlock} onPress={() => router.push("/profile/addCard")} >
          <View style={styles.infoNewRow}> 
            <Ionicons name="card" size={20} color="#fff" />
            <Text style={styles.buttonText}>Добавить карту</Text>
          </View>
        </TouchableOpacity>

       
        <TouchableOpacity style={styles.logoutButton} onPress={() => setShowLogoutModal(true)}>
        <Text style={styles.logoutText}>Выйти</Text>
      </TouchableOpacity>

      {/* Модальное окно подтверждения выхода */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            
            
            {/* Заголовок */}
            <Text style={styles.modalTitle}>Вы уверены, что{"\n"}хотите выйти?</Text>
            
            {/* Кнопки */}
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.logoutConfirmButton]} 
                onPress={handleLogoutConfirm}
              >
                <Text style={styles.logoutConfirmText}>Выйти</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}


