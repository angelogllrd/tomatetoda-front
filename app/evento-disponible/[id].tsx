import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Datos simulados (En la vida real esto viene del backend usando el 'id')
const mockEventData = {
  id: "e3",
  title: "Reunión Anual de Socios",
  date: "3 de julio de 2026",
  location: "Piso 12, Torre Catalinas, CABA",
  people: 40,
  description:
    "Vino tinto y blanco, agua con y sin gas, jugos y sodas para acompañar cena de negocios.",
  organizer: "Juan Pérez",
};

export default function EventoDisponibleScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Acá podríamos buscar el evento en un array usando el 'id',
  // pero para la maqueta usamos el mockEventData directamente.
  const event = mockEventData;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{event.title}</Text>
          <Text style={styles.headerSubtitle}>Organiza: {event.organizer}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* DETALLES DEL EVENTO */}
        <View style={styles.card}>
          <Text style={styles.sectionTag}>DETALLES DEL EVENTO</Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#AAA" />
            <Text style={styles.detailText}>{event.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#AAA" />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={20} color="#AAA" />
            <Text style={styles.detailText}>{event.people} personas</Text>
          </View>
        </View>

        {/* BEBIDAS SOLICITADAS */}
        <View style={styles.card}>
          <Text style={styles.sectionTag}>BEBIDAS SOLICITADAS</Text>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>

          <Text style={styles.footerNote}>
            Tu oferta debe cubrir todos los items listados.
          </Text>
        </View>

        {/* BOTÓN DE ACCIÓN */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/enviar-oferta/${id}` as any)}
        >
          <Text style={styles.primaryButtonText}>Enviar oferta de precio</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
    marginRight: 12,
    marginLeft: -4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 20,
  },
  sectionTag: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
    letterSpacing: 1,
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },

  descriptionBox: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },

  footerNote: {
    fontSize: 14,
    color: "#888",
  },

  primaryButton: {
    backgroundColor: "#E8321E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
