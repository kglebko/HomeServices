import { ProfileScreenStyles as styles } from "@/components/ProfileScreenStyles"; // Импорт стилей
import { ScreenContainer } from "@/components/ScreenContainer";
import { apiService } from "@/services/api";
import { storage } from "@/services/storage";
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface UserData {
  id: number;
  phone: string | null;
  email: string | null;
  fullName: string | null;
  address: string | null;
  accountNumber: string | null;
  residentsCount: number | null;
}

export default function ProfileScreen() {
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных пользователя
  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Сначала пытаемся загрузить из storage
      const savedUser = await storage.getUser();
      
      if (savedUser) {
        setUserData(savedUser);
        
        // Затем пытаемся обновить данные с сервера (в фоне, без блокировки UI)
        try {
          const response = await apiService.getProfile();
          if (response.success && response.data) {
            setUserData(response.data);
            await storage.saveUser(response.data);
          }
        } catch (error: any) {
          // Если 403 или другая ошибка - просто используем кэшированные данные
          // Не показываем ошибку пользователю, так как данные уже есть
          if (error?.status === 403) {
            console.log('Profile request returned 403 - using cached data (token may be invalid or expired)');
          } else {
            console.log('Failed to fetch profile from server, using cached data:', error.message);
          }
        }
      } else {
        // Если данных нет, пытаемся получить с сервера
        try {
          const response = await apiService.getProfile();
          if (response.success && response.data) {
            setUserData(response.data);
            await storage.saveUser(response.data);
          }
        } catch (error: any) {
          // Если 403 - токен недействителен, перенаправляем на логин
          if (error?.status === 403 || error?.status === 401) {
            console.log('Authentication failed (403/401), redirecting to login');
            await storage.clearAuth();
            router.replace("/login");
          } else {
            Alert.alert("Ошибка", "Не удалось загрузить данные профиля");
            router.replace("/login");
          }
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert("Ошибка", "Не удалось загрузить данные профиля");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogoutConfirm = async () => {
    try {
      await storage.clearAuth();
      setShowLogoutModal(false);
      router.replace("/login");
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert("Ошибка", "Не удалось выйти из аккаунта");
    }
  };

  // Форматирование имени (разделение на имя и фамилию)
  const getDisplayName = () => {
    if (!userData?.fullName) return "Пользователь";
    return userData.fullName;
  };

  // Определение типа контакта
  const getContactType = () => {
    if (userData?.phone) return "phone";
    if (userData?.email) return "email";
    return null;
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Загрузка...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!userData) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Данные пользователя не найдены</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
        <View style={styles.profileSection}>
          <Image source={require("@/assets/images/profile_image.png")} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>{getDisplayName()}</Text>
          <Text style={styles.status}>Статус: <Text style={styles.statusValue}>Проживающий</Text></Text>
          {getContactType() === 'email' && (
            <Text style={styles.email}>{userData.email}</Text>
          )}
          {getContactType() === 'phone' && (
            <Text style={styles.phone}>{userData.phone}</Text>
          )}
        </View>

        
        <View style={styles.infoBlock} >
          {userData.address && (
            <TouchableOpacity style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#fff" />
              <Text style={styles.infoText}>Адрес:<Text style={styles.infoAdress}> {userData.address}</Text></Text>
            </TouchableOpacity>
          )}

          {userData.accountNumber && (
            <View style={styles.infoRow}>
              <MaterialIcons name="account-balance-wallet" size={20} color="#fff" />
              <Text style={styles.infoText}>Лицевой счет: <Text style={styles.infoNumber}>{userData.accountNumber}</Text></Text>
            </View>
          )}

          {userData.residentsCount !== null && (
            <View style={styles.infoLastRow} >
              <FontAwesome5 name="users" size={20} color="#fff" />
              <Text style={styles.infoText}>Кол-во проживающих: {userData.residentsCount}</Text>
            </View>
          )}
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


