import Button from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfirmacionPublicacionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        {/* ÍCONO DE ÉXITO */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#16A34A" />
        </View>

        {/* TEXTOS */}
        <Text style={styles.title}>Evento publicado</Text>
        <Text style={styles.subtitle}>
          Tu evento ya está visible para los proveedores. Pronto recibirás
          ofertas.
        </Text>
      </View>

      {/* BOTONES DE ACCIÓN */}
      <View style={styles.footer}>
        <Button
          title="Ver mis eventos"
          onPress={() => router.replace("/(tabs-org)/home-organizador")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // CONTENEDORES PRINCIPALES
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
  footer: {
    paddingBottom: 40,
  },

  // TEXTOS Y TIPOGRAFÍAS
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
});
