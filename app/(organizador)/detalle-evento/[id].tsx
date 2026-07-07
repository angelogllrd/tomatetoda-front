import Button from "@/components/Button";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import HeaderBackButton from "@/components/HeaderBackButton";
import InfoRow from "@/components/InfoRow";
import StatusBadge from "@/components/StatusBadge";
import api from "@/services/api";
import { formatearFecha, formatearMoneda } from "@/utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TIPOS DE DATOS (basados en la base de datos)
type Proveedor = {
  id: number;
  name: string;
  company_name: string;
  email: string;
  phone: string;
};

type Oferta = {
  id: number;
  price: number;
  description: string;
  status: "pendiente" | "aceptada" | "rechazada" | "caducada";
  user: Proveedor;
};

type EventoDetalle = {
  id: number;
  title: string;
  event_date: string;
  location: string;
  guests_count: number;
  requirements: string;
  status: "abierto" | "cerrado";
  offers: Oferta[];
};

export default function DetalleEventoScreen() {
  const router = useRouter();
  // Este hook extrae el ID de la URL (ej: /detalle-evento/1)
  const { id } = useLocalSearchParams();

  // ESTADOS DE LA PANTALLA
  const [event, setEvent] = useState<EventoDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [confirmingOfferId, setConfirmingOfferId] = useState<number | null>(
    null,
  );

  // OBTENER DATOS DEL BACKEND
  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.event);
    } catch (error) {
      console.error("Error al cargar el evento:", error);
      Alert.alert("Error", "No se pudo cargar el detalle del evento.");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEventDetails();
    }, [id]),
  );

  // ACCIONES
  const handleConfirmAccept = async (offerId: number) => {
    setIsAccepting(true);
    try {
      // Llamamos al endpoint de OfferController para aceptar la oferta y rechazar las demás
      await api.put(`/offers/${offerId}/accept`);
      setConfirmingOfferId(null);
      // Recargamos el evento para que traiga los estados actualizados (cerrado)
      await fetchEventDetails();
    } catch (error) {
      console.error("Error al aceptar oferta:", error);
      Alert.alert("Error", "Ocurrió un error al aceptar la oferta.");
    } finally {
      setIsAccepting(false);
    }
  };

  // Función para rechazar oferta
  const handleRejectOffer = async (offerId: number) => {
    try {
      // Le avisamos a la base de datos
      await api.put(`/offers/${offerId}/reject`);

      // Recargamos la pantalla para que la oferta baje a la sección "Rechazadas"
      await fetchEventDetails();
    } catch (error) {
      console.error("Error al rechazar oferta:", error);
      Alert.alert("Error", "Ocurrió un error al rechazar la oferta.");
    }
  };

  if (isLoading || !event) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E8321E" />
      </View>
    );
  }

  // FILTROS DE OFERTAS
  const pendingOffers = event.offers.filter((o) => o.status === "pendiente");
  const rejectedOffers = event.offers.filter((o) => o.status === "rechazada");
  const acceptedOffer = event.offers.find((o) => o.status === "aceptada");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* HEADER */}
      <HeaderBackButton
        title={event.title}
        rightElement={<StatusBadge status={event.status} />}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CAJA DE DETALLES DEL EVENTO */}
        <Card>
          <Text style={styles.sectionTag}>DETALLES DEL EVENTO</Text>

          <InfoRow
            icon="calendar-outline"
            text={formatearFecha(event.event_date)}
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
            text={`${event.guests_count} personas`}
            iconSize={18}
            iconColor="#666"
            textColor="#333"
            textSize={16}
          />

          <View style={styles.divider} />

          <Text style={styles.descriptionLabel}>Bebidas solicitadas</Text>
          <Text style={styles.descriptionText}>{event.requirements}</Text>
        </Card>

        {/* SECCIÓN DE ESTADOS Y OFERTAS
        -------------------------------- */}

        {event.status === "cerrado" && acceptedOffer ? (
          /* 1. ESTADO: OFERTA ACEPTADA (ÉXITO) */
          <Card style={{ borderColor: "#BBF7D0" }}>
            <Text style={styles.acceptedOfferTag}>Oferta aceptada</Text>
            <View style={styles.offerHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.providerName}>
                  {acceptedOffer.user.name}
                </Text>
                <Text style={styles.providerCompany}>
                  {acceptedOffer.user.company_name}
                </Text>
              </View>
              <Text style={styles.acceptedAmount}>
                {formatearMoneda(acceptedOffer.price)}
              </Text>
            </View>

            <Button
              title="Ver datos de contacto"
              variant="success"
              icon="chevron-forward"
              iconPosition="right"
              onPress={() =>
                router.push(`/datos-proveedor/${acceptedOffer.id}`)
              }
            />
          </Card>
        ) : event.status === "cerrado" && !acceptedOffer ? (
          /* 2. ESTADO VACÍO: EVENTO CADUCADO */
          <EmptyState
            variant="expired"
            title="Evento caducado"
            subtitle="La fecha límite de este evento ya pasó y no se concretó ninguna oferta"
          />
        ) : event.offers.length === 0 ? (
          /* 3. ESTADO: ESPERANDO OFERTAS (VACÍO) */
          <EmptyState
            title="Esperando ofertas"
            subtitle="Los proveedores verán tu evento y comenzarán a ofertar"
          />
        ) : (
          /* 4. ESTADO: MOSTRAR OFERTAS PENDIENTES / RECHAZADAS */
          <>
            {pendingOffers.length > 0 && (
              <>
                {/* TITULO "Ofertas recibidas" */}
                <View style={styles.offersSectionHeader}>
                  <Text style={styles.sectionTitle}>Ofertas recibidas</Text>
                  <Text style={styles.offersCountText}>
                    {pendingOffers.length}{" "}
                    {pendingOffers.length === 1 ? "pendiente" : "pendientes"}
                  </Text>
                </View>

                {/* OFERTAS PENDIENTES */}
                {pendingOffers.map((offer) => (
                  <Card key={offer.id}>
                    <View style={styles.offerHeaderRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.providerName}>
                          {offer.user.name}
                        </Text>
                        <View style={styles.companyRow}>
                          <Ionicons
                            name="business-outline"
                            size={14}
                            color="#AAA"
                          />
                          <Text style={styles.providerCompany}>
                            {offer.user.company_name}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.offerAmount}>
                        {formatearMoneda(offer.price)}
                      </Text>
                    </View>

                    {offer.description ? (
                      <View style={styles.offerDetailsBox}>
                        <Text style={styles.offerDetailsText}>
                          {offer.description}
                        </Text>
                      </View>
                    ) : null}

                    {/* Se presionó "Aceptar oferta", confirmingOfferId tiene el id de la
                oferta aceptada, y es la que estoy viendo -> pido confirmación */}
                    {confirmingOfferId === offer.id ? (
                      <View style={styles.confirmBox}>
                        <Text style={styles.confirmPrompt}>
                          ¿Confirmar aceptar esta oferta?
                        </Text>
                        <View style={{ flexDirection: "row", gap: 12 }}>
                          <Button
                            title="Cancelar"
                            variant="light"
                            compact // modo compacto
                            style={{ flex: 1, marginBottom: 0 }}
                            onPress={() => setConfirmingOfferId(null)}
                            disabled={isAccepting}
                          />
                          <Button
                            title="Confirmar"
                            variant="success"
                            compact // modo compacto
                            style={{ flex: 1, marginBottom: 0 }}
                            onPress={() => handleConfirmAccept(offer.id)}
                            loading={isAccepting}
                          />
                        </View>
                      </View>
                    ) : (
                      <View style={{ flexDirection: "row", gap: 12 }}>
                        <Button
                          title="Rechazar"
                          variant="light"
                          icon="close"
                          compact // modo compacto
                          style={{ flex: 1, marginBottom: 0 }}
                          onPress={() => handleRejectOffer(offer.id)}
                        />
                        <Button
                          title="Aceptar oferta"
                          variant="primary"
                          icon="checkmark"
                          compact // modo compacto
                          style={{ flex: 1, marginBottom: 0 }}
                          onPress={() => setConfirmingOfferId(offer.id)}
                        />
                      </View>
                    )}
                  </Card>
                ))}
              </>
            )}

            {/* OFERTAS RECHAZADAS */}
            {rejectedOffers.length > 0 && (
              <>
                <Text style={styles.rejectedSectionTitle}>
                  Ofertas rechazadas
                </Text>
                {rejectedOffers.map((offer) => (
                  <View key={offer.id} style={styles.rejectedCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rejectedProviderName}>
                        {offer.user.name}
                      </Text>
                      <Text style={styles.rejectedProviderCompany}>
                        {offer.user.company_name}
                      </Text>
                    </View>
                    <Text style={styles.rejectedAmount}>
                      {formatearMoneda(offer.price)}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  // TARJETA DE DETALLES DEL EVENTO
  sectionTag: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
    letterSpacing: 1,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 16,
  },
  descriptionLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },

  // ENCABEZADOS DE SECCIÓN
  offersSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  offersCountText: {
    fontSize: 14,
    color: "#888",
  },

  // TARJETAS DE OFERTAS PENDIENTES
  offerHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  providerName: {
    fontSize: 16,
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
  offerAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E8321E",
  },
  offerDetailsBox: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  offerDetailsText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },

  // CAJA DE CONFIRMACIÓN
  confirmBox: {
    marginTop: 8,
  },
  confirmPrompt: {
    textAlign: "center",
    fontSize: 15,
    color: "#333",
    marginBottom: 16,
  },

  // TARJETAS DE OFERTAS RECHAZADAS
  rejectedSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#AAA",
    marginTop: 16,
    marginBottom: 12,
  },
  rejectedCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 8,
  },
  rejectedProviderName: {
    fontSize: 16,
    color: "#AAA",
    marginBottom: 4,
  },
  rejectedProviderCompany: {
    fontSize: 14,
    color: "#bbb",
  },
  rejectedAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#bbb",
  },

  // ESTADO: OFERTA ACEPTADA
  acceptedOfferTag: {
    color: "#16A34A",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  acceptedAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#16A34A",
  },
});
