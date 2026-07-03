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

  // Función auxiliar para pintar el texto del estado según corresponda
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aceptada":
        return "#16A34A"; // Verde
      case "pendiente":
        return "#B45309"; // Naranja
      case "rechazada":
        return "#AAA"; // Gris
      case "caducada":
        return "#AAA"; // Gris
      default:
        return "#333";
    }
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
    return `${parseInt(day, 10)} ${meses[parseInt(month, 10) - 1]} ${year}`;
  };

  const formatearMoneda = (monto: number) => {
    return "$" + monto.toLocaleString("es-AR");
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
      {/* TÍTULO DE LA PANTALLA */}
      <Text style={styles.screenTitle}>Mis ofertas</Text>

      {/* ESTADÍSTICAS */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{pendientes}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{aceptadas}</Text>
          <Text style={styles.statLabel}>Aceptadas</Text>
        </View>
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
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateTitle}>Sin ofertas</Text>
            <Text style={styles.emptyStateSub}>
              Aún no enviaste ninguna propuesta a los organizadores.
            </Text>
          </View>
        ) : (
          offers.map((oferta) => (
            <TouchableOpacity
              key={oferta.id}
              style={[
                styles.offerCard,
                oferta.status === "caducada" && { opacity: 0.5 }, // Efecto sutil "apagado" para las caducadas
              ]}
              // Nos redirige al detalle interno de la oferta
              onPress={() =>
                router.push(`/detalle-oferta-proveedor/${oferta.id}` as any)
              }
            >
              {/* FILA DE TÍTULO Y ESTADO */}
              <View style={styles.cardHeaderRow}>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {oferta.event.title}
                </Text>
                <Text
                  style={[
                    styles.statusBadge,
                    { color: getStatusColor(oferta.status) },
                  ]}
                >
                  {oferta.status.charAt(0).toUpperCase() +
                    oferta.status.slice(1)}
                </Text>
              </View>

              {/* FECHA Y PERSONAS */}
              <View style={styles.subtitleRow}>
                <Ionicons name="calendar-outline" size={14} color="#AAA" />
                <Text style={styles.eventSubtitle}>
                  {" "}
                  {formatearFecha(oferta.event.event_date)} ·{" "}
                  {oferta.event.guests_count} personas
                </Text>
              </View>

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
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
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

  // ESTADO VACÍO
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

  // TARJETAS
  offerCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 16,
  },
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
  statusBadge: {
    fontSize: 14,
    fontWeight: "600",
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  eventSubtitle: {
    fontSize: 14,
    color: "#888",
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
