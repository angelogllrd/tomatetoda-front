import Button from "@/components/Button";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TIPO DE DATOS DEL USUARIO
type ProviderProfile = {
  name: string;
  email: string;
  phone: string;
  company_name: string;
};

export default function PerfilProveedorScreen() {
  const router = useRouter();

  // ESTADOS
  const [user, setUser] = useState<ProviderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // OBTENER DATOS DEL BACKEND
  const fetchUserData = async () => {
    try {
      const response = await api.get("/user");
      setUser(response.data);
    } catch (error) {
      console.error("Error al cargar el perfil de proveedor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, []),
  );

  // LÓGICA DE CERRAR SESIÓN
  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Error cerrando sesión en el servidor:", error);
    } finally {
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
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.company_name || "Proveedor"}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TARJETA DE DATOS PERSONALES */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#AAA"
              style={styles.infoIcon}
            />
            <View>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons
              name="business-outline"
              size={20}
              color="#AAA"
              style={styles.infoIcon}
            />
            <View>
              <Text style={styles.infoLabel}>Negocio / empresa</Text>
              <Text style={styles.infoValue}>
                {user.company_name || "No especificado"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#AAA"
              style={styles.infoIcon}
            />
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#AAA"
              style={styles.infoIcon}
            />
            <View>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>
                {user.phone || "No especificado"}
              </Text>
            </View>
          </View>
        </View>

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
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8321E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
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

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  infoIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: "#AAA",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#111",
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
  },
});
