import { Ionicons } from "@expo/vector-icons";
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
  const [role, setRole] = useState<"organizador" | "proveedor">("organizador");
  const [showPassword, setShowPassword] = useState(false);

  // Estados para los campos
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  // Expresión regular simple para validar formato de email
  const isValidEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  // Función para validar formato de teléfono
  const isValidPhone = (phoneStr: string) => {
    // Permite un '+' opcional, números, espacios y guiones (entre 8 y 20 caracteres en total)
    return /^\+?[0-9\s\-]{8,20}$/.test(phoneStr);
  };

  const handleRegister = () => {
    setErrorMsg("");

    // Validación general de campos vacíos
    if (!name || !email || !phone || !password || !confirmPassword) {
      setErrorMsg("Completá todos los campos");
      return;
    }

    // Validación específica para proveedor
    if (role === "proveedor" && !businessName) {
      setErrorMsg("Ingresá el nombre de tu negocio");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMsg("El email ingresado no es válido");
      return;
    }

    if (!isValidPhone(phone)) {
      setErrorMsg("Ingresá un número de teléfono válido");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    // Si todo está bien, simulamos que va al home correspondiente
    if (role === "organizador") {
      router.push("/home-organizador");
    } else {
      router.push("/home-proveedor");
    }
  };

  const clearError = () => setErrorMsg("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear cuenta</Text>
      </View>

      {/* RESTO DE LA PANTALLA */}
      <View style={styles.mainContent}>
        {/* ENVOLTORIO DE TABS CON ESPACIO ARRIBA Y MARGENES LATERALES */}
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
              placeholder="Mínimo 6 caracteres"
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

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Crear cuenta</Text>
          </TouchableOpacity>

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
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginLeft: 16, // Separación entre la flecha y el texto
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
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
  scrollContent: {
    padding: 24,
  },
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
    fontSize: 16,
  },
  errorText: {
    color: "#C0392B",
    fontSize: 14,
    marginBottom: 12,
    marginTop: -4,
  }, // Ajustado para que quede cerca de los inputs
  registerButton: {
    backgroundColor: "#E8321E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
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
