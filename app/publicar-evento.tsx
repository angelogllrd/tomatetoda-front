import Button from "@/components/Button";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MESES = [
  { id: 1, nombre: "Enero" },
  { id: 2, nombre: "Febrero" },
  { id: 3, nombre: "Marzo" },
  { id: 4, nombre: "Abril" },
  { id: 5, nombre: "Mayo" },
  { id: 6, nombre: "Junio" },
  { id: 7, nombre: "Julio" },
  { id: 8, nombre: "Agosto" },
  { id: 9, nombre: "Septiembre" },
  { id: 10, nombre: "Octubre" },
  { id: 11, nombre: "Noviembre" },
  { id: 12, nombre: "Diciembre" },
];

export default function PublicarEventoScreen() {
  const router = useRouter();

  // ESTADOS DEL FORMULARIO
  const [nombre, setNombre] = useState("");
  const [lugar, setLugar] = useState("");
  const [personas, setPersonas] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // ESTADOS DE LA FECHA
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState<{ id: number; nombre: string } | null>(null);
  const [anio, setAnio] = useState("");

  // ESTADOS DE LA INTERFAZ
  const [modalMesVisible, setModalMesVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const clearError = () => setErrorMsg("");

  // LÓGICA DE PUBLICACIÓN (CONEXIÓN AL BACKEND)
  const handlePublish = async () => {
    setErrorMsg("");

    // Validación de campos vacíos generales
    if (!nombre || !lugar || !personas || !descripcion) {
      setErrorMsg("Completá todos los campos");
      return;
    }

    // Validación de campos de fecha vacíos
    if (!dia || !mes || !anio) {
      setErrorMsg("Completá toda la fecha (Día, Mes y Año)");
      return;
    }

    const diaNum = parseInt(dia, 10);
    const anioNum = parseInt(anio, 10);

    // Validación matemática de días según el mes y año (calcula bisiestos automáticamente)
    // En JavaScript, el día "0" del mes siguiente nos da el último día del mes actual.
    const diasDelMes = new Date(anioNum, mes.id, 0).getDate();

    if (diaNum < 1 || diaNum > diasDelMes) {
      setErrorMsg(`${mes.nombre} del ${anioNum} solo tiene ${diasDelMes} días`);
      return;
    }

    // Validación de fecha en el pasado
    // Nota: En JavaScript los meses van del 0 (Enero) al 11 (Diciembre), por eso restamos 1
    const fechaIngresada = new Date(anioNum, mes.id - 1, diaNum);
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0); // Comparamos solo la fecha, ignorando la hora actual

    if (fechaIngresada < fechaHoy) {
      setErrorMsg("La fecha del evento no puede ser anterior a hoy");
      return;
    }

    // Formatear la fecha para Laravel (YYYY-MM-DD)
    const diaFormateado = String(diaNum).padStart(2, "0"); // Rellena con 0 si no tiene longitud 2
    const mesFormateado = String(mes.id).padStart(2, "0");
    const fechaParaBackend = `${anioNum}-${mesFormateado}-${diaFormateado}`;

    setIsLoading(true);

    try {
      // Petición POST al backend con los nombres de atributos en inglés (como en la BD)
      await api.post("/events", {
        title: nombre,
        event_date: fechaParaBackend,
        location: lugar,
        guests_count: parseInt(personas, 10), // Aseguramos que sea un número entero
        requirements: descripcion,
      });

      // Si se crea exitosamente, volvemos a la Home (o a la pantalla de confirmación)
      // Como la Home tiene un useFocusEffect, recargará los eventos automáticamente
      router.replace("/confirmacion-publicacion");
    } catch (error: any) {
      const mensaje =
        error.response?.data?.message ||
        "Ocurrió un error al publicar el evento.";
      setErrorMsg(mensaje);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* ENCABEZADO */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publicar evento</Text>
      </View>

      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FORMULARIO PRINCIPAL */}
        <Text style={styles.label}>Nombre del evento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Cumpleaños de Ana..."
          value={nombre}
          onChangeText={(t) => {
            setNombre(t);
            clearError();
          }}
        />

        {/* FILA DE FECHA PERSONALIZADA */}
        <Text style={styles.label}>Fecha del evento</Text>
        <View style={styles.dateRow}>
          {/* INPUT DÍA */}
          <TextInput
            style={[styles.input, styles.dateInput, { flex: 1 }]}
            placeholder="Día"
            value={dia}
            onChangeText={(t) => {
              setDia(t.replace(/[^0-9]/g, ""));
              clearError();
            }}
            keyboardType="numeric"
            maxLength={2}
          />

          {/* SELECTOR MES */}
          <TouchableOpacity
            style={[styles.input, styles.dateSelector, { flex: 2 }]}
            onPress={() => {
              setModalMesVisible(true);
              clearError();
            }}
          >
            <Text style={{ color: mes ? "#111" : "#999", fontSize: 16 }}>
              {mes ? mes.nombre : "Mes"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#D1D1D1" />
          </TouchableOpacity>

          {/* INPUT AÑO */}
          <TextInput
            style={[styles.input, styles.dateInput, { flex: 1.2 }]}
            placeholder="Año"
            value={anio}
            onChangeText={(t) => {
              setAnio(t.replace(/[^0-9]/g, ""));
              clearError();
            }}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        {/* RESTO DEL FORMULARIO */}
        <Text style={styles.label}>Lugar</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección o nombre del salón"
          value={lugar}
          onChangeText={(t) => {
            setLugar(t);
            clearError();
          }}
        />

        <Text style={styles.label}>Cantidad de personas</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 100"
          value={personas}
          onChangeText={(t) => {
            setPersonas(t.replace(/[^0-9]/g, ""));
            clearError();
          }}
          keyboardType="numeric"
        />

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Descripción de bebidas necesarias</Text>
          <Text style={styles.subLabel}>
            Cuanto más detallada, mejores ofertas vas a recibir
          </Text>
        </View>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ej: 3 cajones de cerveza, 30 gaseosas variadas..."
          value={descripcion}
          onChangeText={(t) => {
            setDescripcion(t);
            clearError();
          }}
          multiline={true}
          textAlignVertical="top"
        />

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        {/* BOTÓN DE ACCIÓN */}
        <Button
          title="Publicar evento"
          onPress={handlePublish}
          loading={isLoading}
        />
      </ScrollView>

      {/* MODAL PARA SELECCIONAR EL MES */}
      <Modal visible={modalMesVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccioná un mes</Text>
            <FlatList
              data={MESES}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.monthOption,
                    mes?.id === item.id && styles.monthOptionSelected,
                  ]}
                  onPress={() => {
                    setMes(item);
                    setModalMesVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.monthOptionText,
                      mes?.id === item.id && styles.monthOptionTextSelected,
                    ]}
                  >
                    {item.nombre}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalMesVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // CONTENEDORES PRINCIPALES
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContent: {
    flex: 1,
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

  // FORMULARIO Y TEXTOS
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 13,
    color: "#AAA",
    marginTop: -4,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },

  // SELECTOR DE FECHA
  dateRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  dateInput: {
    marginBottom: 0,
    textAlign: "center",
  },
  dateSelector: {
    marginBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  // BOTONES Y ERRORES
  errorText: {
    color: "#C0392B",
    fontSize: 14,
    marginBottom: 16,
    marginTop: -4,
  },

  // MODAL DE MESES (Flat Design)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: "70%",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 16,
    textAlign: "center",
  },
  monthOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    alignItems: "center",
  },
  monthOptionSelected: {
    backgroundColor: "#FFF0E5",
  },
  monthOptionText: {
    fontSize: 16,
    color: "#333",
  },
  monthOptionTextSelected: {
    color: "#E8321E",
    fontWeight: "bold",
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalCloseText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
});
