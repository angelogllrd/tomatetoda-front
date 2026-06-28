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
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Definimos la estructura de los datos que vienen del backend
type Evento = {
  id: number;
  title: string;
  event_date: string;
  location: string;
  guests_count: number;
  status: "abierto" | "cerrado";
  newOffersCount: number;
  acceptedOfferAmount: string | number | null;
};

type ResumenStats = {
  total: number;
  pendientes: number;
  cerrados: number;
};

export default function HomeOrganizadorScreen() {
  const router = useRouter();

  // ESTADOS DE LA PANTALLA
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [stats, setStats] = useState<ResumenStats>({
    total: 0,
    pendientes: 0,
    cerrados: 0,
  });
  const [userName, setUserName] = useState<string>("Organizador");

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // FUNCIÓN PARA OBTENER DATOS DEL BACKEND
  const fetchDatos = async () => {
    try {
      // Hacemos las 3 peticiones en paralelo para que cargue más rápido
      const [eventsRes, statsRes, userRes] = await Promise.all([
        api.get("/mis-events"),
        api.get("/mis-estadisticas"),
        api.get("/user"),
      ]);

      setEventos(eventsRes.data.events);
      setStats(statsRes.data.resumen);

      // Tomamos el primer nombre de la persona (ej: "María Pérez" -> "María")
      const primerNombre = userRes.data.name.split(" ")[0];
      setUserName(primerNombre);
    } catch (error) {
      console.error("Error al cargar la home:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // useFocusEffect recarga los datos cada vez que entramos a esta pestaña
  useFocusEffect(
    useCallback(() => {
      fetchDatos();
    }, []),
  );

  // Función para estirar hacia abajo y recargar manual
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchDatos();
  };

  // Formateador de fechas (De "2026-07-15" a "15 jul 2026")
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
        {/* ENCABEZADO Y PERFIL */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola,</Text>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.role}>Organizador</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* ESTADÍSTICAS (MOLÉCULAS) */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Eventos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.pendientes}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.cerrados}</Text>
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
        {eventos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Aún no publicaste eventos</Text>
            <Text style={styles.emptySubtitle}>
              Publicá tu primer evento y empezá a recibir ofertas
            </Text>
          </View>
        ) : (
          eventos.map((evento) => (
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
                    evento.status === "abierto"
                      ? styles.badgeOpen
                      : styles.badgeClosed,
                  ]}
                >
                  {evento.status.charAt(0).toUpperCase() +
                    evento.status.slice(1)}
                </Text>
              </View>

              <View style={styles.eventInfoRow}>
                <Ionicons name="calendar-outline" size={16} color="#999" />
                <Text style={styles.eventInfoText}>
                  {formatearFecha(evento.event_date)}
                </Text>
              </View>
              <View style={styles.eventInfoRow}>
                <Ionicons name="location-outline" size={16} color="#999" />
                <Text style={styles.eventInfoText}>{evento.location}</Text>
              </View>
              <View style={styles.eventInfoRow}>
                <Ionicons name="people-outline" size={16} color="#999" />
                <Text style={styles.eventInfoText}>
                  {evento.guests_count} personas
                </Text>
              </View>

              {/* FOOTER */}
              <View style={styles.eventFooter}>
                {evento.status === "cerrado" ? (
                  evento.acceptedOfferAmount ? (
                    <Text style={styles.acceptedOfferText}>
                      Oferta aceptada: ${evento.acceptedOfferAmount}
                    </Text>
                  ) : (
                    <Text style={styles.expiredFooterText}>
                      Evento caducado
                    </Text>
                  )
                ) : evento.newOffersCount > 0 ? (
                  <Text style={styles.newOfferText}>
                    {evento.newOffersCount}{" "}
                    {evento.newOffersCount === 1 // Controlo el singular/plural
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
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
  emptyState: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },

  // TARJETAS DE EVENTOS
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
  eventInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    // paddingTop: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8321E",
    justifyContent: "center",
    alignItems: "center",
  },

  // BOTONES Y ETIQUETAS (BADGES)
  publishButton: {
    flexDirection: "row",
    backgroundColor: "#E8321E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
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

  // TEXTOS Y TIPOGRAFÍAS
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
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
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
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    flex: 1,
    paddingRight: 8,
  },
  eventInfoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
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
  expiredFooterText: {
    fontSize: 14,
    color: "#AAA",
    fontWeight: "500",
  },
});
