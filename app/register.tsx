import Button from "@/components/Button";
import HeaderBackButton from "@/components/HeaderBackButton";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();

  // Estados de interfaz
  const [role, setRole] = useState<"organizador" | "proveedor">("organizador");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // FUNCIONES DE VALIDACIÓN
  const isValidEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const isValidPhone = (phoneStr: string) => {
    return /^\+?[0-9\s\-]{8,20}$/.test(phoneStr);
  };

  const clearError = () => setErrorMsg("");

  // LÓGICA DE REGISTRO CON LARAVEL
  const handleRegister = async () => {
    setErrorMsg("");

    // Validación general de campos vacíos
    if (!name || !email || !phone || !password || !confirmPassword) {
      setErrorMsg("Completá todos los campos.");
      return;
    }

    // Validación específica para proveedor
    if (role === "proveedor" && !businessName) {
      setErrorMsg("Ingresá el nombre de tu negocio.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMsg(
        "El correo electrónico debe ser una dirección de correo válida.",
      );
      return;
    }

    if (!isValidPhone(phone)) {
      setErrorMsg("Ingresá un número de teléfono válido.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      // Petición POST al backend
      const respuesta = await api.post("/register", {
        name: name,
        email: email.toLowerCase().trim(),
        phone: phone,
        password: password,
        password_confirmation: confirmPassword, // Laravel exige confirmación
        role: role,
        company_name: role === "proveedor" ? businessName : null, // Solo se envía si es proveedor
      });

      // Obtenemos los datos y el token
      const { token, user } = respuesta.data;

      // Guardamos la sesión
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userRole", user.role);
      await AsyncStorage.setItem("userId", user.id.toString());

      // Redirigimos al home correspondiente
      if (user.role === "organizador") {
        router.replace("/(tabs-org)/home-organizador");
      } else if (user.role === "proveedor") {
        router.replace("/(tabs-prov)/home-proveedor");
      }
    } catch (error: any) {
      // Si Laravel devuelve error (ej. email ya registrado), lo mostramos
      const mensaje =
        error.response?.data?.message || "Error al registrar la cuenta";
      setErrorMsg(mensaje);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ENCABEZADO */}
      <HeaderBackButton title="Crear cuenta" />

      <View style={styles.mainContent}>
        {/* SELECTOR DE ROLES (TABS) */}
        <View style={styles.tabsWrapper}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                role === "organizador" ? styles.activeTab : null,
              ]}
              onPress={() => {
                setRole("organizador");
                clearError();
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  role === "organizador" ? styles.activeTabText : null,
                ]}
              >
                Organizador
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                role === "proveedor" ? styles.activeTab : null,
              ]}
              onPress={() => {
                setRole("proveedor");
                clearError();
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  role === "proveedor" ? styles.activeTabText : null,
                ]}
              >
                Proveedor
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FORMULARIO */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan García"
            value={name}
            onChangeText={(t) => {
              setName(t);
              clearError();
            }}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              clearError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Teléfono / WhatsApp</Text>
          <TextInput
            style={styles.input}
            placeholder="+54 11 1234-5678"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              clearError();
            }}
            keyboardType="phone-pad"
          />

          {/* CAMPO CONDICIONAL: Solo para proveedores */}
          {role === "proveedor" ? (
            <View>
              <Text style={styles.label}>Nombre del negocio / empresa</Text>
              <TextInput
                style={styles.input}
                placeholder="Bebidas del Sur SRL"
                value={businessName}
                onChangeText={(t) => {
                  setBusinessName(t);
                  clearError();
                }}
              />
            </View>
          ) : null}

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mínimo 8 caracteres"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                clearError();
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Repetí tu contraseña"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              clearError();
            }}
          />

          {/* MENSAJE DE ERROR */}
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* BOTÓN REGISTRAR */}
          <Button
            title="Crear cuenta"
            onPress={handleRegister}
            loading={isLoading}
          />

          {/* ENLACE AL INICIO DE SESIÓN */}
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.footerLink}
          >
            <Text style={styles.footerText}>
              ¿Ya tenés cuenta?{" "}
              <Text style={styles.footerTextBold}>Iniciar sesión</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // CONTENEDORES GENERALES
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
  },

  // SELECTOR DE TABS (ROLES)
  tabsWrapper: {
    paddingHorizontal: 24,
    marginTop: 24, // Espacio entre el header y los tabs
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: -1,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#E8321E",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTabText: {
    color: "#E8321E",
    fontWeight: "bold",
  },

  // FORMULARIO E INPUTS
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0, // Corrije espacio de más
    fontSize: 16,
  },
  errorText: {
    color: "#C0392B",
    fontSize: 14,
    marginBottom: 12,
    marginTop: -4,
  },

  // BOTONES Y ENLACES
  footerLink: {
    alignItems: "center",
    marginTop: 16,
  },
  footerText: {
    color: "#888",
    fontSize: 14,
  },
  footerTextBold: {
    color: "#E8321E",
    fontWeight: "bold",
  },
});
