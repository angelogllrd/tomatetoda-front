import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfirmacionOfertaScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        {/* ÍCONO DE ÉXITO */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#16A34A" />
        </View>

        {/* TEXTOS */}
        <Text style={styles.title}>Oferta enviada</Text>
        <Text style={styles.subtitle}>
          El organizador verá tu propuesta. Si la acepta, recibirás sus datos de
          contacto.
        </Text>
      </View>

      {/* BOTONES DE ACCIÓN */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/(tabs-prov)/mis-ofertas")}
        >
          <Text style={styles.primaryButtonText}>Ver mis ofertas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(tabs-prov)/home-proveedor")}
        >
          <Text style={styles.secondaryButtonText}>Ver más eventos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 24,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 12,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  footer: {
    paddingBottom: 40,
  },

  primaryButton: {
    backgroundColor: "#E8321E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  secondaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "bold",
  },
});
