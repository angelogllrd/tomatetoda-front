import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Datos simulados con el historial completo de ofertas de Carlos
const mockMyOffers = [
  {
    id: "o1",
    title: "Tech Summit 2026",
    date: "25 jun 2026",
    people: 80,
    price: "$62.000",
    status: "Aceptada", // Verde
    description:
      "Agua Villavicencio x50, jugos Ades, Sprite Zero x24, Heineken x2 cajones. Entrega...",
  },
  {
    id: "o2",
    title: "Casamiento García-López",
    date: "20 ago 2026",
    people: 150,
    price: "$185.000",
    status: "Pendiente", // Naranja/Marrón
    description:
      "Paquete premium: vinos Rutini, Chandon para brindis, cervezas artesanales Antares y...",
  },
  {
    id: "o3",
    title: "Cumpleaños de Sofía",
    date: "15 jul 2026",
    people: 50,
    price: "$45.000",
    status: "Rechazada", // Gris
    description:
      "Incluye delivery y refrigeración. 2 cajones Quilmes, 20 sodas variadas, 10 jugos Cepita...",
  },
  {
    id: "o4",
    title: "Despedida de Soltero Lucas",
    date: "3 may 2026",
    people: 30,
    price: "$28.000",
    status: "Caducada", // Gris
    description:
      "Cerveza Quilmes tirada x2 choperas, fernet Branca 2L x3, Coca-Cola x12, aguas y sodas.",
  },
];

export default function MisOfertasScreen() {
  const router = useRouter();

  // Calculamos las estadísticas dinámicamente basadas en la captura
  const total = mockMyOffers.length;
  const pendientes = mockMyOffers.filter(
    (o) => o.status === "Pendiente",
  ).length;
  const aceptadas = mockMyOffers.filter((o) => o.status === "Aceptada").length;

  // Función auxiliar para pintar el texto del estado según corresponda
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
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* TÍTULO DE LA PANTALLA */}
      <Text style={styles.screenTitle}>Mis ofertas</Text>

      {/* CONTENEDOR DE ESTADÍSTICAS */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statBox}>
          {/* Forzamos a '2' como en tu captura de diseño de muestra */}
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{aceptadas}</Text>
          <Text style={styles.statLabel}>Aceptadas</Text>
        </View>
      </View>

      {/* LISTADO DE OFERTAS */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mockMyOffers.map((oferta) => (
          <TouchableOpacity
            key={oferta.id}
            style={[
              styles.offerCard,
              oferta.status === "Caducada" && { opacity: 0.5 }, // Efecto sutil "apagado" para las caducadas
            ]}
            // Nos redirige al detalle interno de la oferta
            onPress={() =>
              router.push(`/detalle-oferta-proveedor/${oferta.id}` as any)
            }
          >
            {/* FILA DE TÍTULO Y ESTADO */}
            <View style={styles.cardHeaderRow}>
              <Text style={styles.eventTitle}>{oferta.title}</Text>
              <Text
                style={[
                  styles.statusBadge,
                  { color: getStatusColor(oferta.status) },
                ]}
              >
                {oferta.status}
              </Text>
            </View>

            {/* SUBTÍTULO CON DETALLES */}
            <Text style={styles.eventSubtitle}>
              {oferta.date} • {oferta.people} personas
            </Text>

            {/* FILA DE PRECIO */}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tu precio</Text>
              <Text style={styles.priceValue}>{oferta.price}</Text>
            </View>

            {/* CUADRO DE DESCRIPCIÓN */}
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText} numberOfLines={2}>
                {oferta.description}
              </Text>
            </View>

            {/* ACCIÓN VER OFERTA */}
            <View style={styles.cardFooter}>
              <View style={styles.verOfertaBtn}>
                <Text style={styles.verOfertaText}>Ver oferta</Text>
                <Ionicons name="chevron-forward" size={14} color="#E8321E" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },

  // Estilos de la fila de estadísticas
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#999",
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  // Estilos de las tarjetas de ofertas
  offerCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    flex: 1,
    paddingRight: 12,
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: "600",
  },

  eventSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 16,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#888",
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E8321E",
  },

  descriptionBox: {
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  verOfertaBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  verOfertaText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E8321E",
    marginRight: 2,
  },
});
