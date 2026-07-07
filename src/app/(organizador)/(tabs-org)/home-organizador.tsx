import Avatar from "@/src/components/Avatar";
import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import EmptyState from "@/src/components/EmptyState";
import InfoRow from "@/src/components/InfoRow";
import StatsRow from "@/src/components/StatsRow";
import StatusBadge from "@/src/components/StatusBadge";
import api from "@/src/services/api";
import { formatearFecha } from "@/src/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
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
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.role}>Organizador</Text>
        </View>
        <Avatar name={userName} size="md" />
      </View>

      {/* CONTENIDO FIJO (Estadísticas, Botón y Título) */}
      <View style={styles.fixedContent}>
        <StatsRow
          style={{ marginBottom: 24 }}
          stats={[
            { label: "Eventos", value: stats.total },
            { label: "Pendientes", value: stats.pendientes },
            { label: "Cerrados", value: stats.cerrados },
          ]}
        />

        <Button
          title="Publicar nuevo evento"
          icon="add"
          onPress={() => router.push("/publicar-evento")}
        />

        <Text style={styles.sectionTitle}>Mis eventos</Text>
      </View>

      {/* SCROLLVIEW ÚNICAMENTE PARA LAS TARJETAS DE EVENTOS */}
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
        {eventos.length === 0 ? (
          <EmptyState
            title="Aún no publicaste eventos"
            subtitle="Publicá tu primer evento y empezá a recibir ofertas"
          />
        ) : (
          eventos.map((evento) => (
            <Card
              key={evento.id}
              onPress={() => router.push(`/detalle-evento/${evento.id}`)}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{evento.title}</Text>
                <StatusBadge status={evento.status} />
              </View>

              <InfoRow
                icon="calendar-outline"
                text={formatearFecha(evento.event_date)}
              />

              <InfoRow icon="location-outline" text={evento.location} />

              <InfoRow
                icon="people-outline"
                text={`${evento.guests_count} personas`}
              />

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
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // CONTENEDORES GLOBALES
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
  fixedContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // ENCABEZADO Y PERFIL
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

  // TÍTULO DE SECCIÓN
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 16,
    marginTop: 16,
  },

  // TARJETAS DE EVENTOS
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
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
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
