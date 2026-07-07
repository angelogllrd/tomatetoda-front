import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import HeaderBackButton from "@/src/components/HeaderBackButton";
import InfoRow from "@/src/components/InfoRow";
import api from "@/src/services/api";
import { formatearFecha } from "@/src/utils/formatters";
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
type EventoDisponibleDetalle = {
  id: number;
  title: string;
  date: string;
  location: string;
  people: number;
  description: string;
  organizer: string;
};

export default function EventoDisponibleScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // ESTADOS
  const [event, setEvent] = useState<EventoDisponibleDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // CARGAR DATOS
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events-available/${id}`);
        setEvent(response.data.event);
      } catch (error) {
        console.error("Error cargando detalle del evento disponible:", error);
        Alert.alert("Error", "Este evento ya no está disponible.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (isLoading || !event) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E8321E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* HEADER */}
      <HeaderBackButton
        title={event.title}
        subtitle={`Organiza: ${event.organizer}`}
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
            text={formatearFecha(event.date)}
            iconSize={18}
            iconColor="#666"
            textColor="#333"
            textSize={16}
          />

          <InfoRow
            icon="location-outline"
            text={event.location}
            iconSize={18}
            iconColor="#666"
            textColor="#333"
            textSize={16}
          />

          <InfoRow
            icon="people-outline"
            text={`${event.people} personas`}
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
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>

          <Text style={styles.footerNote}>
            Tu oferta debe cubrir todos los items listados.
          </Text>
        </Card>

        {/* BOTÓN DE ACCIÓN */}
        <Button
          title="Enviar oferta de precio"
          onPress={() => router.push(`/enviar-oferta/${id}` as any)}
        />
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

  // TARJETAS
  sectionTag: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
    letterSpacing: 1,
    marginBottom: 16,
  },

  // CAJA DE DESCRIPCIÓN
  descriptionBox: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
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
});
