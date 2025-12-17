import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function LoginLayout() {
  return (
     <Stack
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#1E1E1E' },
        headerTintColor: '#fff',
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <Pressable
              onPress={() => router.back()}
              style={{ paddingHorizontal: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color="#D64105" />
            </Pressable>
          ) : null,


      }}
    >

    <Stack.Screen name="index"/>
    <Stack.Screen name="scanQR"/>
  <Stack.Screen name="QRScannerScreen"/>
      
      
    </Stack>
    
  );
}