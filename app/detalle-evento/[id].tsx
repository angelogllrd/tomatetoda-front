import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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

  // FORMATEADORES
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
    return `${day} de ${meses[parseInt(month, 10) - 1]} de ${year}`;
  };

  const formatearMoneda = (monto: number) => {
    return "$" + monto.toLocaleString("es-AR");
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {event.title}
        </Text>
        <Text
          style={[
            styles.statusBadge,
            event.status === "cerrado"
              ? styles.statusBadgeClosed
              : styles.statusBadgeOpen,
          ]}
        >
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CAJA DE DETALLES DEL EVENTO */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTag}>DETALLES DEL EVENTO</Text>

          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#666"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              {formatearFecha(event.event_date)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={18}
              color="#666"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{event.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="people-outline"
              size={18}
              color="#666"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{event.guests_count} personas</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionLabel}>Bebidas solicitadas</Text>
          <Text style={styles.descriptionText}>{event.requirements}</Text>
        </View>

        {/* SECCIÓN DE ESTADOS Y OFERTAS
        -------------------------------- */}

        {event.status === "cerrado" && acceptedOffer ? (
          /* 1. ESTADO: OFERTA ACEPTADA (ÉXITO) */
          <View style={styles.acceptedOfferCard}>
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

            <TouchableOpacity
              style={styles.contactButton}
              onPress={() =>
                router.push(`/datos-proveedor/${acceptedOffer.user.id}`)
              }
            >
              <Text style={styles.contactButtonText}>
                Ver datos de contacto
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color="#fff"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
        ) : event.status === "cerrado" && !acceptedOffer ? (
          /* 2. ESTADO VACÍO: EVENTO CADUCADO */
          <View style={styles.expiredStateCard}>
            <Text style={styles.expiredTitle}>Evento caducado</Text>
            <Text style={styles.expiredSub}>
              La fecha límite de este evento ya pasó y no se concretó ninguna
              oferta
            </Text>
          </View>
        ) : event.offers.length === 0 ? (
          /* 3. ESTADO: ESPERANDO OFERTAS (VACÍO) */
          <View style={styles.emptyOffersState}>
            <Text style={styles.emptyOffersTitle}>Esperando ofertas</Text>
            <Text style={styles.emptyOffersSub}>
              Los proveedores verán tu evento y{"\n"}comenzarán a ofertar
            </Text>
          </View>
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
                  <View key={offer.id} style={styles.offerCard}>
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
                        <View style={styles.confirmButtonsRow}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={() => setConfirmingOfferId(null)}
                            disabled={isAccepting}
                          >
                            <Text style={styles.cancelButtonText}>
                              Cancelar
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.confirmButton]}
                            onPress={() => handleConfirmAccept(offer.id)}
                            disabled={isAccepting}
                          >
                            {isAccepting ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : (
                              <Text style={styles.confirmButtonText}>
                                Confirmar
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.actionButtonsRow}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.rejectButton]}
                          onPress={() => handleRejectOffer(offer.id)}
                        >
                          <Ionicons
                            name="close"
                            size={16}
                            color="#888"
                            style={{ marginRight: 4 }}
                          />
                          <Text style={styles.rejectButtonText}>Rechazar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.acceptButton]}
                          onPress={() => setConfirmingOfferId(offer.id)}
                        >
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#fff"
                            style={{ marginRight: 4 }}
                          />
                          <Text style={styles.acceptButtonText}>
                            Aceptar oferta
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
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

  // HEADER
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
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    marginLeft: 16,
    marginRight: 8,
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusBadgeOpen: {
    color: "#16A34A",
  },
  statusBadgeClosed: {
    color: "#999",
  },

  // TARJETA DE DETALLES DEL EVENTO
  detailsCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 32,
  },
  sectionTag: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
    letterSpacing: 1,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
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
  offerCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 16,
  },
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

  // BOTONES DE ACCIÓN (ACEPTAR / RECHAZAR)
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  rejectButton: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E5E5E5",
  },
  rejectButtonText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
  },
  acceptButton: {
    backgroundColor: "#E8321E",
    borderColor: "#E8321E",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
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
  confirmButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
    borderColor: "#F0F0F0",
  },
  cancelButtonText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
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
  acceptedOfferCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginTop: 8,
  },
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
  contactButton: {
    flexDirection: "row",
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ESTADO: ESPERANDO OFERTAS (VACÍO)
  emptyOffersState: {
    backgroundColor: "#fff",
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },
  emptyOffersTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  emptyOffersSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },

  // ESTADO: EVENTO CADUCADO
  expiredStateCard: {
    backgroundColor: "#FAFAFA",
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    alignItems: "center",
  },
  expiredTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 8,
  },
  expiredSub: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
  },
});
