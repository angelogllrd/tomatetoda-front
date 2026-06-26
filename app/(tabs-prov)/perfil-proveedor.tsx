import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilProveedorScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Acá en el futuro borraríamos el Token guardado en el celular
    // Por ahora solo lo mandamos al login de vuelta
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* HEADER CON AVATAR */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>C</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>Carlos Rodríguez</Text>
          <Text style={styles.role}>Bebidas del Sur SRL</Text>
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
              <Text style={styles.infoValue}>Carlos Rodríguez</Text>
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
              <Text style={styles.infoValue}>Bebidas del Sur SRL</Text>
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
              <Text style={styles.infoValue}>carlos@demo.com</Text>
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
              <Text style={styles.infoValue}>+54 11 5555-0003</Text>
            </View>
          </View>
        </View>

        {/* BOTÓN CERRAR SESIÓN */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#C0392B"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
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

  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  logoutButtonText: {
    color: "#C0392B",
    fontSize: 16,
    fontWeight: "bold",
  },
});
