import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import HeaderBackButton from "@/src/components/HeaderBackButton";
import api from "@/src/services/api";
import { formatearMoneda } from "@/src/utils/formatters";
import { Ionicons } from "@expo/vector-icons"; // Sumamos FontAwesome para el logo de WhatsApp
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Definimos la estructura de lo que nos devuelve el endpoint GET /offers/{id}
type OfertaDetalle = {
  id: number;
  price: number;
  description: string;
  status: string;
  event: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    name: string;
    company_name: string;
    email: string;
    phone: string;
  };
};

export default function DatosProveedorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Este es el ID de la OFERTA que recibimos

  const [offer, setOffer] = useState<OfertaDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const response = await api.get(`/offers/${id}`);
        setOffer(response.data.offer);
      } catch (error) {
        console.error("Error al cargar los datos del proveedor:", error);
        Alert.alert("Error", "No se pudo cargar la información.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOfferDetails();
    }
  }, [id]);

  // LÓGICA DE BOTONES EXTERNOS (LINKING PARA ABRIR APP EXTERNAS)
  const handleWhatsApp = () => {
    if (!offer?.user?.phone) return;
    // Limpiamos el número de espacios, guiones o signos raros para la URL de WhatsApp
    const phone = offer.user.phone.replace(/[^0-9]/g, "");
    Linking.openURL(`https://wa.me/${phone}`);
  };

  const handleLlamar = () => {
    if (!offer?.user?.phone) return;
    Linking.openURL(`tel:${offer.user.phone}`);
  };

  const handleEmail = () => {
    if (!offer?.user?.email) return;
    Linking.openURL(`mailto:${offer.user.email}`);
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
      <HeaderBackButton title="Datos del proveedor" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TARJETA VERDE DE OFERTA ACEPTADA */}
        <Card style={{ borderColor: "#BBF7D0" }}>
          <Text style={styles.acceptedTag}>Oferta aceptada</Text>

          <View style={styles.eventRow}>
            <Text style={styles.eventLabel}>Evento: </Text>
            <Text style={styles.eventValue}>{offer.event.title}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Precio acordado</Text>
            <Text style={styles.priceValue}>
              {formatearMoneda(offer.price)}
            </Text>
          </View>

          {offer.description ? (
            <View style={styles.detailsBox}>
              <Text style={styles.detailsText}>{offer.description}</Text>
            </View>
          ) : null}
        </Card>

        {/* TARJETA DE DATOS DEL PROVEEDOR */}
        <Card>
          <View style={styles.providerHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {offer.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.providerName}>{offer.user.name}</Text>
              <View style={styles.companyRow}>
                <Ionicons name="business-outline" size={14} color="#AAA" />
                <Text style={styles.providerCompany}>
                  {offer.user.company_name}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.contactTag}>DATOS DE CONTACTO</Text>

          <View style={styles.contactInfoBox}>
            <Ionicons name="call-outline" size={20} color="#AAA" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.contactInfoLabel}>Teléfono</Text>
              <Text style={styles.contactInfoValue}>{offer.user.phone}</Text>
            </View>
          </View>

          <View style={styles.contactInfoBox}>
            <Ionicons name="mail-outline" size={20} color="#AAA" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.contactInfoLabel}>Email</Text>
              <Text style={styles.contactInfoValue}>{offer.user.email}</Text>
            </View>
          </View>
        </Card>

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
            fecha y hora de entrega, condiciones de pago y detalles finales con
            el proveedor.
          </Text>
        </View>

        {/* BOTÓN VOLVER AL INICIO */}
        <Button
          title="Volver al inicio"
          variant="secondary"
          style={{ marginTop: 8 }}
          onPress={() => router.push("/home-organizador")}
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
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  // TARJETA DE OFERTA
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
    color: "#666",
  },
  eventValue: {
    // flex: 1,
    fontSize: 16,
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

  // TARJETA DEL PROVEEDOR
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
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  providerCompany: {
    fontSize: 14,
    color: "#888",
    marginLeft: 4,
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

  // RECORDATORIO
  reminderBox: {
    backgroundColor: "#fff",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  reminderText: {
    fontSize: 14,
    color: "#888",
    lineHeight: 22,
  },
});
