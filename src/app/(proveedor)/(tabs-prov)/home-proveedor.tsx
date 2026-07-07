import Avatar from "@/src/components/Avatar";
import Card from "@/src/components/Card";
import EmptyState from "@/src/components/EmptyState";
import InfoRow from "@/src/components/InfoRow";
import api from "@/src/services/api";
import { formatearFecha, getDaysRemaining } from "@/src/utils/formatters";
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
        <Avatar name={user.name} size="md" />
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
          <EmptyState
            title="Sin resultados"
            subtitle="No hay eventos disponibles para ofertar."
          />
        ) : (
          filteredEvents.map((evento) => (
            /* TARJETA DE EVENTO */
            <Card
              key={evento.id}
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

              <InfoRow
                icon="calendar-outline"
                text={formatearFecha(evento.date)}
              />

              <InfoRow icon="location-outline" text={evento.location} />

              <InfoRow
                icon="people-outline"
                text={`${evento.people} personas`}
              />

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
            </Card>
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
