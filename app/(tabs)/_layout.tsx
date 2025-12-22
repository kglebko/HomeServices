import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';




export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#D64105',
        tabBarInactiveTintColor: '#DCDCDC',
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: 'Actay',
          fontSize: 11,
        },
      }}
      >

      <Tabs.Screen
        name="finance"
        options={{
          title: 'Финансы',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="requests"
        options={{
          title: 'Заявки',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

        <Tabs.Screen
            name="chats"
            options={{
                title: 'Чаты',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="chatbubble-outline" size={size} color={color} />
                ),
            }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
