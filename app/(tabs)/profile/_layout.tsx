import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable, View } from "react-native";

export default function ProfileLayout() {
  return (
     <Stack
      screenOptions={{
        headerShown: true,
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

    
      <Stack.Screen
        name="index"
        options={{ 
          title: 'Профиль',

        headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
        headerLeft: () => (
              <Ionicons
                name="person"
                size={24}
                color="#D64105"
                style={{ marginLeft: 105}}
              />
            ),

        }}
      />
      
      <Stack.Screen
        name="addCard"
        options={{ 
          title: 'Добавление карты',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                onPress={() => router.back()}
                style={{ paddingHorizontal: 0 }}
              >
                <Ionicons name="chevron-back" size={24} color="#D64105" />
              </Pressable>
              <Ionicons
                name="card"
                size={24}
                color="#D64105"
                style={{ marginLeft: 30 }} // Отступ между иконками
              />
            </View>
          ),
          gestureEnabled: false,
          headerBackVisible: false,
        
        }}
      />
      


      <Stack.Screen
        name="addCard2"
        options={{ 
          title: 'Добавление карты',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                onPress={() => router.back()}
                style={{ paddingHorizontal: 0 }}
              >
                <Ionicons name="chevron-back" size={24} color="#D64105" />
              </Pressable>
              <Ionicons
                name="card"
                size={24}
                color="#D64105"
                style={{ marginLeft: 30 }} // Отступ между иконками
              />
            </View>
          ),
          gestureEnabled: false,
          headerBackVisible: false,
        
        }}
      />

        
       <Stack.Screen
        name="enterCode"
        options={{ 
          title: '',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                onPress={() => router.back()}
                style={{ paddingHorizontal: 0 }}
              >
                <Ionicons name="chevron-back" size={24} color="#D64105" />
              </Pressable>
              
            </View>
          ),
          gestureEnabled: false,
          headerBackVisible: false,
        
        }}
      />   



      <Stack.Screen
        name="enterCode2"
        options={{ 
          title: '',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                onPress={() => router.back()}
                style={{ paddingHorizontal: 0 }}
              >
                <Ionicons name="chevron-back" size={24} color="#D64105" />
              </Pressable>
              
            </View>
          ),
          gestureEnabled: false,
          headerBackVisible: false,
        
        }}
      />   



      <Stack.Screen
        name="changePassword"
        options={{ 
          title: 'Смена пароля',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                onPress={() => router.back()}
                style={{ paddingHorizontal: 0 }}
              >
                <Ionicons name="chevron-back" size={24} color="#D64105" />
              </Pressable>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color="#D64105"
                style={{ marginLeft: 55 }} // Отступ между иконками
              />
            </View>
          ),
          gestureEnabled: false,
          headerBackVisible: false,
        
        }}
      />
      

      <Stack.Screen
        name="forgotPassword"
        options={{ 
          title: 'Забыли пароль',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                onPress={() => router.back()}
                style={{ paddingHorizontal: 0 }}
              >
                <Ionicons name="chevron-back" size={24} color="#D64105" />
              </Pressable>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color="#D64105"
                style={{ marginLeft: 55 }} // Отступ между иконками
              />
            </View>
          ),
          gestureEnabled: false,
          headerBackVisible: false,
        
        }}
      />


      <Stack.Screen
        name="changeForgotPassword"
        options={{ 
          title: 'Смена пароля',
          headerTitleStyle: {
            fontFamily: 'Actay-Bold',
            fontSize: 16,
          },
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                onPress={() => router.back()}
                style={{ paddingHorizontal: 0 }}
              >
                <Ionicons name="chevron-back" size={24} color="#D64105" />
              </Pressable>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color="#D64105"
                style={{ marginLeft: 55 }} // Отступ между иконками
              />
            </View>
          ),
          gestureEnabled: false,
          headerBackVisible: false,
        
        }}
      />
      
      
    </Stack>
    
  );
}