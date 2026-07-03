import Button from "@/components/Button";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TIPO DE DATOS
type OfferDetail = {
  id: number;
  price: number;
  description: string;
  status: "pendiente" | "aceptada" | "rechazada" | "caducada";
  event: {
    id: number;
    title: string;
    event_date: string;
    location: string;
    guests_count: number;
    requirements: string;
    user: {
      name: string;
    };
  };
};

export default function DetalleOfertaProveedorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // ESTADOS
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // CARGAR DATOS
  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const response = await api.get(`/offers/${id}`);
        setOffer(response.data.offer);
      } catch (error) {
        console.error("Error cargando detalle de la oferta:", error);
        Alert.alert("Error", "No se pudo cargar la información de la oferta.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOfferDetails();
  }, [id]);

  // FORMATEADORES
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

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatearFecha = (fechaString: string) => {
    const [year, month, day] = fechaString.split("-");
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return `${parseInt(day, 10)} de ${meses[parseInt(month, 10) - 1]} de ${year}`;
  };

  const formatearMoneda = (monto: number) => {
    return "$" + monto.toLocaleString("es-AR");
  };

  if (isLoading || !offer) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E8321E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {offer.event.title}
          </Text>
          <Text style={styles.headerSubtitle}>
            Organiza: {offer.event.user?.name || "Organizador"}
          </Text>
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
            <Text style={styles.detailText}>
              {formatearFecha(offer.event.event_date)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#AAA" />
            <Text style={styles.detailText}>{offer.event.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={20} color="#AAA" />
            <Text style={styles.detailText}>
              {offer.event.guests_count} personas
            </Text>
          </View>
        </View>

        {/* BEBIDAS SOLICITADAS */}
        <View style={styles.card}>
          <Text style={styles.sectionTag}>BEBIDAS SOLICITADAS</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              {offer.event.requirements}
            </Text>
          </View>
          <Text style={styles.footerNote}>
            Tu oferta debe cubrir todos los items listados.
          </Text>
        </View>

        {/* MI OFERTA */}
        {/* Si está aceptada, le sumamos el estilo 'acceptedCard' para el borde verde */}
        <View
          style={[
            styles.card,
            offer.status === "aceptada" && styles.acceptedCard,
          ]}
        >
          <View style={styles.offerHeaderRow}>
            <Text style={styles.offerTitle}>Mi oferta</Text>
            <Text
              style={[
                styles.statusBadge,
                { color: getStatusColor(offer.status) },
              ]}
            >
              {getStatusText(offer.status)}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Precio ofertado</Text>
            <Text style={styles.priceValue}>
              {formatearMoneda(offer.price)}
            </Text>
          </View>

          {offer.description ? (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>{offer.description}</Text>
            </View>
          ) : null}

          {/* BOTÓN CONDICIONAL */}
          {offer.status === "aceptada" && (
            <Button
              title="Ver datos del organizador"
              variant="success"
              icon="chevron-forward"
              iconPosition="right"
              onPress={() => router.push(`/datos-organizador/${id}` as any)}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 16,
  },
  acceptedCard: {
    borderColor: "#BBF7D0",
    borderWidth: 1,
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
    marginBottom: 12,
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

  offerHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: "500",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
  },
  priceValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E8321E",
  },
});
