import Button from "@/components/Button";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
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
  status: string;
  event: {
    id: number;
    title: string;
    user: {
      name: string;
      email: string;
      phone: string;
    };
  };
};

export default function DatosOrganizadorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // CARGAR DATOS
  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const response = await api.get(`/offers/${id}`);
        setOffer(response.data.offer);
      } catch (error) {
        console.error("Error al cargar los datos del organizador:", error);
        Alert.alert("Error", "No se pudo cargar la información.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOfferDetails();
  }, [id]);

  // LÓGICA DE BOTONES EXTERNOS (LINKING)
  const handleWhatsApp = () => {
    if (!offer?.event.user.phone) return;
    const phone = offer.event.user.phone.replace(/[^0-9]/g, "");
    Linking.openURL(`https://wa.me/${phone}`);
  };

  const handleLlamar = () => {
    if (!offer?.event.user.phone) return;
    Linking.openURL(`tel:${offer.event.user.phone}`);
  };

  const handleEmail = () => {
    if (!offer?.event.user.email) return;
    Linking.openURL(`mailto:${offer.event.user.email}`);
  };

  const formatearMoneda = (monto: number) => {
    return "$" + monto.toLocaleString("es-AR");
  };

  if (isLoading || !offer) {
    return (
      <View
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
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
        <Text style={styles.headerTitle}>Datos del organizador</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TARJETA VERDE DE OFERTA ACEPTADA */}
        <View style={styles.acceptedCard}>
          <Text style={styles.acceptedTag}>Tu oferta fue aceptada</Text>

          <View style={styles.eventRow}>
            <Text style={styles.eventLabel}>Evento: </Text>
            <Text style={styles.eventValue}>{offer.event.title}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tu precio aceptado</Text>
            <Text style={styles.priceValue}>
              {formatearMoneda(offer.price)}
            </Text>
          </View>

          {offer.description ? (
            <View style={styles.detailsBox}>
              <Text style={styles.detailsText}>{offer.description}</Text>
            </View>
          ) : null}
        </View>

        {/* TARJETA DE DATOS DEL ORGANIZADOR */}
        <View style={styles.providerCard}>
          <View style={styles.providerHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {offer.event.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.providerName}>{offer.event.user.name}</Text>
              <Text style={styles.providerCompany}>
                Organizador/a del evento
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.contactTag}>DATOS DE CONTACTO</Text>

          <View style={styles.contactInfoBox}>
            <Ionicons name="call-outline" size={20} color="#AAA" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.contactInfoLabel}>Teléfono</Text>
              <Text style={styles.contactInfoValue}>
                {offer.event.user.name}
              </Text>
            </View>
          </View>

          <View style={styles.contactInfoBox}>
            <Ionicons name="mail-outline" size={20} color="#AAA" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.contactInfoLabel}>Email</Text>
              <Text style={styles.contactInfoValue}>
                {offer.event.user.email}
              </Text>
            </View>
          </View>
        </View>

        {/* BOTONES DE ACCIÓN */}
        <Button
          title="Escribir por WhatsApp"
          variant="whatsapp"
          icon="whatsapp"
          isFontAwesome={true}
          style={{ marginBottom: 12 }}
          onPress={handleWhatsApp}
        />

        <Button
          title="Llamar"
          variant="secondary"
          icon="call-outline"
          style={{ marginBottom: 12 }}
          onPress={handleLlamar}
        />

        <Button
          title="Enviar email"
          variant="secondary"
          icon="mail-outline"
          style={{ marginBottom: 12 }}
          onPress={handleEmail}
        />

        {/* RECORDATORIO */}
        <View style={styles.reminderBox}>
          <Text style={styles.reminderText}>
            <Text style={{ fontWeight: "bold", color: "#555" }}>
              Recordá coordinar:
            </Text>{" "}
            fecha y horario de entrega, forma de pago y lugar exacto con el
            organizador.
          </Text>
        </View>

        {/* BOTÓN VOLVER A MIS OFERTAS */}
        <Button
          title="Volver a mis ofertas"
          variant="secondary"
          style={{ marginTop: 8 }}
          onPress={() => router.push("/(tabs-prov)/mis-ofertas")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    marginLeft: 16,
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  acceptedCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginBottom: 20,
  },
  acceptedTag: {
    color: "#16A34A",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  eventRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  eventLabel: {
    fontSize: 16,
    color: "#555",
  },
  eventValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    flex: 1,
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#16A34A",
  },
  detailsBox: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 8,
  },
  detailsText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },

  providerCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 20,
  },
  providerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8321E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  providerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  providerCompany: {
    fontSize: 14,
    color: "#888",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 16,
  },
  contactTag: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
    letterSpacing: 1,
    marginBottom: 12,
  },
  contactInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  contactInfoLabel: {
    fontSize: 12,
    color: "#AAA",
    marginBottom: 2,
  },
  contactInfoValue: {
    fontSize: 16,
    color: "#111",
  },

  reminderBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  reminderText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
});
