import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para guardar el token
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator, // Spinner de carga
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// IP LOCAL DE LA PC
const API_URL = "http://192.168.100.4:8000/api";

export default function LoginScreen() {
  const router = useRouter();

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Indicador para el spinner

  // Función para rellenar usuario demo
  const handleDemoLogin = (role: "org" | "prov") => {
    setErrorMsg("");
    if (role === "org") {
      setEmail("maria@demo.com");
      setPassword("123456");
    } else {
      setEmail("carlos@demo.com");
      setPassword("password123");
    }
  };

  // Lógica de inicio de sesión con Laravel
  const handleLogin = async () => {
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Completá todos los campos.");
      return;
    }

    setIsLoading(true); // Se muestra spinner

    try {
      // Enviamos credenciales al backend
      const respuesta = await axios.post(`${API_URL}/login`, {
        email: email.toLowerCase().trim(),
        password: password,
      });

      // Extraemos el token y el usuario de la respuesta
      const { token, user } = respuesta.data;

      // Guardamos los datos (sesión) en el celular de forma persistente
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userRole", user.role);
      await AsyncStorage.setItem("userId", user.id.toString());

      // Redirección según el rol de la base de datos
      if (user.role === "organizador") {
        router.replace("/(tabs-org)/home-organizador");
        // TODO: cambiar "bodega" por "proveedor" en BD
      } else if (user.role === "bodega") {
        router.replace("/(tabs-prov)/home-proveedor");
      } else {
        setErrorMsg("Rol no reconocido en la aplicación");
      }
    } catch (error: any) {
      // Manejo de errores de Laravel (credenciales incorrectas)
      const mensaje =
        error.response?.data?.message || "Error al conectar con el servidor";
      setErrorMsg(mensaje);
    } finally {
      setIsLoading(false); // Se oculta spinner
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ENCABEZADO Y LOGO */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo1.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>TomateToda</Text>
        <Text style={styles.subtitle}>Iniciá sesión para continuar</Text>
      </View>

      {/* CAJA DE ACCESOS DIRECTOS (DEMO) */}
      <View style={styles.demoBox}>
        <Text style={styles.demoTitle}>Acceso demo rápido</Text>
        <View style={styles.demoButtons}>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => handleDemoLogin("org")}
          >
            <Text style={styles.demoBtnText}>Organizador</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => handleDemoLogin("prov")}
          >
            <Text style={styles.demoBtnText}>Proveedor</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FORMULARIO DE INGRESO */}
      <View style={styles.form}>
        {/* Campo Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMsg("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Campo Contraseña */}
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrorMsg("");
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Mensaje de Error */}
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        {/* Recuperar Contraseña */}
        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* Botón de inicio de sesión */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* PIE DE PÁGINA (REGISTRO) */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.registerText}>
            ¿No tenés cuenta?{" "}
            <Text style={styles.registerTextBold}>Registrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // CONTENEDOR PRINCIPAL
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  // ENCABEZADO Y LOGO
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginTop: 4,
  },

  // ACCESO DEMO
  demoBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 24,
  },
  demoTitle: {
    fontSize: 12,
    color: "#888",
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  demoBtnText: {
    color: "#333",
    fontSize: 14,
  },

  // FORMULARIO E INPUTS
  form: {
    marginBottom: 16,
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
  },
  forgotText: {
    color: "#E8321E",
    textAlign: "right",
    fontSize: 14,
    marginBottom: 16,
  },

  // PIE DE PÁGINA (BOTON Y REGISTRO)
  loginButton: {
    backgroundColor: "#E8321E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
  },
  registerText: {
    color: "#888",
    fontSize: 14,
  },
  registerTextBold: {
    color: "#E8321E",
    fontWeight: "bold",
  },
});
