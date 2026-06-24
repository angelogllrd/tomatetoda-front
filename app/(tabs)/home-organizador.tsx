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

// Datos simulados (Mock Data) - Reemplazo temporal del Backend
const mockEvents = [
  {
    id: "1",
    title: "Cumpleaños de Sofía",
    date: "15 jul 2026",
    location: "Av. Corrientes 1234, CABA",
    people: 50,
    status: "Cerrado",
    acceptedOfferAmount: "$45.000",
  },
  {
    id: "2",
    title: "Casamiento García-López",
    date: "20 ago 2026",
    location: "Salón Los Jardines, Palermo",
    people: 150,
    status: "Abierto",
    newOffersCount: 1,
  },
];

export default function HomeOrganizadorScreen() {
  const router = useRouter();

  // ESTADISTICAS SOBRE DATOS SIMULADOS

  // 1. Calculamos el total de eventos
  const totalEvents = mockEvents.length;

  // 2. Sumamos todas las "nuevas ofertas" de los eventos (Pendientes)
  const pendingOffers = mockEvents.reduce(
    (total, evento) => total + (evento.newOffersCount || 0),
    0,
  );

  // 3. Calculamos los cerrados (si el status es "Cerrado" o si la fecha es de hoy o anterior)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reseteamos la hora para comparar solo el día

  const closedEvents = mockEvents.filter((evento) => {
    if (evento.status === "Cerrado") return true;

    // Convertimos un string como "15 jul 2026" a formato de Fecha (Date)
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
    const partes = evento.date.split(" ");

    if (partes.length === 3) {
      const fechaEvento = new Date(
        Number(partes[2]),
        meses[partes[1].toLowerCase()],
        Number(partes[0]),
      );
      // Si la fecha del evento es igual o anterior a hoy, cuenta como cerrado
      if (fechaEvento <= today) return true;
    }
    return false;
  }).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER PERFIL */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola,</Text>
            <Text style={styles.name}>Juan</Text>
            <Text style={styles.role}>Organizador</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
        </View>

        {/* ESTADÍSTICAS (MOLÉCULAS) */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalEvents}</Text>
            <Text style={styles.statLabel}>Eventos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{pendingOffers}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{closedEvents}</Text>
            <Text style={styles.statLabel}>Cerrados</Text>
          </View>
        </View>

        {/* BOTÓN PUBLICAR */}
        <TouchableOpacity
          style={styles.publishButton}
          onPress={() => router.push("/publicar-evento")}
        >
          <Ionicons
            name="add"
            size={24}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.publishButtonText}>Publicar nuevo evento</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Mis eventos</Text>

        {/* LISTADO DE EVENTOS */}
        {mockEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Aún no publicaste eventos</Text>
            <Text style={styles.emptySubtitle}>
              Publicá tu primer evento y empezá a recibir ofertas
            </Text>
          </View>
        ) : (
          mockEvents.map((evento) => (
            <TouchableOpacity
              key={evento.id}
              style={styles.eventCard}
              onPress={() => router.push(`/detalle-evento/${evento.id}`)}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{evento.title}</Text>
                <Text
                  style={[
                    styles.badge, // Etiqueta "Abierto" o "Cerrado" arriba a la derecha
                    evento.status === "Abierto"
                      ? styles.badgeOpen
                      : styles.badgeClosed,
                  ]}
                >
                  {evento.status}
                </Text>
              </View>

              <View style={styles.eventInfoRow}>
                <Ionicons name="calendar-outline" size={16} color="#999" />
                <Text style={styles.eventInfoText}>{evento.date}</Text>
              </View>
              <View style={styles.eventInfoRow}>
                <Ionicons name="location-outline" size={16} color="#999" />
                <Text style={styles.eventInfoText}>{evento.location}</Text>
              </View>
              <View style={styles.eventInfoRow}>
                <Ionicons name="people-outline" size={16} color="#999" />
                <Text style={styles.eventInfoText}>
                  {evento.people} personas
                </Text>
              </View>

              <View style={styles.eventFooter}>
                {evento.status === "Cerrado" ? (
                  <Text style={styles.acceptedOfferText}>
                    Oferta aceptada: {evento.acceptedOfferAmount}
                  </Text>
                ) : evento.newOffersCount && evento.newOffersCount > 0 ? (
                  <Text style={styles.newOfferText}>
                    {evento.newOffersCount}{" "}
                    {evento.newOffersCount === 1
                      ? "oferta nueva"
                      : "ofertas nuevas"}
                  </Text>
                ) : (
                  <Text style={styles.noOfferText}>Sin ofertas aún</Text>
                )}
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
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
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: "#999",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },
  role: {
    fontSize: 14,
    color: "#999",
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

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
  },

  publishButton: {
    flexDirection: "row",
    backgroundColor: "#E8321E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  publishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 16,
  },

  emptyState: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },

  eventCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    flex: 1,
    paddingRight: 8,
  },

  badge: {
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeOpen: {
    color: "#16A34A",
    backgroundColor: "#fff",
  },
  badgeClosed: {
    color: "#999",
    backgroundColor: "#fff",
  },

  eventInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eventInfoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },

  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    // paddingTop: 16,
  },
  noOfferText: {
    fontSize: 14,
    color: "#BBB",
  },
  newOfferText: {
    fontSize: 14,
    color: "#E8321E",
    fontWeight: "500",
  },
  acceptedOfferText: {
    fontSize: 14,
    color: "#16A34A",
    fontWeight: "500",
  },
});
