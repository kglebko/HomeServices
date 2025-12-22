import { ScreenContainer } from "@/components/ScreenContainer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function ScanQRScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = () => {
    router.push('/login/QRScannerScreen');
  };

  // Запрос разрешений на камеру и переход к сканеру
  const requestCameraPermission = async () => {
    // Переходим к экрану сканера QR-кода
    setIsScanning(true);
    
    // Небольшая задержка для плавного перехода
    setTimeout(() => {
      setIsScanning(false);
      router.push('/login/QRScannerScreen');
    }, 300);
  };

  // Переход к обычному логину
  const goToRegularLogin = () => {
    router.push("/login");
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}  >
       
          {/* Заголовок */}
          <View style={styles.header}>
            <Text style={styles.title}>Сканировать{"\n"}QR-код</Text>
            <Text style={styles.subtitle}>
              Чтобы зайти в аккаунт, просканируй{"\n"}QR-код с жировки
            </Text>
          </View>

          {/* QR-код иконка / область сканирования */}
          <View style={styles.qrContainer}>
            <View style={styles.qrFrame}>
              {isScanning ? (
                <ActivityIndicator size="large" color="#D64105" />
              ) : (
                <View style={styles.qrIconContainer}>
                  <View style={styles.qrIconBackground}>
                    <Ionicons name="qr-code" size={120} color="#D64105" />
                  </View>
                  
                  {/* Угловые элементы рамки QR-кода */}
                  <View style={[styles.corner, styles.cornerTopLeft]} />
                  <View style={[styles.corner, styles.cornerTopRight]} />
                  <View style={[styles.corner, styles.cornerBottomLeft]} />
                  <View style={[styles.corner, styles.cornerBottomRight]} />
                </View>
              )}
            </View>
            
            <Text style={styles.qrHint}>
              Наведите камеру на QR-код{'\n'}на квитанции об оплате
            </Text>
          </View>

          {/* Кнопка сканирования */}
          <TouchableOpacity
            style={[
              styles.scanButton,
              isScanning && styles.scanButtonDisabled
            ]}
            onPress={requestCameraPermission}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <ActivityIndicator size="small" color="#fff" style={styles.buttonSpinner} />
                <Text style={styles.scanButtonText}>Запрос разрешений...</Text>
              </>
            ) : (
              <>
                <Ionicons name="camera" size={24} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.scanButtonText}>Сканировать QR-код</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Разделитель */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>или</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Альтернативный вариант входа */}
          <TouchableOpacity
            style={styles.alternativeButton}
            onPress={goToRegularLogin}
          >
            <Ionicons name="log-in" size={20} color="#D64105" style={styles.alternativeIcon} />
            <Text style={styles.alternativeButtonText}>Войти по логину и паролю</Text>
            <Ionicons name="chevron-forward" size={16} color="#D64105" />
          </TouchableOpacity>

          {/* Информация о QR-коде */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={16} color="#666" />
            <Text style={styles.infoText}>
              QR-код находится в правом верхнем углу квитанции
            </Text>
          </View>

          {/* Пример квитанции */}
          <TouchableOpacity 
            style={styles.receiptExample}
            onPress={() => Alert.alert("Пример", "Здесь можно показать пример квитанции с QR-кодом")}
          >
            <Ionicons name="document-text" size={20} color="#D64105" />
            <Text style={styles.receiptText}>Как выглядит QR-код на квитанции?</Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </TouchableOpacity>
        
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    
    paddingTop: 60,
   
  },
  header: {
    marginTop:60,
    marginBottom: 40,
  },
  title: {
    color: "#fff",
    fontSize: 36,
    fontFamily: "Actay-Bold",
    textAlign: "left",
    marginBottom: 16,
  },
  subtitle: {
    color: "#D64105",
    fontSize: 18,
    fontFamily: "Actay-Bold",
    textAlign: "left",
    lineHeight: 24,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  qrFrame: {
    width: 280,
    height: 280,
    backgroundColor: "#2b2b2b",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#3A3A3A",
    position: "relative",
  },
  qrIconContainer: {
    position: "relative",
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  qrIconBackground: {
    width: 160,
    height: 160,
    backgroundColor: "rgba(214, 65, 5, 0.1)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(214, 65, 5, 0.3)",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#D64105",
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  qrHint: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Actay",
    textAlign: "center",
    lineHeight: 22,
  },
  scanButton: {
    backgroundColor: "#D64105",
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  scanButtonDisabled: {
    backgroundColor: "#444",
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonSpinner: {
    marginRight: 12,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Actay",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#3A3A3A",
  },
  separatorText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Actay",
    marginHorizontal: 16,
  },
  alternativeButton: {
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  alternativeIcon: {
    marginRight: 12,
  },
  alternativeButtonText: {
    color: "#D64105",
    fontSize: 16,
    fontFamily: "Actay-Bold",
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  infoText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Actay",
    marginLeft: 8,
    textAlign: "center",
    lineHeight: 18,
  },
  receiptExample: {
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  receiptText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Actay",
    flex: 1,
    marginLeft: 12,
  },
});

