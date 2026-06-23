import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E8321E", // Rojo activo
        tabBarInactiveTintColor: "#AAAAAA", // Gris inactivo
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",
          elevation: 0, // Diseño plano sin sombras
          backgroundColor: "#fff",
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home-organizador"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil-organizador"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
