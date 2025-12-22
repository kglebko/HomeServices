// screens/QRScannerScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { Camera, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function QRScannerScreen() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  
  // Реф для камеры
  const cameraRef = useRef<Camera>(null);

  // Используем хук для разрешений
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      if (permission) {
        if (permission.granted) {
          setHasPermission(true);
        } else if (permission.canAskAgain) {
          const { granted } = await requestPermission();
          setHasPermission(granted);
        } else {
          setHasPermission(false);
        }
        setIsLoading(false);
      }
    })();
  }, [permission]);

  // Функция для переключения фонарика
  const toggleTorch = async () => {
    if (cameraRef.current) {
      try {
        // Включаем/выключаем фонарик
        const newTorchState = !torchOn;
        await cameraRef.current.torchAsync(torchOn);
        setTorchOn(newTorchState);
      } catch (error) {
        console.log('Ошибка переключения фонарика:', error);
        Alert.alert(
          'Фонарик недоступен', 
          'На вашем устройстве может не быть фонарика или он не поддерживается'
        );
      }
    } else {
      setTorchOn(!torchOn);
    }
  };

  // Функция для переключения камеры (задняя/передняя)
  const toggleCameraType = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    // Добавляем вибро-фидбек
    if (Platform.OS !== 'web') {
      Vibration.vibrate(100);
    }
    
    console.log(`QR-код сканирован! Тип: ${type}, Данные: ${data}`);
    
    // Обработка данных QR-кода
    processQRCodeData(data);
  };

  const processQRCodeData = (data: string) => {
    try {
      // Проверяем, является ли это URL
      if (data.startsWith('http://') || data.startsWith('https://')) {
        Alert.alert(
          "QR-код содержит ссылку",
          "Хотите перейти по этой ссылке?",
          [
            { text: "Нет", onPress: () => setScanned(false), style: "cancel" },
            { text: "Да", onPress: () => {
              Linking.openURL(data);
              setTimeout(() => router.back(), 1000);
            }}
          ]
        );
      } else if (data.includes('bill') || data.includes('receipt') || data.includes('payment')) {
        // Пример обработки QR-кода жировки
        Alert.alert(
          "Жировка найдена!",
          "QR-код успешно отсканирован. Загружаем информацию...",
          [
            { 
              text: "OK", 
              onPress: () => {
                // Здесь будет переход к деталям жировки
                // Например: router.push(`/bill/${data}`);
                // А пока просто возвращаемся назад
                router.back();
              }
            }
          ]
        );
      } else {
        // Просто показываем данные
        Alert.alert(
          "QR-код отсканирован",
          `Данные: ${data.substring(0, 100)}${data.length > 100 ? '...' : ''}`,
          [
            { 
              text: "Сканировать ещё", 
              onPress: () => setScanned(false) 
            },
            { 
              text: "Готово", 
              onPress: () => router.back() 
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось обработать QR-код");
      setScanned(false);
    }
  };

  const handleManualEntry = () => {
    Alert.prompt(
      "Введите код вручную",
      "Введите номер жировки или данные из QR-кода:",
      [
        { text: "Отмена", style: "cancel" },
        { 
          text: "OK", 
          onPress: (text) => {
            if (text && text.trim().length > 0) {
              processQRCodeData(text);
            }
          }
        }
      ],
      'plain-text'
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#D64105" />
        <Text style={styles.loadingText}>Проверка разрешений...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="camera-off" size={80} color="#D64105" style={styles.icon} />
        <Text style={styles.permissionText}>Нет доступа к камере</Text>
        <Text style={styles.permissionSubtext}>
          Для сканирования QR-кода необходимо разрешить доступ к камере
        </Text>
        
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Разрешить камеру</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.alternativeButton}
          onPress={handleManualEntry}
        >
          <Text style={styles.alternativeButtonText}>Ввести код вручную</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Вернуться назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera>
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        type={facing}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        // Настройки камеры для лучшего сканирования
        autoFocus="on"
        zoom={0}
        whiteBalance="auto"
        ratio="16:9"
      </Camera>
      
      {/* Overlay с рамкой для сканирования */}
      <View style={styles.overlay}>
        <View style={styles.scanFrame}>
          {/* Угловые элементы рамки */}
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
        
        <Text style={styles.scanText}>Наведите камеру на QR-код</Text>
        <Text style={styles.scanHint}>QR-код автоматически отсканируется</Text>
        
        {scanned && (
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => setScanned(false)}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.rescanButtonText}>Сканировать снова</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Верхняя панель */}
      <View style={styles.topControls}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
        
        {/* Индикатор фонарика (если включен) */}
        {torchOn && (
          <View style={styles.torchIndicator}>
            <Ionicons name="flashlight" size={16} color="#FFD700" />
            <Text style={styles.torchIndicatorText}>Фонарик</Text>
          </View>
        )}
      </View>
      
      {/* Нижняя панель */}
      <View style={styles.bottomControls}>
        <TouchableOpacity 
          style={styles.manualButton}
          onPress={handleManualEntry}
        >
          <Ionicons name="keypad" size={24} color="#fff" />
          <Text style={styles.manualButtonText}>Вручную</Text>
        </TouchableOpacity>
        
        {/* Кнопка фонарика */}
        <TouchableOpacity 
          style={[styles.flashButton, torchOn && styles.flashButtonActive]}
          onPress={toggleTorch}
        >
          <Ionicons 
            name={torchOn ? "flashlight" : "flashlight-outline"} 
            size={28} 
            color={torchOn ? "#FFD700" : "#fff"} 
          />
        </TouchableOpacity>
        
        {/* Кнопка переключения камеры */}
        <TouchableOpacity 
          style={styles.cameraToggleButton}
          onPress={toggleCameraType}
        >
          <Ionicons name="camera-reverse" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Actay',
    marginTop: 20,
  },
  icon: {
    marginBottom: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Actay-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionSubtext: {
    color: '#999',
    fontSize: 16,
    fontFamily: 'Actay',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#D64105',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Actay-Bold',
  },
  alternativeButton: {
    backgroundColor: '#2b2b2b',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  alternativeButtonText: {
    color: '#D64105',
    fontSize: 16,
    fontFamily: 'Actay-Bold',
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  backButtonText: {
    color: '#999',
    fontSize: 16,
    fontFamily: 'Actay',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
    marginBottom: 40,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#D64105',
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
  scanText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Actay-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scanHint: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Actay',
    textAlign: 'center',
    marginBottom: 30,
  },
  rescanButton: {
    backgroundColor: 'rgba(214, 65, 5, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  rescanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Actay',
    marginLeft: 8,
  },
  topControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  torchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  torchIndicatorText: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Actay',
    marginLeft: 8,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flashButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  manualButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  manualButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Actay',
    marginLeft: 8,
  },
  cameraToggleButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});