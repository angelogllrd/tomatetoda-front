import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TIPO DE DATOS
type EventoBasico = {
  id: number;
  title: string;
  description: string;
  organizer: string;
};

export default function EnviarOfertaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // ESTADOS
  const [event, setEvent] = useState<EventoBasico | null>(null);
  const [precio, setPrecio] = useState("");
  const [detalle, setDetalle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // CARGAR DETALLE DEL EVENTO
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events-available/${id}`);
        setEvent(response.data.event);
      } catch (error) {
        console.error("Error cargando evento:", error);
        Alert.alert("Error", "El evento no está disponible.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  // ENVIAR FORMULARIO AL BACKEND
  const handleEnviar = async () => {
    // 1. Validación del precio
    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) {
      setErrorMsg("Ingresá un precio válido");
      return;
    }

    // 2. Validación del detalle
    if (!detalle.trim()) {
      setErrorMsg("Describí tu oferta");
      return;
    }

    // 3. Si pasa las validaciones, limpiamos errores y avanzamos a la confirmación
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await api.post("/offers", {
        event_id: Number(id),
        price: Number(precio),
        description: detalle,
      });
      // Navegamos a confirmación y reemplazamos historial para no poder "volver" al form
      router.replace("/confirmacion-oferta");
    } catch (error: any) {
      console.error("Error al enviar oferta:", error);
      setErrorMsg(error.response?.data?.message || "Hubo un error al enviar tu oferta.");
    } finally {
      setIsSubmitting(false);
    }
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
      edges={["top", "bottom"]}
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
          <Text style={styles.headerTitle}>Enviar oferta</Text>
          <Text
            style={styles.headerSubtitle}
            numberOfLines={1}
          >
            Para: {event.title}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* LO QUE NECESITA EL ORGANIZADOR */}
        <View style={styles.card}>
          <Text style={styles.organizerLabel}>Lo que necesita el organizador</Text>
          <Text style={styles.organizerNeedsText}>{event.description}</Text>
        </View>

        {/* PRECIO TOTAL */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Precio total (ARS)</Text>

          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={precio}
              onChangeText={(text) => {
                // Filtramos para que solo acepte números
                const numericValue = text.replace(/[^0-9]/g, "");
                setPrecio(numericValue);
                if (errorMsg === "Ingresá un precio válido") setErrorMsg(null);
              }}
            />
          </View>

          <Text style={styles.inputHint}>Precio total por todas las bebidas, delivery incluido</Text>
        </View>

        {/* DETALLE DE LA OFERTA */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Detalle de la oferta</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Describí qué incluye: marcas, cantidades exactas, condiciones de entrega..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={detalle}
            onChangeText={(text) => {
              setDetalle(text);
              if (errorMsg === "Describí tu oferta") setErrorMsg(null);
            }}
          />
        </View>

        {/* TIPS PARA GANAR CLIENTES */}
        <View style={styles.card}>
          <Text style={styles.tipsTitle}>Tips para ganar más clientes</Text>
          <View style={styles.tipRow}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Especificá las marcas exactas que vas a proveer</Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Indicá si el precio incluye delivery</Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Mencioná si das factura o garantía de frescura</Text>
          </View>
        </View>

        {/* MENSAJES Y BOTÓN */}
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

        {/* BOTÓN ENVIAR */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleEnviar}
          disabled={isSubmitting}
        >
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Enviar oferta</Text>}
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

  // TARJETAS Y CONTENIDO
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 20,
  },
  organizerLabel: {
    fontSize: 14,
    color: "#888",
  },
  organizerNeedsText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginTop: 8,
  },

  // INPUTS
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: "#111",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 52,
  },
  currencySymbol: {
    fontSize: 20,
    color: "#666",
    marginRight: 8,
    fontWeight: "bold",
  },
  priceInput: {
    flex: 1,
    fontSize: 20,
    color: "#1A1A1A",
    fontWeight: "bold",
    height: "100%",
  },
  textArea: {
    height: 120,
    fontSize: 16,
  },
  inputHint: {
    fontSize: 14,
    color: "#AAA",
    marginTop: 8,
  },

  // TIPS
  tipsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  // BOTONES Y ERRORES
  errorText: {
    color: "#C0392B",
    fontSize: 14,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#E8321E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
