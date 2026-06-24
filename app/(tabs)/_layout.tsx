import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  // Obtenemos los márgenes seguros del dispositivo actual
  const insets = useSafeAreaInsets();

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
          // Le sumamos el margen seguro de abajo al alto total
          height: 60 + insets.bottom,
          // Si hay margen seguro (insets.bottom > 0) lo usamos, sino le dejamos 8px por defecto
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
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
