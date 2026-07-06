import Button from "@/components/Button";
import Card from "@/components/Card";
import HeaderBackButton from "@/components/HeaderBackButton";
import InfoRow from "@/components/InfoRow";
import StatusBadge from "@/components/StatusBadge";
import api from "@/services/api";
import { formatearFecha, formatearMoneda } from "@/utils/formatters";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
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
      <HeaderBackButton
        title={offer.event.title}
        subtitle={`Organiza: ${offer.event.user?.name || "Organizador"}`}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* DETALLES DEL EVENTO */}
        <Card>
          <Text style={styles.sectionTag}>DETALLES DEL EVENTO</Text>

          <InfoRow
            icon="calendar-outline"
            text={formatearFecha(offer.event.event_date)}
            iconSize={18}
            iconColor="#666"
            textColor="#333"
            textSize={16}
          />

          <InfoRow
            icon="location-outline"
            text={offer.event.location}
            iconSize={18}
            iconColor="#666"
            textColor="#333"
            textSize={16}
          />

          <InfoRow
            icon="people-outline"
            text={`${offer.event.guests_count} personas`}
            iconSize={18}
            iconColor="#666"
            textColor="#333"
            textSize={16}
          />
        </Card>

        {/* BEBIDAS SOLICITADAS */}
        <Card>
          <Text style={styles.sectionTag}>BEBIDAS SOLICITADAS</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              {offer.event.requirements}
            </Text>
          </View>
          <Text style={styles.footerNote}>
            Tu oferta debe cubrir todos los items listados.
          </Text>
        </Card>

        {/* MI OFERTA */}
        <Card
          style={
            offer.status === "aceptada" ? { borderColor: "#BBF7D0" } : undefined
          }
        >
          <View style={styles.offerHeaderRow}>
            <Text style={styles.offerTitle}>Mi oferta</Text>
            <StatusBadge status={offer.status} />
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
        </Card>
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

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  sectionTag: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
    letterSpacing: 1,
    marginBottom: 16,
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
