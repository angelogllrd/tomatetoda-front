import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Simulamos los datos que vendrían del backend para este evento específico
const mockEventData = {
  title: "Cumpleaños de Sofía",
  date: "15 de julio de 2026",
  location: "Av. Corrientes 1234, CABA",
  people: 50,
  description:
    "2 cajones de cerveza, 20 gaseosas variadas, 10 jugos, agua mineral para todos.",
  initialStatus: "Abierto",
};

const mockOffersData = [
  {
    id: "o1",
    providerName: "Ana Martínez",
    company: "Distribuidora Norte S.A.",
    amount: "$38.500",
    details:
      "Oferta completa con reposición en el evento. Marcas premium garantizadas.",
    status: "Pendiente",
  },
  {
    id: "o2",
    providerName: "Carlos Rodríguez",
    company: "Bebidas del Sur SRL",
    amount: "$45.000",
    details: "",
    status: "Rechazada",
  },
];

export default function DetalleEventoScreen() {
  const router = useRouter();
  // Este hook extrae el ID de la URL (ej: /detalle-evento/1)
  const { id } = useLocalSearchParams();

  const [eventStatus, setEventStatus] = useState(mockEventData.initialStatus);
  const [offers, setOffers] = useState(mockOffersData);
  // const [offers, setOffers] = useState([]); // para probar estado sin ofertas
  const [confirmingOfferId, setConfirmingOfferId] = useState<string | null>(
    null,
  );

  // Función para confirmar una oferta
  const handleConfirmAccept = (offerId: string) => {
    // 1. Cambiamos el estado del evento a Cerrado
    setEventStatus("Cerrado");

    // 2. Aceptamos esta oferta y filtramos/rechazamos las demás
    const updatedOffers = offers.map((offer) => {
      if (offer.id === offerId) {
        return { ...offer, status: "Aceptada" };
      }
      return { ...offer, status: "Rechazada" };
    });

    setOffers(updatedOffers);
    setConfirmingOfferId(null);
  };

  // Función para rechazar una oferta
  const handleRejectOffer = (offerId: string) => {
    const updatedOffers = offers.map((offer) => {
      if (offer.id === offerId) {
        return { ...offer, status: "Rechazada" };
      }
      return offer;
    });
    setOffers(updatedOffers);
  };

  const pendingOffers = offers.filter((o) => o.status === "Pendiente");
  const rejectedOffers = offers.filter((o) => o.status === "Rechazada");
  const acceptedOffer = offers.find((o) => o.status === "Aceptada");

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
          {mockEventData.title}
        </Text>
        <Text
          style={[
            styles.statusBadge,
            eventStatus === "Cerrado"
              ? styles.statusBadgeClosed
              : styles.statusBadgeOpen,
          ]}
        >
          {eventStatus}
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
            <Text style={styles.infoText}>{mockEventData.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={18}
              color="#666"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{mockEventData.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="people-outline"
              size={18}
              color="#666"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{mockEventData.people} personas</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionLabel}>Bebidas solicitadas</Text>
          <Text style={styles.descriptionText}>
            {mockEventData.description}
          </Text>
        </View>

        {/* SECCIÓN DE OFERTAS)
        ------------------------ */}

        {eventStatus === "Cerrado" && acceptedOffer ? (
          /* SI EL EVENTO ESTÁ CERRADO -> MOSTRAMOS OFERTA ACEPTADA */
          <View style={styles.acceptedOfferCard}>
            <Text style={styles.acceptedOfferTag}>Oferta aceptada</Text>
            <View style={styles.offerHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.providerName}>
                  {acceptedOffer.providerName}
                </Text>
                <Text style={styles.providerCompany}>
                  {acceptedOffer.company}
                </Text>
              </View>
              <Text style={styles.acceptedAmount}>{acceptedOffer.amount}</Text>
            </View>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => router.push(`/datos-proveedor/${id}`)}
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
        ) : offers.length === 0 ? (
          /* SI TODAVIA NO HAY OFERTAS -> MOSTRAMOS ESTADO VACIO */
          <View style={styles.emptyOffersState}>
            <Text style={styles.emptyOffersTitle}>Esperando ofertas</Text>
            <Text style={styles.emptyOffersSub}>
              Los proveedores verán tu evento y{"\n"}comenzarán a ofertar
            </Text>
          </View>
        ) : (
          <>
            {/* SINO, MUESTRO OFERTAS PENDIENTES Y RECHAZADAS */}

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
                          {offer.providerName}
                        </Text>
                        <View style={styles.companyRow}>
                          <Ionicons
                            name="business-outline"
                            size={14}
                            color="#AAA"
                          />
                          <Text style={styles.providerCompany}>
                            {offer.company}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.offerAmount}>{offer.amount}</Text>
                    </View>

                    <View style={styles.offerDetailsBox}>
                      <Text style={styles.offerDetailsText}>
                        {offer.details}
                      </Text>
                    </View>

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
                          >
                            <Text style={styles.cancelButtonText}>
                              Cancelar
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.confirmButton]}
                            onPress={() => handleConfirmAccept(offer.id)}
                          >
                            <Text style={styles.confirmButtonText}>
                              Confirmar
                            </Text>
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
                        {offer.providerName}
                      </Text>
                      <Text style={styles.rejectedProviderCompany}>
                        {offer.company}
                      </Text>
                    </View>
                    <Text style={styles.rejectedAmount}>{offer.amount}</Text>
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

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

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
});
