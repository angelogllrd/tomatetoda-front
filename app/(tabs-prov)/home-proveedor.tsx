import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Datos simulados de eventos DISPONIBLES (donde Carlos todavía no ofertó)
const mockAvailableEvents = [
  {
    id: "e3",
    title: "Reunión Anual de Socios",
    date: "3 jul 2026",
    location: "Piso 12, Torre Catalinas, CABA",
    people: 40,
    description:
      "Vino tinto y blanco, agua con y sin gas, jugos y sodas para acompañar cena de negocios.",
    organizer: "Juan Pérez",
  },
  {
    id: "e4",
    title: "Fiesta de Fin de Año",
    date: "15 dic 2026",
    location: "Salón Dorado, Belgrano",
    people: 200,
    description:
      "Barras móviles con tragos clásicos, cerveza tirada y bebidas sin alcohol.",
    organizer: "Sofía Martínez",
  },
];

export default function HomeProveedorScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Lógica para filtrar eventos con el buscador
  const filteredEvents = mockAvailableEvents.filter(
    (evento) =>
      evento.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evento.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Función para calcular días restantes
  const getDaysRemaining = (dateString: string) => {
    const meses: Record<string, number> = {
      ene: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dic: 11,
    };
    const partes = dateString.split(" ");

    if (partes.length === 3) {
      const fechaEvento = new Date(
        Number(partes[2]),
        meses[partes[1].toLowerCase()],
        Number(partes[0]),
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(fechaEvento.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return `${diffDays}d restantes`;
    }
    return "";
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* HEADER DE BIENVENIDA */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.name}>Carlos</Text>
          <Text style={styles.role}>Bebidas del Sur SRL</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>C</Text>
        </View>
      </View>

      {/* BUSCADOR */}
      <View style={styles.searchContainer}>
        {/* Mantenemos el ícono de lupa para mejor UX, aunque no haya texto */}
        <Ionicons
          name="search-outline"
          size={20}
          color="#AAA"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar eventos..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* ENCABEZADO DE LA LISTA */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Eventos disponibles</Text>
        <Text style={styles.eventCount}>{filteredEvents.length}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredEvents.length === 0 ? (
          /* ESTADO VACÍO (SIN RESULTADOS) */
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateTitle}>Sin resultados</Text>
            <Text style={styles.emptyStateSub}>Probá con otro término</Text>
          </View>
        ) : (
          filteredEvents.map((evento) => (
            /* TARJETA DE EVENTO COMPLETA CLIQUEABLE */
            <TouchableOpacity
              key={evento.id}
              style={styles.eventCard}
              onPress={() =>
                router.push(`/evento-disponible/${evento.id}` as any)
              }
            >
              <View style={styles.eventHeaderRow}>
                <Text style={styles.eventTitle}>{evento.title}</Text>
                <Text style={styles.daysRemaining}>
                  {getDaysRemaining(evento.date)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#AAA" />
                <Text style={styles.infoText}>{evento.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#AAA" />
                <Text style={styles.infoText}>{evento.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={16} color="#AAA" />
                <Text style={styles.infoText}>{evento.people} personas</Text>
              </View>

              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText} numberOfLines={2}>
                  {evento.description}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.organizerText}>Por {evento.organizer}</Text>
                <View style={styles.verEventoBtn}>
                  <Text style={styles.verEventoText}>Ver evento</Text>
                  <Ionicons name="chevron-forward" size={16} color="#E8321E" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: "#fff",
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: "#999",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },
  role: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8321E",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    height: 50,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111",
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  eventCount: {
    fontSize: 14,
    color: "#888",
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  emptyStateCard: {
    backgroundColor: "#fff",
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
    marginTop: 8,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  emptyStateSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },

  eventCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 16,
  },
  eventHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // si es mas largo el título probablemente se necesite flex-start
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    flex: 1,
    paddingRight: 8,
  },
  daysRemaining: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#AAA",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },

  descriptionBox: {
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  organizerText: {
    fontSize: 14,
    color: "#AAA",
  },
  verEventoBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  verEventoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E8321E",
    marginRight: 4,
  },
});
