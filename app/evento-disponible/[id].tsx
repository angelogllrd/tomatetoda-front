import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

  // FORMATEADORES
  const formatearFecha = (fechaString: string) => {
    const [year, month, day] = fechaString.split("-");
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return `${parseInt(day, 10)} de ${meses[parseInt(month, 10) - 1]} de ${year}`;
  };

  if (isLoading || !event) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#E8321E"
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111"
          />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text
            style={styles.headerTitle}
            numberOfLines={1}
          >
            {event.title}
          </Text>
          <Text style={styles.headerSubtitle}>Organiza: {event.organizer}</Text>
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
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#AAA"
            />
            <Text style={styles.detailText}>{formatearFecha(event.date)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#AAA"
            />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="people-outline"
              size={20}
              color="#AAA"
            />
            <Text style={styles.detailText}>{event.people} personas</Text>
          </View>
        </View>

        {/* BEBIDAS SOLICITADAS */}
        <View style={styles.card}>
          <Text style={styles.sectionTag}>BEBIDAS SOLICITADAS</Text>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>

          <Text style={styles.footerNote}>Tu oferta debe cubrir todos los items listados.</Text>
        </View>

        {/* BOTÓN DE ACCIÓN */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/enviar-oferta/${id}` as any)}
        >
          <Text style={styles.primaryButtonText}>Enviar oferta de precio</Text>
        </TouchableOpacity>
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

  // ENCABEZADO
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

  // TARJETAS
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 20,
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

  // BOTONES
  primaryButton: {
    backgroundColor: "#E8321E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
