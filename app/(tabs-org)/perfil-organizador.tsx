import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ProfileDataRow from "@/components/ProfileDataRow";
import { useUserProfile } from "@/hooks/useUserProfile";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TIPO DE DATOS DEL USUARIO
type UserProfile = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

export default function PerfilOrganizadorScreen() {
  const router = useRouter();

  const { user, isLoading } = useUserProfile<UserProfile>();

  // LÓGICA DE CERRAR SESIÓN
  const handleLogout = async () => {
    try {
      // Le avisamos a Laravel que destruya el token en la base de datos
      await api.post("/logout");
    } catch (error) {
      console.error("Error cerrando sesión en el servidor:", error);
    } finally {
      // Pase lo que pase, borramos el token del celular y lo mandamos al login
      await AsyncStorage.removeItem("token");
      router.replace("/login");
    }
  };

  if (isLoading || !user) {
    return (
      <View
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#E8321E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* HEADER CON AVATAR */}
      <View style={styles.header}>
        <Avatar name={user.name} size="lg" style={{ marginRight: 16 }} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TARJETA DE DATOS PERSONALES */}
        <Card style={{ padding: 0 }}>
          <ProfileDataRow
            iconName="person-outline"
            label="Nombre"
            value={user.name}
          />
          <ProfileDataRow
            iconName="mail-outline"
            label="Email"
            value={user.email}
          />
          <ProfileDataRow
            iconName="call-outline"
            label="Teléfono"
            value={user.phone || "No especificado"}
            showDivider={false}
          />
        </Card>

        {/* BOTÓN CERRAR SESIÓN */}

        <Button
          title="Cerrar sesión"
          variant="danger"
          icon="log-out-outline"
          onPress={handleLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // CONTENEDORES PRINCIPALES
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  // ENCABEZADO Y AVATAR
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  role: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
});
