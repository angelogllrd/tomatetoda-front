import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DatosOrganizadorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Funciones usando Linking para abrir apps externas
  const handleWhatsApp = () => Linking.openURL("https://wa.me/541155550002");
  const handleLlamar = () => Linking.openURL("tel:+541155550002");
  const handleEmail = () => Linking.openURL("mailto:juan@demo.com");

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
            <Text style={styles.eventValue}>Tech Summit 2026</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tu precio aceptado</Text>
            <Text style={styles.priceValue}>$62.000</Text>
          </View>

          <View style={styles.detailsBox}>
            <Text style={styles.detailsText}>
              Agua Villavicencio x50, jugos Ades, Sprite Zero x24, Heineken x2
              cajones. Entrega incluida.
            </Text>
          </View>
        </View>

        {/* TARJETA DE DATOS DEL ORGANIZADOR */}
        <View style={styles.providerCard}>
          <View style={styles.providerHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>J</Text>
            </View>
            <View>
              <Text style={styles.providerName}>Juan Pérez</Text>
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
              <Text style={styles.contactInfoValue}>+54 11 5555-0002</Text>
            </View>
          </View>

          <View style={styles.contactInfoBox}>
            <Ionicons name="mail-outline" size={20} color="#AAA" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.contactInfoLabel}>Email</Text>
              <Text style={styles.contactInfoValue}>juan@demo.com</Text>
            </View>
          </View>
        </View>

        {/* BOTONES DE ACCIÓN */}
        <TouchableOpacity
          style={[styles.actionButton, styles.btnWhatsApp]}
          onPress={handleWhatsApp}
        >
          <FontAwesome
            name="whatsapp"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.btnWhatsAppText}>Escribir por WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.btnOutline]}
          onPress={handleLlamar}
        >
          <Ionicons
            name="call-outline"
            size={20}
            color="#333"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.btnOutlineText}>Llamar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.btnOutline]}
          onPress={handleEmail}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color="#333"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.btnOutlineText}>Enviar email</Text>
        </TouchableOpacity>

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
        <TouchableOpacity
          style={[styles.actionButton, styles.btnOutline, { marginTop: 8 }]}
          onPress={() => router.push("/(tabs-prov)/mis-ofertas")}
        >
          <Text style={styles.btnOutlineText}>Volver a mis ofertas</Text>
        </TouchableOpacity>
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

  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  btnWhatsApp: {
    backgroundColor: "#25D366",
  },
  btnWhatsAppText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  btnOutlineText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
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
