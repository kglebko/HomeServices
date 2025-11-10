import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

export default function FinanceScreen() {
  const cardColor = useThemeColor({}, 'cardBackground');
  const red = useThemeColor({}, 'accentRed');
  const textColor = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: background,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 4,
          paddingTop: 20,
        }}
      >
        <View
          style={{
            backgroundColor: cardColor,
            borderRadius: 10,
            padding: 16,
            alignItems: 'flex-start',
            marginHorizontal: 10,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          }}
        >
          <ThemedText style={{ fontSize: 12, color: textColor, marginBottom: 0  }}>
            Сумма платежа
          </ThemedText>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <ThemedText
              style={{
                fontSize: 36,
                fontWeight: '800',
                color: textColor,
                lineHeight: 40,
              }}
            >
              93,50
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 12,
                color: textColor,
                marginLeft: 4,
                marginBottom: 4,
              }}
            >
              руб.
            </ThemedText>
          </View>

          <ThemedText style={{ color: red, marginTop: 6 }}>Не оплачено</ThemedText>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: red,
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: 'center',
            marginHorizontal: 10,
            marginBottom: 40,
          }}
          activeOpacity={0.8}
        >
          <ThemedText style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Оплатить
          </ThemedText>
        </TouchableOpacity>

        <View style={{ gap: 20, marginHorizontal: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={22} color={red} />
            <ThemedText style={{ color: textColor, fontSize: 20, marginLeft: 8 }}>
              История платежей
            </ThemedText>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="reader-outline" size={22} color={red} />
            <ThemedText style={{ color: textColor, fontSize: 20, marginLeft: 8 }}>
              Предыдущие показания счетчиков
            </ThemedText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
