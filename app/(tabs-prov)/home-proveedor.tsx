import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TIPOS DE DATOS
type EventoDisponible = {
  id: number;
  title: string;
  date: string;
  location: string;
  people: number;
  description: string;
  organizer: string;
};

type ProviderProfile = {
  name: string;
  company_name: string;
};

export default function HomeProveedorScreen() {
  const router = useRouter();

  // ESTADOS
  const [eventos, setEventos] = useState<EventoDisponible[]>([]);
  const [user, setUser] = useState<ProviderProfile>({
    name: "Proveedor",
    company_name: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // OBTENER DATOS DEL BACKEND
  const fetchDatos = async () => {
    try {
      const [eventsRes, userRes] = await Promise.all([
        api.get("/events-available"),
        api.get("/user"),
      ]);
      setEventos(eventsRes.data.events);
      setUser({
        name: userRes.data.name.split(" ")[0], // Primer nombre
        company_name: userRes.data.company_name || "Mi Empresa",
      });
    } catch (error) {
      console.error("Error cargando home de proveedor:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDatos();
    }, []),
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchDatos();
  };

  // LÓGICA DE FILTRADO Y FECHAS
  const filteredEvents = eventos.filter(
    (evento) =>
      evento.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evento.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getDaysRemaining = (dateString: string) => {
    const eventDate = new Date(dateString + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Mañana";
    return `${diffDays}d restantes`;
  };

  const formatearFecha = (fechaString: string) => {
    const [year, month, day] = fechaString.split("-");
    const meses = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];
    return `${day} ${meses[parseInt(month, 10) - 1]} ${year}`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E8321E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* HEADER DE BIENVENIDA */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.company_name}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* BUSCADOR */}
      <View style={styles.searchContainer}>
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#E8321E"]}
          />
        }
      >
        {filteredEvents.length === 0 ? (
          /* ESTADO VACÍO (SIN RESULTADOS) */
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateTitle}>Sin resultados</Text>
            <Text style={styles.emptyStateSub}>
              No hay eventos disponibles para ofertar.
            </Text>
          </View>
        ) : (
          filteredEvents.map((evento) => (
            /* TARJETA DE EVENTO */
            <TouchableOpacity
              key={evento.id}
              style={styles.eventCard}
              onPress={() =>
                router.push(`/evento-disponible/${evento.id}` as any)
              }
            >
              <View style={styles.eventHeaderRow}>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {evento.title}
                </Text>
                <Text style={styles.daysRemaining}>
                  {getDaysRemaining(evento.date)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#AAA" />
                <Text style={styles.infoText}>
                  {formatearFecha(evento.date)}
                </Text>
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
  // CONTENEDORES PRINCIPALES
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // ENCABEZADO
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
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

  // BUSCADOR Y LISTA
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

  // TARJETAS
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

  // CONTENIDO DE LA TARJETA
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
