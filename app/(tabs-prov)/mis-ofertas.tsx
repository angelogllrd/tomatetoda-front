import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import InfoRow from "@/components/InfoRow";
import StatsRow from "@/components/StatsRow";
import StatusBadge from "@/components/StatusBadge";
import api from "@/services/api";
import { formatearFecha, formatearMoneda } from "@/utils/formatters";
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

// TIPO DE DATOS
type EventInfo = {
  id: number;
  title: string;
  event_date: string;
  status: string;
  guests_count: number;
};

type Offer = {
  id: number;
  price: number;
  description: string;
  status: "pendiente" | "aceptada" | "rechazada" | "caducada";
  event: EventInfo;
};

export default function MisOfertasScreen() {
  const router = useRouter();

  // ESTADOS
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // OBTENER DATOS DEL BACKEND
  const fetchOffers = async () => {
    try {
      const response = await api.get("/mis-offers");
      setOffers(response.data.offers);
    } catch (error) {
      console.error("Error al cargar mis ofertas:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOffers();
    }, []),
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchOffers();
  };

  // LÓGICA DE ESTADÍSTICAS Y FORMATO
  const total = offers.length;
  const pendientes = offers.filter((o) => o.status === "pendiente").length;
  const aceptadas = offers.filter((o) => o.status === "aceptada").length;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E8321E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* TÍTULO DE LA PANTALLA */}
      <Text style={styles.screenTitle}>Mis ofertas</Text>

      {/* ESTADÍSTICAS */}
      <View style={styles.statsContainer}>
        <StatsRow
          stats={[
            { label: "Total", value: total },
            { label: "Pendientes", value: pendientes },
            { label: "Aceptadas", value: aceptadas },
          ]}
        />
      </View>

      {/* LISTADO DE OFERTAS */}
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
        {offers.length === 0 ? (
          <EmptyState
            title="Sin ofertas"
            subtitle="Aún no enviaste ninguna propuesta a los organizadores."
          />
        ) : (
          offers.map((oferta) => (
            <Card
              key={oferta.id}
              style={
                oferta.status === "caducada" ? { opacity: 0.5 } : undefined
              }
              onPress={() =>
                router.push(`/detalle-oferta-proveedor/${oferta.id}` as any)
              }
            >
              {/* FILA DE TÍTULO Y ESTADO */}
              <View style={styles.cardHeaderRow}>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {oferta.event.title}
                </Text>
                <StatusBadge status={oferta.status} />
              </View>

              {/* FECHA Y PERSONAS */}
              <InfoRow
                icon="calendar-outline"
                text={`${formatearFecha(oferta.event.event_date)} · ${oferta.event.guests_count} personas`}
                style={{ marginBottom: 16 }}
              />

              {/* FILA DE PRECIO */}
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Tu precio</Text>
                <Text style={styles.priceValue}>
                  {formatearMoneda(oferta.price)}
                </Text>
              </View>

              {/* CUADRO DE DESCRIPCIÓN */}
              {oferta.description ? (
                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionText} numberOfLines={2}>
                    {oferta.description}
                  </Text>
                </View>
              ) : null}

              {/* BOTÓN VER OFERTA */}
              <View style={styles.cardFooter}>
                <View style={styles.verOfertaBtn}>
                  <Text style={styles.verOfertaText}>Ver oferta</Text>
                  <Ionicons name="chevron-forward" size={14} color="#E8321E" />
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
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  // ESTADÍSTICAS
  statsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },

  // TARJETAS
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    flex: 1,
    paddingRight: 12,
  },

  // PRECIO Y DESCRIPCIÓN
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#888",
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E8321E",
  },
  descriptionBox: {
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  // FOOTER
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  verOfertaBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  verOfertaText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E8321E",
    marginRight: 2,
  },
});
