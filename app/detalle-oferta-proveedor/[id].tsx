import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Simulamos una base de datos que cruza los datos del evento con tu oferta
const mockOffersDetail = {
  o1: {
    eventName: "Tech Summit 2026",
    organizer: "Sofía Martínez",
    eventDate: "25 de junio de 2026",
    location: "Hotel Sheraton, Retiro",
    people: 80,
    requested:
      "Agua mineral sin gas (50u), jugos naturales, gaseosas light, 2 cajones de cerveza.",
    offerPrice: "$62.000",
    offerDetail:
      "Agua Villavicencio x50, jugos Ades, Sprite Zero x24, Heineken x2 cajones. Entrega incluida en el precio.",
    status: "Aceptada",
  },
  o2: {
    eventName: "Casamiento García-López",
    organizer: "María González",
    eventDate: "20 de agosto de 2026",
    location: "Salón Los Jardines, Palermo",
    people: 150,
    requested:
      "Vinos finos, champagne para el brindis (20 botellas), cerveza artesanal y gaseosas.",
    offerPrice: "$185.000",
    offerDetail:
      "Paquete premium: vinos Rutini, Chandon para brindis, cervezas artesanales Antares y Coca-Cola.",
    status: "Pendiente",
  },
  o3: {
    eventName: "Cumpleaños de Sofía",
    organizer: "María González",
    eventDate: "15 de julio de 2026",
    location: "Av. Corrientes 1234, CABA",
    people: 50,
    requested:
      "2 cajones de cerveza, 20 gaseosas variadas, 10 jugos, agua mineral para todos.",
    offerPrice: "$45.000",
    offerDetail:
      "Incluye delivery y refrigeración. 2 cajones Quilmes, 20 sodas variadas, 10 jugos Cepita, 50 aguas.",
    status: "Rechazada",
  },
  o4: {
    eventName: "Despedida de Soltero Lucas",
    organizer: "Juan Pérez",
    eventDate: "3 de mayo de 2026",
    location: "Bar El Refugio, San Telmo",
    people: 30,
    requested:
      "Cerveza tirada, fernet con cola, aguas y gaseosas para una noche larga.",
    offerPrice: "$28.000",
    offerDetail:
      "Cerveza Quilmes tirada x2 choperas, fernet Branca 2L x3, Coca-Cola x12, aguas y sodas. Retiro al día siguiente.",
    status: "Caducada",
  },
};

export default function DetalleOfertaProveedorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // En la vida real, acá harías un fetch() a tu backend usando el ID.
  // Por ahora lo leemos de nuestro objeto simulado. (Usamos 'o2' como fallback por si entra sin ID válido)
  const data =
    mockOffersDetail[id as keyof typeof mockOffersDetail] ||
    mockOffersDetail["o2"];

  // Función dinámica para el color de la etiqueta
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aceptada":
        return "#16A34A"; // Verde
      case "Pendiente":
        return "#B45309"; // Naranja
      case "Rechazada":
        return "#AAA"; // Gris
      case "Caducada":
        return "#AAA"; // Gris
      default:
        return "#333";
    }
  };

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
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{data.eventName}</Text>
          <Text style={styles.headerSubtitle}>Organiza: {data.organizer}</Text>
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
            <Ionicons name="calendar-outline" size={20} color="#AAA" />
            <Text style={styles.detailText}>{data.eventDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#AAA" />
            <Text style={styles.detailText}>{data.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={20} color="#AAA" />
            <Text style={styles.detailText}>{data.people} personas</Text>
          </View>
        </View>

        {/* BEBIDAS SOLICITADAS */}
        <View style={styles.card}>
          <Text style={styles.sectionTag}>BEBIDAS SOLICITADAS</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{data.requested}</Text>
          </View>
          <Text style={styles.footerNote}>
            Tu oferta debe cubrir todos los items listados.
          </Text>
        </View>

        {/* MI OFERTA (La tarjeta protagonista) */}
        {/* Si está aceptada, le sumamos el estilo 'acceptedCard' para el borde verde */}
        <View
          style={[
            styles.card,
            data.status === "Aceptada" && styles.acceptedCard,
          ]}
        >
          <View style={styles.offerHeaderRow}>
            <Text style={styles.offerTitle}>Mi oferta</Text>
            <Text
              style={[
                styles.statusBadge,
                { color: getStatusColor(data.status) },
              ]}
            >
              {data.status}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Precio ofertado</Text>
            <Text style={styles.priceValue}>{data.offerPrice}</Text>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{data.offerDetail}</Text>
          </View>

          {/* BOTÓN CONDICIONAL */}
          {data.status === "Aceptada" && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => router.push(`/datos-organizador/${id}` as any)}
            >
              <Text style={styles.contactButtonText}>
                Ver datos del organizador
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          )}
        </View>
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

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 16,
  },
  acceptedCard: {
    borderColor: "#BBF7D0",
    borderWidth: 1,
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
  statusBadge: {
    fontSize: 14,
    fontWeight: "500",
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

  contactButton: {
    flexDirection: "row",
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
